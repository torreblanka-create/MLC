<?php
/**
 * api/get_batch.php — Devuelve el lote pendiente más reciente
 * GET → { batch | null }
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

define('QUEUE_DIR', __DIR__ . '/../data/queue');

$files = glob(QUEUE_DIR . '/*.json');
if (!$files) { echo json_encode(null); exit; }

// Ordenar por fecha de modificación, más reciente primero
usort($files, fn($a, $b) => filemtime($b) - filemtime($a));

foreach ($files as $f) {
    $batch = json_decode(file_get_contents($f), true);
    if (($batch['estado'] ?? '') === 'pendiente') {
        echo json_encode($batch);
        exit;
    }
}

echo json_encode(null);
