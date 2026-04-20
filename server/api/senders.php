<?php
/**
 * api/senders.php — CRUD de remitentes autorizados
 * GET    → lista de remitentes
 * POST   → agregar remitente  { nombre, email, area }
 * DELETE → eliminar remitente { email }
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

define('SENDERS_FILE', __DIR__ . '/../data/authorized_senders.json');

function load(): array {
    if (!file_exists(SENDERS_FILE)) return [];
    return json_decode(file_get_contents(SENDERS_FILE), true) ?? [];
}

function save(array $data): void {
    file_put_contents(SENDERS_FILE, json_encode(array_values($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(load());
    exit;
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    $email  = strtolower(trim($body['email'] ?? ''));
    $nombre = trim($body['nombre'] ?? '');
    $area   = trim($body['area'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$nombre) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        exit;
    }

    $senders = load();
    foreach ($senders as $s) {
        if ($s['email'] === $email) {
            http_response_code(409);
            echo json_encode(['error' => 'El correo ya está registrado']);
            exit;
        }
    }

    $senders[] = [
        'email'  => $email,
        'nombre' => $nombre,
        'area'   => $area,
        'activo' => true,
        'desde'  => date('Y-m-d'),
    ];
    save($senders);
    echo json_encode(['ok' => true]);
    exit;
}

if ($method === 'DELETE') {
    $email   = strtolower(trim($body['email'] ?? ''));
    $senders = array_filter(load(), fn($s) => $s['email'] !== $email);
    save($senders);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
