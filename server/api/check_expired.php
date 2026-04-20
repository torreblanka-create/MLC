<?php
/**
 * api/check_expired.php — Detecta alumnos vencidos y notifica
 * Ejecutar como cron diario en cPanel:
 *   0 8 * * * /usr/bin/php /home/usuario/induccion/server/api/check_expired.php
 */

define('STUDENTS_FILE', __DIR__ . '/../data/students.json');
define('LOG_FILE',      __DIR__ . '/../data/mail.log');

if (!file_exists(STUDENTS_FILE)) exit(0);

$students = json_decode(file_get_contents(STUDENTS_FILE), true) ?? [];
$hoy      = date('Y-m-d');
$changed  = false;

foreach ($students as &$alumno) {
    if (($alumno['estado'] ?? '') === 'aprobado') continue;
    if (($alumno['vencido'] ?? false)) continue;
    if (empty($alumno['vencimiento'])) continue;

    if ($alumno['vencimiento'] < $hoy) {
        log_event("Alumno vencido: {$alumno['nombre']} (RUT {$alumno['rut']})");

        // Notificar al alumno
        notificar_alumno($alumno['email'], $alumno['nombre']);

        // Notificar al inscritor
        if (!empty($alumno['inscritor'])) {
            notificar_inscritor($alumno['inscritor'], $alumno['nombre'], $alumno['rut']);
        }

        // Marcar como vencido (los datos se mantienen para el registro, el estado cambia)
        $alumno['vencido'] = true;
        $alumno['estado']  = 'vencido';
        $alumno['vencido_en'] = $hoy;
        $changed = true;
    }
}
unset($alumno);

if ($changed) {
    file_put_contents(STUDENTS_FILE, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

exit(0);


function notificar_alumno(string $to, string $nombre): void {
    $subject = 'Plazo de inducción vencido — GMLC';
    $body = "Estimado/a $nombre,\n\n"
          . "Tu plazo de 15 días para completar la inducción ha vencido.\n\n"
          . "Tus datos han sido desactivados del sistema.\n"
          . "Para retomar el proceso, solicita a tu supervisor que gestione\n"
          . "tu reinscripción desde el panel de administración.\n\n"
          . "Sistema de Inducción — Tecktur SpA";
    mail($to, $subject, $body, "From: inducciones@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}

function notificar_inscritor(string $to, string $nombre_alumno, string $rut): void {
    $subject = "Plazo vencido — $nombre_alumno ($rut)";
    $body = "Estimado/a,\n\n"
          . "El alumno $nombre_alumno (RUT $rut) no completó su inducción\n"
          . "dentro del plazo de 15 días y ha sido desactivado del sistema.\n\n"
          . "Para reinscribirlo, envía un nuevo Excel de inscripción al correo\n"
          . "inducciones@tecktur.cl con sus datos actualizados.\n\n"
          . "Sistema de Inducción — Tecktur SpA";
    mail($to, $subject, $body, "From: inducciones@tecktur.cl\r\nContent-Type: text/plain; charset=UTF-8");
}

function log_event(string $msg): void {
    file_put_contents(LOG_FILE, '[' . date('Y-m-d H:i:s') . '] ' . $msg . PHP_EOL, FILE_APPEND);
}
