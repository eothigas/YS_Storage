<?php
session_start();

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die(json_encode(['error' => 'Erro ao carregar o arquivo php.ini.']));
}

$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$username = $config['database']['user'];
$password = $config['database']['password'];

try {
    // Conexão com o banco de dados
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4"; // Corrigido
    $pdo = new PDO($dsn, $username, $password); // Corrigido
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verifique se a sessão está ativa e se a empresa está definida
    if (!isset($_SESSION['empresa'])) {
        die(json_encode(['error' => 'Acesso negado. Faça login para continuar.']));
    }

    // Busque os produtos da empresa da sessão
    $empresa = $_SESSION['empresa'];
    $stmt = $pdo->prepare("SELECT * FROM produtos WHERE empresa = :empresa");
    $stmt->execute(['empresa' => $empresa]);
    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retorne os dados em formato JSON
    header('Content-Type: application/json');
    echo json_encode($produtos);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro: ' . $e->getMessage()]); // Alterado para retornar erro em JSON
}
?>
