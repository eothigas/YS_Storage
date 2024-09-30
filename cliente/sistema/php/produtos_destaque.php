<?php

// Carrega as configurações do php.ini
$ini = parse_ini_file('../../../PHP/php.ini'); // Altere o caminho conforme necessário

// Inicia a sessão
session_start(); // Certifique-se de que a sessão esteja iniciada

// Obtém o nome da empresa da sessão
$empresa = isset($_SESSION['empresa']) ? $_SESSION['empresa'] : null;

// Verifica se a empresa está definida
if (!$empresa) {
    echo json_encode(['error' => 'Empresa não encontrada na sessão.']);
    exit();
}

// Conexão com o banco de dados usando as configurações do ini
$dsn = "mysql:host={$ini['dbhost']};dbname={$ini['dbname']}";
$username = $ini['user'];
$password = $ini['password'];

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Consulta para buscar produtos em destaque da empresa especificada
    $stmt = $pdo->prepare("SELECT * FROM produtos WHERE destaque = 1 AND empresa = :empresa ORDER BY RAND()");
    $stmt->bindParam(':empresa', $empresa);
    $stmt->execute();

    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Verifica se há produtos em destaque
    if (count($produtos) > 0) {
        // Retorna todos os produtos em destaque
        echo json_encode($produtos);
    } else {
        // Se não houver produtos em destaque
        echo json_encode(['message' => 'Ops! Não existe nenhum produto em destaque.']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
