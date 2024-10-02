<?php
session_start();
$ini_array = parse_ini_file('../../../PHP/php.ini', true);

// Verifica se as configurações de banco de dados foram carregadas corretamente
if (!isset($ini_array['database'])) {
    echo json_encode(['error' => 'Configurações do banco de dados não encontradas.']);
    exit;
}

$host = $ini_array['database']['host'];
$dbname = $ini_array['database']['dbname'];
$user = $ini_array['database']['user'];
$password = $ini_array['database']['password'];

// Verifica se a empresa está armazenada na sessão
if (!isset($_SESSION['empresa'])) {
    echo json_encode(['error' => 'Empresa não encontrada na sessão.']);
    exit;
}

$empresa = $_SESSION['empresa'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Parâmetros de paginação
    $limit = 5; // Número de usuários por página
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $offset = ($page - 1) * $limit;

    // Total de usuários filtrados pela empresa
    $totalStmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE empresa = :empresa");
    $totalStmt->bindParam(':empresa', $empresa);
    $totalStmt->execute();
    $totalUsers = $totalStmt->fetchColumn();
    $totalPages = ceil($totalUsers / $limit);

    // Busca os usuários para a página atual filtrados pela empresa
    $stmt = $pdo->prepare("SELECT nome, tipo, email FROM usuarios WHERE empresa = :empresa LIMIT :limit OFFSET :offset");
    $stmt->bindParam(':empresa', $empresa);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'usuarios' => $usuarios,
        'totalPages' => $totalPages,
        'currentPage' => $page
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
