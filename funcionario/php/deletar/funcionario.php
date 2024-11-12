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
$host = $config['database']['host'] ?? 'localhost';
$dbname = $config['database']['dbname'] ?? 'nome_do_banco';
$user = $config['database']['user'] ?? 'usuario';
$password = $config['database']['password'] ?? 'senha';

// Conectar ao banco de dados
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verificar se o ID foi enviado via POST
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['id'])) {
    $id_funcionario = $data['id'];

    // Preparar a consulta para excluir o funcionário
    $query = "DELETE FROM funcionarios WHERE id = ?";
    
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $id_funcionario);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Funcionário excluído com sucesso']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir o funcionário: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID não fornecido']);
}

// Fechar a conexão com o banco de dados
$conn->close();
?>
