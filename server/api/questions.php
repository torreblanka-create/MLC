<?php
/**
 * Questions CRUD API — per faena
 *
 * GET    ?faena=mina_cabildo          → returns all questions
 * POST   { faena, q, opts:[4], correct:0-3, activa }  → add question
 * PUT    { id, q, opts, correct, activa }              → update question
 * DELETE { id }                                         → remove question
 */

define('DATA_DIR', __DIR__ . '/../data/questions');

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Default question sets (abbreviated — in production load from a seed file)
$DEFAULT_QUESTIONS = [
    'mina_cabildo'   => [],
    'mina_taltal'    => [],
    'planta_cabildo' => [],
    'planta_taltal'  => [],
];

function faenaPath(string $faena): string {
    $faena = preg_replace('/[^a-z0-9_]/', '', $faena);
    return DATA_DIR . "/{$faena}.json";
}

function loadQuestions(string $faena): array {
    global $DEFAULT_QUESTIONS;
    $path = faenaPath($faena);
    if (!file_exists($path)) {
        // Initialize from defaults (empty — seed separately)
        $defaults = $DEFAULT_QUESTIONS[$faena] ?? [];
        file_put_contents($path, json_encode($defaults, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $defaults;
    }
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function saveQuestions(string $faena, array $questions): bool {
    return file_put_contents(
        faenaPath($faena),
        json_encode(array_values($questions), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    ) !== false;
}

function generateId(string $faena): string {
    return substr($faena, 0, 2) . '_' . bin2hex(random_bytes(4));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': {
        $faena = trim($_GET['faena'] ?? '');
        if (!$faena) {
            http_response_code(400);
            echo json_encode(['error' => 'faena parameter required']);
            exit;
        }
        $questions = loadQuestions($faena);
        echo json_encode(['ok' => true, 'faena' => $faena, 'count' => count($questions), 'data' => $questions]);
        break;
    }

    case 'POST': {
        $body = json_decode(file_get_contents('php://input'), true);
        $faena = trim($body['faena'] ?? '');
        $q     = trim($body['q'] ?? '');
        $opts  = $body['opts'] ?? [];
        $correct = (int)($body['correct'] ?? 0);
        $activa  = (bool)($body['activa'] ?? true);

        if (!$faena || !$q || count($opts) !== 4) {
            http_response_code(400);
            echo json_encode(['error' => 'faena, q, and opts[4] required']);
            exit;
        }

        $questions = loadQuestions($faena);
        $newQ = [
            'id'      => generateId($faena),
            'q'       => $q,
            'opts'    => array_map('strval', $opts),
            'correct' => $correct,
            'activa'  => $activa,
        ];
        $questions[] = $newQ;

        if (!saveQuestions($faena, $questions)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save']);
            exit;
        }
        echo json_encode(['ok' => true, 'data' => $newQ]);
        break;
    }

    case 'PUT': {
        $body = json_decode(file_get_contents('php://input'), true);
        $id   = trim($body['id'] ?? '');

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'id required']);
            exit;
        }

        // Find question across all faenas or use provided faena
        $faena = trim($body['faena'] ?? '');
        $faenas = $faena ? [$faena] : ['mina_cabildo', 'mina_taltal', 'planta_cabildo', 'planta_taltal'];
        $found = false;

        foreach ($faenas as $f) {
            $questions = loadQuestions($f);
            foreach ($questions as &$q) {
                if ($q['id'] === $id) {
                    if (isset($body['q']))       $q['q']       = trim($body['q']);
                    if (isset($body['opts']))    $q['opts']    = array_map('strval', $body['opts']);
                    if (isset($body['correct'])) $q['correct'] = (int)$body['correct'];
                    if (isset($body['activa']))  $q['activa']  = (bool)$body['activa'];
                    $found = true;
                    break;
                }
            }
            unset($q);
            if ($found) {
                saveQuestions($f, $questions);
                echo json_encode(['ok' => true]);
                exit;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Question not found']);
        break;
    }

    case 'DELETE': {
        $body = json_decode(file_get_contents('php://input'), true);
        $id   = trim($body['id'] ?? '');

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'id required']);
            exit;
        }

        $faena = trim($body['faena'] ?? '');
        $faenas = $faena ? [$faena] : ['mina_cabildo', 'mina_taltal', 'planta_cabildo', 'planta_taltal'];

        foreach ($faenas as $f) {
            $questions = loadQuestions($f);
            $filtered  = array_filter($questions, fn($q) => $q['id'] !== $id);
            if (count($filtered) !== count($questions)) {
                saveQuestions($f, $filtered);
                echo json_encode(['ok' => true]);
                exit;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Question not found']);
        break;
    }

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
