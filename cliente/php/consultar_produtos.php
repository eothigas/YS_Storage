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
$imgurClientID = $config['imgur']['client_id']; // Pega o Client ID do Imgur

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
