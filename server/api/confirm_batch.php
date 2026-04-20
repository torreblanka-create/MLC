<?php
/**
 * api/confirm_batch.php — Confirma o rechaza un lote y envía credenciales
 * POST { batch_id, accion: 'confirmar'|'rechazar' }
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

define('QUEUE_DIR',     __DIR__ . '/../data/queue');
define('PROCESSED_DIR', __DIR__ . '/../data/processed');
define('STUDENTS_FILE', __DIR__ . '/../data/students.json');
define('PLAZO_DIAS',    15);

$body     = json_decode(file_get_contents('php://input'), true) ?? [];
$batch_id = trim($body['batch_id'] ?? '');
$accion   = trim($body['accion'] ?? '');

if (!$batch_id || !in_array($accion, ['confirmar', 'rechazar'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Parámetros inválidos']);
    exit;
}

$batch_file = QUEUE_DIR . "/$batch_id.json";
if (!file_exists($batch_file)) {
    http_response_code(404);
    echo json_encode(['error' => 'Lote no encontrado']);
    exit;
}

$batch = json_decode(file_get_contents($batch_file), true);

if ($accion === 'rechazar') {
    $batch['estado'] = 'rechazado';
    file_put_contents($batch_file, json_encode($batch, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    rename($batch_file, PROCESSED_DIR . "/$batch_id.json");
    echo json_encode(['ok' => true, 'accion' => 'rechazado']);
    exit;
}

// ── Confirmar: inscribir alumnos ──────────────────────────────────────────────
$students = file_exists(STUDENTS_FILE)
    ? (json_decode(file_get_contents(STUDENTS_FILE), true) ?? [])
    : [];

$fecha_inscripcion = date('Y-m-d');
$fecha_vencimiento = date('Y-m-d', strtotime("+$plazo_dias days"));
$inscrito_count    = 0;

foreach ($batch['alumnos'] as $alumno) {
    $rut = normalizar_rut($alumno['rut']);

    // Si ya existe, actualizar cursos; si no, crear
    $idx = array_search($rut, array_column($students, 'rut'));
    if ($idx !== false) {
        // Agregar nuevos cursos sin duplicar
        $existing = $students[$idx]['cursos'] ?? [];
        foreach ($alumno['cursos'] as $c) {
            if (!in_array($c, $existing)) $existing[] = $c;
        }
        $students[$idx]['cursos']     = $existing;
        $students[$idx]['inscrito']   = $fecha_inscripcion;
        $students[$idx]['vencimiento']= $fecha_vencimiento;
        $students[$idx]['estado']     = 'pendiente';
    } else {
        $pwd = generar_password();
        $students[] = [
            'nombre'      => $alumno['nombre'],
            'rut'         => $rut,
            'email'       => strtolower($alumno['email']),
            'password'    => password_hash($pwd, PASSWORD_DEFAULT),
            'pwd_plain'   => $pwd, // solo para el envío inicial; eliminar tras el deploy
            'cursos'      => $alumno['cursos'],
            'inscrito'    => $fecha_inscripcion,
            'vencimiento' => $fecha_vencimiento,
            'estado'      => 'pendiente',
            'inscritor'   => $batch['remitente'],
        ];
        enviar_credenciales($alumno['email'], $alumno['nombre'], $rut, $pwd, $alumno['cursos'], $fecha_vencimiento);
        $inscrito_count++;
    }
}

file_put_contents(STUDENTS_FILE, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Marcar lote como confirmado y mover a processed
$batch['estado']     = 'confirmado';
$batch['confirmado'] = date('c');
$batch['inscritos']  = $inscrito_count;
file_put_contents($batch_file, json_encode($batch, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
rename($batch_file, PROCESSED_DIR . "/$batch_id.json");

// Notificar al remitente original
notificar_remitente($batch['remitente'], $batch['nombre_remit'], $batch['alumnos'], $fecha_vencimiento);

echo json_encode([
    'ok'       => true,
    'inscritos' => $inscrito_count,
    'vencimiento' => $fecha_vencimiento,
]);


// ════════════════════════════════════════════════════════════════════════════
// FUNCIONES
// ════════════════════════════════════════════════════════════════════════════

function normalizar_rut(string $rut): string {
    return preg_replace('/[^0-9kK\-]/', '', $rut);
}

function generar_password(int $len = 10): string {
    $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#';
    $pwd = '';
    for ($i = 0; $i < $len; $i++) $pwd .= $chars[random_int(0, strlen($chars) - 1)];
    return $pwd;
}

function cursos_label(array $cursos): string {
    $map = [
        'mina_cabildo'   => 'Inducción Mina Cabildo',
        'mina_taltal'    => 'Inducción Mina Taltal',
        'planta_cabildo' => 'Inducción Planta Cabildo',
        'planta_taltal'  => 'Inducción Planta Taltal',
    ];
    return implode(', ', array_map(fn($c) => $map[$c] ?? $c, $cursos));
}

function enviar_credenciales(string $to, string $nombre, string $rut, string $pwd, array $cursos, string $vence): void {
    $subject = 'Tus credenciales de acceso — Plataforma de Inducción GMLC';
    $cursos_txt = cursos_label($cursos);
    $body = "Estimado/a $nombre,\n\n"
          . "Has sido inscrito/a en la Plataforma de Inducción de Tecktur SpA.\n\n"
          . "── TUS CREDENCIALES ──────────────────────────\n"
          . "  Usuario (RUT): $rut\n"
          . "  Contraseña   : $pwd\n"
          . "  Plataforma   : https://induccion.gmlc.cl\n\n"
          . "── CURSOS ASIGNADOS ──────────────────────────\n"
          . "  $cursos_txt\n\n"
          . "── PLAZO ─────────────────────────────────────\n"
          . "  Tienes 15 días para completar tu inducción.\n"
          . "  Fecha límite: $vence\n\n"
          . "  Si no completas el curso antes del plazo, tus datos serán eliminados\n"
          . "  y deberás ser reinscrito por tu supervisor.\n\n"
          . "Cualquier consulta, escríbenos a inducciones@tecktur.cl\n\n"
          . "Sistema de Inducción — GMLC / Tecktur SpA.";
    mail($to, $subject, $body, "From: inducciones@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}

function notificar_remitente(string $to, string $nombre, array $alumnos, string $vence): void {
    $n = count($alumnos);
    $subject = "Inscripción confirmada — $n alumno" . ($n > 1 ? 's' : '') . " inscritos";
    $lista = implode("\n", array_map(fn($a) => "  - {$a['nombre']} ({$a['rut']})", $alumnos));
    $body = "Estimado/a $nombre,\n\n"
          . "La inscripción ha sido confirmada. Los siguientes alumnos recibieron sus credenciales:\n\n"
          . "$lista\n\n"
          . "Plazo de inducción: 15 días (vence el $vence)\n\n"
          . "Si algún alumno no completa su inducción antes del plazo, recibirás una notificación\n"
          . "y deberás gestionar su reinscripción desde el panel de administración.\n\n"
          . "Sistema de Inducción — GMLC";
    mail($to, $subject, $body, "From: inducciones@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}
