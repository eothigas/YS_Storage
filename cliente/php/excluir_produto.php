<?php
header('Content-Type: application/json');

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$username = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtem o código do produto
    $codigo = $_POST['codigo'];

    // Deleta o produto do banco de dados
    $stmt = $pdo->prepare("DELETE FROM produtos WHERE codigo = :codigo");
    $stmt->bindParam(':codigo', $codigo);
    $stmt->execute();

    echo json_encode(['success' => 'Produto excluído com sucesso.']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao excluir produto: ' . $e->getMessage()]);
}
?>
