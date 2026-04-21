<?php
/**
 * api_content.php — API para guardar y recuperar contenidos de módulos
 * Persiste la documentación en el servidor en lugar de localStorage
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('CONTENT_DIR', __DIR__ . '/data/content');

// Crear directorio si no existe
if (!is_dir(CONTENT_DIR)) {
    @mkdir(CONTENT_DIR, 0755, true);
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'get') {
    handle_get();
} elseif ($action === 'save') {
    handle_save();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
}

exit;

// ────────────────────────────────────────────────────────────────────────────

function handle_get() {
    $file = CONTENT_DIR . '/all_content.json';

    if (!file_exists($file)) {
        // Retornar contenido vacío si no existe
        echo json_encode(['data' => []]);
        return;
    }

    $content = file_get_contents($file);
    echo $content;
}

function handle_save() {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['data']) || !is_array($input['data'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data format']);
        return;
    }

    $file = CONTENT_DIR . '/all_content.json';

    // Guardar con validación
    if (file_put_contents($file, json_encode($input['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save content']);
        return;
    }

    http_response_code(200);
    echo json_encode(['status' => 'saved', 'message' => 'Contenido guardado exitosamente']);
}
