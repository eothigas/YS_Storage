<?php
header('Content-Type: application/json');

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Acessar credenciais do banco de dados e o Client ID do Imgur
$host = $config['database']['host'];
$dbname = $config['database']['db_name'];
$username = $config['database']['user'];
$password = $config['database']['password'];

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
