<?php
/**
 * Content CRUD API — per course/module
 *
 * GET  ?course=mina_cabildo&module=0  → returns content for that module
 * POST → saves content { course, module, type, content/url, title }
 * DELETE → removes content item { course, module, type, index }
 */

define('DATA_DIR', __DIR__ . '/../data/content');

header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

function getFilePath(string $course, int $module): string {
    $course = preg_replace('/[^a-z0-9_]/', '', $course);
    return DATA_DIR . "/{$course}_{$module}.json";
}

function loadContent(string $course, int $module): array {
    $path = getFilePath($course, $module);
    if (!file_exists($path)) {
        return ['videoUrl' => '', 'audioFiles' => [], 'text' => '', 'files' => []];
    }
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : ['videoUrl' => '', 'audioFiles' => [], 'text' => '', 'files' => []];
}

function saveContent(string $course, int $module, array $data): bool {
    $path = getFilePath($course, $module);
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': {
        $course = trim($_GET['course'] ?? '');
        $module = (int)($_GET['module'] ?? 0);

        if (!$course) {
            http_response_code(400);
            echo json_encode(['error' => 'course parameter required']);
            exit;
        }

        $content = loadContent($course, $module);
        echo json_encode(['ok' => true, 'data' => $content]);
        break;
    }

    case 'POST': {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON body']);
            exit;
        }

        $course = trim($body['course'] ?? '');
        $module = (int)($body['module'] ?? 0);
        $type   = trim($body['type'] ?? '');   // video | audio | text | file | full

        if (!$course || !$type) {
            http_response_code(400);
            echo json_encode(['error' => 'course and type required']);
            exit;
        }

        $content = loadContent($course, $module);

        switch ($type) {
            case 'full':
                // Guardar el contenido completo del módulo (desde React)
                if (isset($body['data']) && is_array($body['data'])) {
                    $content = $body['data'];
                }
                break;
            case 'video':
                $content['videoUrl'] = trim($body['url'] ?? '');
                break;
            case 'text':
                $content['text'] = $body['content'] ?? '';
                break;
            case 'audio':
                $content['audioFiles'][] = [
                    'name' => basename($body['url'] ?? 'audio.mp3'),
                    'url'  => $body['url'] ?? '',
                    'size' => $body['size'] ?? '— MB',
                ];
                break;
            case 'file':
                $content['files'][] = [
                    'name'  => $body['title'] ?? 'archivo.pdf',
                    'url'   => $body['url'] ?? '',
                    'size'  => $body['size'] ?? '— MB',
                ];
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid type']);
                exit;
        }

        if (!saveContent($course, $module, $content)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save content']);
            exit;
        }

        echo json_encode(['ok' => true, 'data' => $content]);
        break;
    }

    case 'DELETE': {
        $body = json_decode(file_get_contents('php://input'), true);
        $course = trim($body['course'] ?? '');
        $module = (int)($body['module'] ?? 0);
        $type   = trim($body['type'] ?? '');
        $index  = (int)($body['index'] ?? 0);

        if (!$course || !$type) {
            http_response_code(400);
            echo json_encode(['error' => 'course and type required']);
            exit;
        }

        $content = loadContent($course, $module);

        if ($type === 'audio' && isset($content['audioFiles'][$index])) {
            array_splice($content['audioFiles'], $index, 1);
        } elseif ($type === 'file' && isset($content['files'][$index])) {
            array_splice($content['files'], $index, 1);
        } elseif ($type === 'video') {
            $content['videoUrl'] = '';
        } elseif ($type === 'text') {
            $content['text'] = '';
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Item not found']);
            exit;
        }

        saveContent($course, $module, $content);
        echo json_encode(['ok' => true, 'data' => $content]);
        break;
    }

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
