<?php
session_start();

// Define o cabeçalho para JSON antes de qualquer saída
header('Content-Type: application/json');

// Verifica se o usuário está autenticado
if (!isset($_SESSION['id_funcionario'])) {
    header('Location: https://www.yourstorage.x10.mx/errors/html/error403_prohibed.html');
    exit;
}

// Carrega as configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Verifica se o id_orcamento foi passado pela URL
if (!isset($_GET['id_orcamento'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID do orçamento não fornecido']);
    exit;
}

// Obtém o id_orcamento da URL
$orcamentoId = $_GET['id_orcamento'];

try {
    // Conexão com o banco de dados usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para buscar o orçamento pelo ID
    $stmt = $pdo->prepare("SELECT * FROM orcamento WHERE id = :id_orcamento");
    $stmt->bindParam(':id_orcamento', $orcamentoId, PDO::PARAM_INT);
    $stmt->execute();
    
    // Verifica se algum orçamento foi encontrado
    $orcamento = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($orcamento) {
        // Retorna o resultado em JSON
        echo json_encode(['status' => 'success', 'result' => $orcamento]);
    } else {
        // Se não encontrar o orçamento
        echo json_encode(['status' => 'error', 'message' => 'Orçamento não encontrado']);
    }
} catch (PDOException $e) {
    // Retorna o erro em JSON
    echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar orçamento: ' . $e->getMessage()]);
}
?>
