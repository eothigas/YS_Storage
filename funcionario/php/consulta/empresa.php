<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

header('Content-Type: application/json'); // Define o cabeçalho para JSON

try {
    // Conexão com o banco de dados MySQL
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para selecionar os dados necessários da tabela empresa
    $stmt = $pdo->prepare("SELECT * FROM empresa ORDER BY RAND()");
    $stmt->execute();

    // Pega os resultados
    $empresas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retorna os dados em JSON
    echo json_encode(['status' => 'success', 'data' => $empresas]);

} catch (PDOException $e) {
    // Em caso de erro, retorna uma mensagem de erro
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
