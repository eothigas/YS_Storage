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

    // Preparar a consulta para obter o nome do funcionário antes de excluir
    $query_nome = "SELECT nome FROM funcionarios WHERE id = ?";
    if ($stmt_nome = $conn->prepare($query_nome)) {
        $stmt_nome->bind_param("i", $id_funcionario);
        $stmt_nome->execute();
        $stmt_nome->bind_result($nome_funcionario);
        $stmt_nome->fetch();
        $stmt_nome->close();

        // Agora, excluir o funcionário
        $query = "DELETE FROM funcionarios WHERE id = ?";
        
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("i", $id_funcionario);

            if ($stmt->execute()) {
                // Após excluir, inserir na tabela de notificações
                $stmt_insert = $conn->prepare("INSERT INTO notification_status (nome, tipo, data_criacao, data_atualizacao) VALUES (?, 'funcionario_exclusao', CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))");
                $stmt_insert->bind_param("s", $nome_funcionario);
                $stmt_insert->execute();
                $stmt_insert->close();

                echo json_encode(['status' => 'success', 'message' => 'Funcionário excluído com sucesso']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir o funcionário: ' . $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar nome do funcionário: ' . $conn->error]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID não fornecido']);
}

// Fechar a conexão com o banco de dados
$conn->close();
?>
