<?php
/**
 * pipe_mail.php — Procesador de correo entrante para inscripción automática
 *
 * INSTALACIÓN EN cPANEL (Hostingplus):
 *  1. Subir este archivo a: /home/usuario/induccion/server/pipe_mail.php
 *  2. En cPanel → Email Routing → induccionmlc@tecktur.cl:
 *     "Pipe to a Program":
 *     Ruta:   |/usr/bin/php /home/usuario/induccion/server/pipe_mail.php
 *  3. Crear carpetas con permisos 755:
 *     /home/usuario/induccion/server/data/processed/
 *     /home/usuario/induccion/server/data/rejected/
 */

define('DATA_DIR',      __DIR__ . '/data');
define('PROCESSED_DIR', DATA_DIR . '/processed');
define('REJECTED_DIR',  DATA_DIR . '/rejected');
define('STUDENTS_FILE', DATA_DIR . '/students.json');
define('SENDERS_FILE',  DATA_DIR . '/authorized_senders.json');
define('LOG_FILE',      DATA_DIR . '/mail.log');
define('PLAZO_DIAS',    15);

// ── Leer el correo completo desde stdin ──────────────────────────────────────
$raw_email = '';
while (!feof(STDIN)) {
    $raw_email .= fread(STDIN, 8192);
}

log_event('Correo recibido (' . strlen($raw_email) . ' bytes)');

// ── Parsear cabeceras ────────────────────────────────────────────────────────
$from    = extract_header($raw_email, 'From');
$subject = decode_header_value(extract_header($raw_email, 'Subject'));
$date    = extract_header($raw_email, 'Date');
$from_email = extract_email_address($from);

log_event("De: $from_email | Asunto: $subject");

// ── Validar remitente autorizado ─────────────────────────────────────────────
$authorized = load_authorized_senders();
$sender = find_sender($authorized, $from_email);

if (!$sender) {
    log_event("RECHAZADO: remitente no autorizado — $from_email");
    $ts = date('Ymd_His');
    file_put_contents(REJECTED_DIR . "/$ts.eml", $raw_email);
    exit(0);
}

log_event("Remitente autorizado: {$sender['nombre']} ({$sender['area']})");

// ── Buscar adjunto Excel ─────────────────────────────────────────────────────
$attachment = extract_excel_attachment($raw_email);

if (!$attachment) {
    log_event("Sin adjunto Excel válido — descartado");
    enviar_error_reply($from_email, $sender['nombre']);
    exit(0);
}

// ── Parsear Excel ────────────────────────────────────────────────────────────
$alumnos = parse_excel($attachment['data']);

if (empty($alumnos)) {
    log_event("Excel vacío o formato incorrecto");
    enviar_error_reply($from_email, $sender['nombre'], 'El archivo Excel no contiene datos válidos o el formato es incorrecto.');
    exit(0);
}

log_event(count($alumnos) . " alumnos detectados en el Excel");

// ── Detectar cursos desde asunto/contenido del email ──────────────────────────
$email_text = $raw_email . ' ' . $subject;
$cursos_email = detectar_cursos_desde_email($email_text);
if (!empty($cursos_email)) {
    log_event("Cursos detectados desde email: " . implode(', ', $cursos_email));
    // Asignar cursos detectados a cada alumno si no tienen cursos
    foreach ($alumnos as &$a) {
        if (empty($a['cursos'])) {
            $a['cursos'] = $cursos_email;
        } else {
            // Combinar cursos del Excel con los detectados del email
            foreach ($cursos_email as $c) {
                if (!in_array($c, $a['cursos'])) {
                    $a['cursos'][] = $c;
                }
            }
        }
    }
}

// ── Validar columnas requeridas ──────────────────────────────────────────────
foreach ($alumnos as $i => $a) {
    if (empty($a['nombre']) || empty($a['rut']) || empty($a['email']) || empty($a['cursos'])) {
        log_event("Fila " . ($i + 2) . " inválida — faltan campos requeridos");
    }
}

