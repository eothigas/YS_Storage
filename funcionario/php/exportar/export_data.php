<?php
header('Content-Type: application/json; charset=UTF-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Carregar as configurações do arquivo php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo php.ini foi carregado corretamente
if (!$config) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao carregar o arquivo de configuração php.ini']);
    exit();
}

// Configuração do banco de dados
$host = $config['database']['host'] ;
$dbname = $config['database']['dbname'] ;
$user = $config['database']['user'] ;
$password = $config['database']['password'] ;

// Verifique o parâmetro "export_type" enviado pelo JavaScript
$exportType = $_GET['export_type'] ?? '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "";
    switch ($exportType) {
        case 'Funcionário':
            $query = "SELECT imagem, nome, identidade, contato, email, data_criacao, status FROM funcionarios";
            break;
        case 'Empresa':
            $query = "SELECT logo, razao, fantasia, identidade, endereco, plano, contato, email, data_criacao, status FROM empresa";
            break;
        case 'Cliente':
            $query = "SELECT nome, identidade, contato, empresa, tipo, email, data_criacao, status FROM clientes";
            break;
        case 'Storage':
            $query = "SELECT imagem, nome, empresa, endereco, altura, largura, comprimento, data_criacao, status FROM storage";
            break;
        default:
            echo json_encode(["status" => "error", "message" => "Tipo de exportação inválido"]);
            exit;
    }

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $result]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
