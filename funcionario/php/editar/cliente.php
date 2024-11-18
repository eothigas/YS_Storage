<?php
// Ativar exibição de erros (para desenvolvimento)
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
$host = $config['database']['host'];
$dbname = $config['database']['dbname']; 
$user = $config['database']['user']; 
$password = $config['database']['password']; 

// Conectar ao banco de dados
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexão com o banco de dados
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verificar se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter os dados do formulário
    $id_cliente = $_POST['id_cliente'];
    $nome = $_POST['nome'] ?? null;
    $identidade = $_POST['identidade'] ?? null;
    $contato = $_POST['contato'] ?? null;
    $email = $_POST['email'] ?? null;
    $empresa = $_POST['empresa'] ?? null;
    $tipo = $_POST['status-tipo'] ?? null;
    $cliente = $_POST['status-cliente'] ?? null;
    $senha = $_POST['senha'] ?? null;
    $confirme_senha = $_POST['confirme_senha'] ?? null;

    // Verificar se a identidade foi alterada
    if ($identidade) {
        // Verificar se a identidade já existe, mas excluir o cliente atual da verificação
        $stmt = $conn->prepare("SELECT id FROM clientes WHERE identidade = ? AND id != ?");
        $stmt->bind_param('si', $identidade, $id_cliente);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Identidade já cadastrada."]);
            exit();
        }
        $stmt->close();
    }

    // Verificar se as senhas coincidem
    if ($senha && $confirme_senha && $senha !== $confirme_senha) {
        echo json_encode(['status' => 'error', 'message' => 'As senhas não coincidem.']);
        exit();
    }

    // Hash da senha (somente se foi fornecida uma nova senha)
    if ($senha) {
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    } else {
        $senha_hash = null; // Não alterar a senha, mantê-la no banco
    }

    // Preparar a consulta de atualização, apenas com os campos que foram alterados
    $query = "UPDATE clientes SET ";
    $params = [];
    $types = "";

    // Construção dinâmica da query
    if ($nome) {
        $query .= "nome = ?, ";
        $params[] = $nome;
        $types .= "s";
    }
    if ($identidade) {
        $query .= "identidade = ?, ";
        $params[] = $identidade;
        $types .= "s";
    }
    if ($contato) {
        $query .= "contato = ?, ";
        $params[] = $contato;
        $types .= "s";
    }
    if ($email) {
        $query .= "email = ?, ";
        $params[] = $email;
        $types .= "s";
    }
    if ($empresa) {
        $query .= "empresa = ?, ";
        $params[] = $empresa;
        $types .= "s";
    }
    if ($tipo) {
        $query .= "tipo = ?, ";
        $params[] = $tipo;
        $types .= "s";
    }
    if ($cliente) {
        $query .= "status = ?, ";
        $params[] = $cliente;
        $types .= "s";
    }
    if ($senha_hash) {
        $query .= "senha = ?, ";
        $params[] = $senha_hash;
        $types .= "s";
    }

    $query .= "data_atualizacao = CONVERT_TZ(NOW(), '+00:00', '+02:00')";

    // Remover a última vírgula da consulta
    $query = rtrim($query, ', ') . " WHERE id = ?";

    // Adicionar o ID do cliente como parâmetro
    $params[] = $id_cliente;
    $types .= "i";

    // Iniciar transação para garantir consistência
    $conn->begin_transaction();

    try {
        if ($stmt = $conn->prepare($query)) {
            // Bind dos parâmetros
            $stmt->bind_param($types, ...$params);

            // Executar a query
            if ($stmt->execute()) {
                // Registrar a alteração na tabela notification_status
                $stmt_insert = $conn->prepare("INSERT INTO notification_status (nome, tipo, data_criacao, data_atualizacao) VALUES (?, 'cliente_alteracao', CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))");
                $stmt_insert->bind_param("s", $nome);
                $stmt_insert->execute();
                $stmt_insert->close();

                // Commit da transação
                $conn->commit();

                echo json_encode(['status' => 'success', 'message' => 'Cliente atualizado com sucesso.']);
            } else {
                // Rollback em caso de erro
                $conn->rollback();
                echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar o cliente: ' . $stmt->error]);
            }

            $stmt->close();
        } else {
            // Rollback em caso de erro na preparação
            $conn->rollback();
            echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
        }
    } catch (Exception $e) {
        // Rollback em caso de exceção
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => 'Erro inesperado: ' . $e->getMessage()]);
    }

    // Fechar a conexão com o banco de dados
    $conn->close();
}
?>
