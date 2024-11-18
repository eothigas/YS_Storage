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
    $storage_id = $data['id'];

    // Preparar a consulta para buscar o nome da storage
    $query_nome = "SELECT nome FROM storage WHERE id = ?";
    if ($stmt_nome = $conn->prepare($query_nome)) {
        $stmt_nome->bind_param("i", $storage_id);
        $stmt_nome->execute();
        $stmt_nome->bind_result($nome_storage);
        $stmt_nome->fetch();
        $stmt_nome->close();

        // Verificar se o nome da storage foi encontrado
        if (!$nome_storage) {
            echo json_encode(['status' => 'error', 'message' => 'Storage não encontrada']);
            $conn->close();
            exit();
        }

        // Preparar a consulta para excluir a storage
        $query_exclusao = "DELETE FROM storage WHERE id = ?";
        if ($stmt_exclusao = $conn->prepare($query_exclusao)) {
            $stmt_exclusao->bind_param("i", $storage_id);

            if ($stmt_exclusao->execute()) {
                // Inserir notificação na tabela notification_status
                $query_notificacao = "INSERT INTO notification_status (nome, tipo, data_criacao, data_atualizacao) 
                                      VALUES (?, 'storage_exclusao', CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))";
                if ($stmt_notificacao = $conn->prepare($query_notificacao)) {
                    $stmt_notificacao->bind_param("s", $nome_storage);
                    $stmt_notificacao->execute();
                    $stmt_notificacao->close();
                }

                echo json_encode(['status' => 'success', 'message' => 'Storage excluída com sucesso']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir a storage: ' . $stmt_exclusao->error]);
            }

            $stmt_exclusao->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta de exclusão: ' . $conn->error]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta para buscar o nome da storage']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID não fornecido']);
}

// Fechar a conexão com o banco de dados
$conn->close();
?>
