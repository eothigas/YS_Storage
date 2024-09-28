<?php
header('Content-Type: application/json');

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage'; // Nome do banco de dados
$username = 'pgudxdii_yourstorage'; // Nome de usuário
$password = 'PK7hdr7c9&L8SK#J'; // Senha do banco de dados

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se o código do produto foi enviado via POST
    if (isset($_POST['codigo'])) {
        $codigo = $_POST['codigo'];

        // Consulta para obter os detalhes do produto específico
        $stmt = $pdo->prepare("SELECT * FROM produtos WHERE codigo = :codigo");
        $stmt->bindParam(':codigo', $codigo);
        $stmt->execute();
        $produto = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($produto) {
            echo json_encode($produto);
        } else {
            echo json_encode(['error' => 'Produto não encontrado.']);
        }
    } else {
        // Se não houver código, carrega todos os produtos
        $stmt = $pdo->query("SELECT * FROM produtos");
        $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($produtos);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro na consulta: ' . $e->getMessage()]);
}
