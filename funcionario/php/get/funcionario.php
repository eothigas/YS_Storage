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

// Verificar se o parâmetro 'id' foi fornecido na URL
if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID do funcionário não fornecido.']);
    exit;
}

$id = $_GET['id'];

try {
    // Conexão com o banco de dados MySQL
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para selecionar os dados do funcionário pelo ID
    $stmt = $pdo->prepare("SELECT * FROM funcionarios WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar se o funcionário foi encontrado
    $funcionario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($funcionario) {
        echo json_encode($funcionario);
    } else {
        echo json_encode(['error' => 'Funcionário não encontrado.']);
    }

} catch (PDOException $e) {
    // Em caso de erro, retorna uma mensagem de erro
    echo json_encode(['error' => 'Erro ao buscar dados do funcionário: ' . $e->getMessage()]);
}
?>