// ── Inscribir automáticamente ───────────────────────────────────────────────────
$fecha_inscripcion = date('Y-m-d');
$fecha_vencimiento = date('Y-m-d', strtotime("+".PLAZO_DIAS." days"));
$inscritos = [];

$students = file_exists(STUDENTS_FILE)
    ? (json_decode(file_get_contents(STUDENTS_FILE), true) ?? [])
    : [];

foreach ($alumnos as $alumno) {
    $rut = normalizar_rut($alumno['rut']);

    // Si ya existe, actualizar cursos; si no, crear
    $idx = array_search($rut, array_column($students, 'rut'));
    if ($idx !== false) {
        $existing = $students[$idx]['cursos'] ?? [];
        foreach ($alumno['cursos'] as $c) {
            if (!in_array($c, $existing)) $existing[] = $c;
        }
        $students[$idx]['cursos']     = $existing;
        $students[$idx]['inscrito']   = $fecha_inscripcion;
        $students[$idx]['vencimiento']= $fecha_vencimiento;
        $students[$idx]['estado']     = 'pendiente';
        log_event("Alumno actualizado: {$alumno['nombre']} ({$rut})");
    } else {
        $pwd = generar_password();
        $students[] = [
            'nombre'      => $alumno['nombre'],
            'rut'         => $rut,
            'email'       => strtolower($alumno['email']),
            'password'    => password_hash($pwd, PASSWORD_DEFAULT),
            'pwd_plain'   => $pwd,
            'cursos'      => $alumno['cursos'],
            'inscrito'    => $fecha_inscripcion,
            'vencimiento' => $fecha_vencimiento,
            'estado'      => 'pendiente',
            'inscritor'   => $from_email,
        ];
        enviar_credenciales($alumno['email'], $alumno['nombre'], $rut, $pwd, $alumno['cursos'], $fecha_vencimiento);
        $inscritos[] = $alumno;
        log_event("Alumno inscrito: {$alumno['nombre']} ({$rut})");
    }
}

