<?php
session_start();

// Conectar ao banco de dados
try {
    $pdo = new PDO("mysql:host=t;dbname=", "", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados.']);
    exit();
}

// Consultar os dados dos storages
$query = "SELECT imagem, nome, endereco, altura, largura, comprimento FROM storage";
$stmt = $pdo->prepare($query);
$stmt->execute();
$storages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($storages);
?>
