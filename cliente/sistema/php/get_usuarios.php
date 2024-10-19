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

    // Total de usuários filtrados pela empresa
    $totalStmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE empresa = :empresa");
    $totalStmt->bindParam(':empresa', $empresa);
    $totalStmt->execute();
    $totalUsers = $totalStmt->fetchColumn();

    echo json_encode(['totalUsers' => $totalUsers]); // Retorna apenas a contagem total

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
