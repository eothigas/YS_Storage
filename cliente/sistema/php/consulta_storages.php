<?php
session_start();

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Acessar credenciais do banco de dados
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$username = $config['database']['user'];
$password = $config['database']['password'];

// Conectar ao banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password)
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
