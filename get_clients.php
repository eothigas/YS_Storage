<?php
session_start();
header('Content-Type: application/json');

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
    // Conexão com o banco de dados usando PDO
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta o nome, email e plano dos 5 primeiros clientes cadastrados
    $sql = "SELECT nome, email, plano FROM usuarios ORDER BY RAND() LIMIT 5";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Armazena os resultados
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retorna os dados em formato JSON
    if (!empty($usuarios)) {
        echo json_encode(['status' => 'success', 'data' => $usuarios]);
    } else {
        echo json_encode(['status' => 'info', 'message' => 'Nenhum cliente encontrado.']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
}
?>