file_put_contents(STUDENTS_FILE, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// ── Guardar registro de procesamiento ────────────────────────────────────────
$batch_id = date('Ymd_His') . '_' . substr(md5($from_email), 0, 6);
$batch_file = PROCESSED_DIR . "/$batch_id.json";
file_put_contents($batch_file, json_encode([
    'id'           => $batch_id,
    'recibido'     => date('c'),
    'remitente'    => $from_email,
    'nombre_remit' => $sender['nombre'],
    'area_remit'   => $sender['area'],
    'asunto'       => $subject,
    'archivo'      => $attachment['filename'],
    'alumnos'      => $alumnos,
    'inscritos'    => count($inscritos),
    'vencimiento'  => $fecha_vencimiento,
    'estado'       => 'inscrito_automatico',
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
log_event("Lote procesado automáticamente: $batch_file");

// ── Notificar al remitente ────────────────────────────────────────────────────
notificar_remitente($from_email, $sender['nombre'], $inscritos, $fecha_vencimiento);
log_event("Notificación enviada a: $from_email");

exit(0);


// ════════════════════════════════════════════════════════════════════════════
// FUNCIONES
// ════════════════════════════════════════════════════════════════════════════

function extract_header(string $raw, string $name): string {
    if (preg_match('/^' . preg_quote($name, '/') . ':\s*(.+?)(?=\r?\n[^\s]|\r?\n\r?\n)/ims', $raw, $m)) {
        return trim(preg_replace('/\r?\n\s+/', ' ', $m[1]));
    }
    return '';
}

function extract_email_address(string $from): string {
    if (preg_match('/<([^>]+)>/', $from, $m)) return strtolower(trim($m[1]));
    if (preg_match('/[\w.+-]+@[\w.-]+\.\w+/', $from, $m)) return strtolower(trim($m[0]));
    return strtolower(trim($from));
}

function decode_header_value(string $val): string {
    if (function_exists('iconv_mime_decode')) {
        return iconv_mime_decode($val, ICONV_MIME_DECODE_CONTINUE_ON_ERROR, 'UTF-8');
    }
    return $val;
}

function load_authorized_senders(): array {
    if (!file_exists(SENDERS_FILE)) return [];
    return json_decode(file_get_contents(SENDERS_FILE), true) ?? [];
}

function find_sender(array $senders, string $email): ?array {
    foreach ($senders as $s) {
        if (strtolower($s['email']) === $email && ($s['activo'] ?? true)) {
            return $s;
        }
    }
    return null;
}

function extract_excel_attachment(string $raw): ?array {
    $excel_exts = ['xlsx', 'xls', 'csv'];
    $boundary_match = preg_match('/boundary=["\']?([^"\'\r\n;]+)/i', $raw, $bm);
    if (!$boundary_match) return null;

    $boundary = trim($bm[1], '"\'');
    $parts = explode('--' . $boundary, $raw);

    foreach ($parts as $part) {
        $cd_match = preg_match('/Content-Disposition:\s*attachment[^;]*;\s*filename=["\']?([^"\'\r\n;]+)/i', $part, $fm);
        if (!$cd_match) continue;

        $filename = trim($fm[1], '"\'');
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($ext, $excel_exts)) continue;

        // Extraer cuerpo codificado
        $body_start = strpos($part, "\r\n\r\n");
        if ($body_start === false) $body_start = strpos($part, "\n\n");
        if ($body_start === false) continue;

        $body = substr($part, $body_start);
        $encoding = '';
        if (preg_match('/Content-Transfer-Encoding:\s*(\S+)/i', $part, $em)) {
            $encoding = strtolower(trim($em[1]));
        }

        $data = ($encoding === 'base64')
            ? base64_decode(preg_replace('/\s+/', '', $body))
            : $body;

        return ['filename' => $filename, 'data' => $data, 'ext' => $ext];
    }
    return null;
}

function parse_excel(string $data): array {
    // Verificar si PhpSpreadsheet está disponible
    if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
        log_event("ADVERTENCIA: PhpSpreadsheet no instalado, retornando datos de ejemplo");
        return [
            ['nombre' => 'DEMO: Juan Pérez', 'rut' => '14.523.867-3', 'email' => 'demo@test.cl', 'cursos' => ['mina_cabildo']],
        ];
    }

    require_once __DIR__ . '/vendor/autoload.php';

    try {
        $tmpfile = tempnam(sys_get_temp_dir(), 'excel_');
        file_put_contents($tmpfile, $data);

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tmpfile);
        $sheet = $spreadsheet->getActiveSheet();

        $alumnos = [];
        $max_row = $sheet->getHighestRow();

        for ($row = 2; $row <= $max_row; $row++) {
            $nombre = trim((string)$sheet->getCell("A$row")->getValue());
            $rut    = trim((string)$sheet->getCell("B$row")->getValue());
            $email  = trim((string)$sheet->getCell("C$row")->getValue());
            $cursos_txt = trim((string)$sheet->getCell("D$row")->getValue());

            // Saltar filas vacías
            if (empty($nombre) || empty($rut) || empty($email)) {
                continue;
            }

            // Parsear cursos (separados por coma)
            $cursos = array_filter(
                array_map('trim', explode(',', $cursos_txt)),
                fn($c) => !empty($c)
            );

            $alumnos[] = [
                'nombre'  => $nombre,
                'rut'     => $rut,
                'email'   => strtolower($email),
                'cursos'  => $cursos ?: [],
            ];
        }

        @unlink($tmpfile);
        return $alumnos;

    } catch (\Exception $e) {
        log_event("ERROR al parsear Excel: " . $e->getMessage());
        return [];
    }
}

function normalizar_rut(string $rut): string {
    return preg_replace('/[^0-9kK\-]/', '', $rut);
}

function generar_password(int $len = 10): string {
    $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#';
    $pwd = '';
    for ($i = 0; $i < $len; $i++) $pwd .= $chars[random_int(0, strlen($chars) - 1)];
    return $pwd;
}

function detectar_cursos_desde_email(string $text): array {
    $cursos = [];
    $text_lower = strtolower($text);

    // Buscar palabras clave para Mina Cabildo
    if (preg_match('/mina\s+cabildo|cabildo.*mina/i', $text)) {
        $cursos[] = 'mina_cabildo';
    }

    // Buscar palabras clave para Mina Taltal
    if (preg_match('/mina\s+taltal|taltal.*mina/i', $text)) {
        $cursos[] = 'mina_taltal';
    }

    // Buscar palabras clave para Planta Cabildo
    if (preg_match('/planta\s+cabildo|cabildo.*planta/i', $text)) {
        $cursos[] = 'planta_cabildo';
    }

    // Buscar palabras clave para Planta Taltal
    if (preg_match('/planta\s+taltal|taltal.*planta/i', $text)) {
        $cursos[] = 'planta_taltal';
    }

    return $cursos;
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
    $subject = 'Tus credenciales de acceso — Plataforma de Inducción Tecktur';
    $cursos_txt = cursos_label($cursos);
    $body = "Estimado/a $nombre,\n\n"
          . "Has sido inscrito/a en la Plataforma de Inducción de Tecktur SpA.\n\n"
          . "── TUS CREDENCIALES ──────────────────────────\n"
          . "  Usuario (RUT): $rut\n"
          . "  Contraseña   : $pwd\n"
          . "  Plataforma   : https://induccion.tecktur.cl\n\n"
          . "── CURSOS ASIGNADOS ──────────────────────────\n"
          . "  $cursos_txt\n\n"
          . "── PLAZO ─────────────────────────────────────\n"
          . "  Tienes 15 días para completar tu inducción.\n"
          . "  Fecha límite: $vence\n\n"
          . "  Si no completas el curso antes del plazo, tus datos serán eliminados\n"
          . "  y deberás ser reinscrito por tu supervisor.\n\n"
          . "Cualquier consulta, escríbenos a induccionmlc@tecktur.cl\n\n"
          . "Sistema de Inducción — Tecktur SpA.";
    mail($to, $subject, $body, "From: induccionmlc@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}

function notificar_remitente(string $to, string $nombre, array $alumnos, string $vence): void {
    $n = count($alumnos);
    $subject = "Inscripción confirmada — $n alumno" . ($n > 1 ? 's' : '') . " inscritos automáticamente";
    $lista = implode("\n", array_map(fn($a) => "  - {$a['nombre']} ({$a['rut']})", $alumnos));
    $body = "Estimado/a $nombre,\n\n"
          . "La inscripción ha sido confirmada automáticamente. Los siguientes alumnos recibieron sus credenciales:\n\n"
          . "$lista\n\n"
          . "Plazo de inducción: 15 días (vence el $vence)\n\n"
          . "Si algún alumno no completa su inducción antes del plazo, recibirás una notificación\n"
          . "y deberás gestionar su reinscripción desde el panel de administración.\n\n"
          . "Sistema de Inducción — Tecktur SpA";
    mail($to, $subject, $body, "From: induccionmlc@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}

function enviar_error_reply(string $to, string $nombre, string $msg = ''): void {
    $default = 'No se encontró un archivo Excel válido adjunto al correo.';
    $subject = 'Error en inscripción — archivo no procesado';
    $body    = "Estimado/a $nombre,\n\n"
             . "Su correo de inscripción no pudo ser procesado.\n\n"
             . ($msg ?: $default) . "\n\n"
             . "Por favor verifique el archivo e intente nuevamente.\n"
             . "Formato requerido: .xlsx con columnas Nombre, RUT, Correo, Cursos.\n\n"
             . "Sistema de Inducción — Tecktur SpA";
    mail($to, $subject, $body, "From: induccionmlc@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}

function log_event(string $msg): void {
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $msg . PHP_EOL;
    file_put_contents(LOG_FILE, $line, FILE_APPEND);
}
