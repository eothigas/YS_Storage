<?php

// Cabeçalhos para forçar o retorno como JSON
header('Content-Type: application/json; charset=UTF-8');

// Função para enviar respostas em JSON e encerrar a execução
function respondWithJson($data) {
    echo json_encode($data);
    exit();
}

try {
    // Carrega as configurações do php.ini
    $config = parse_ini_file('../../PHP/php.ini', true);

    // Verifica se as configurações foram carregadas corretamente
    if (!$config) {
        respondWithJson(['error' => 'Erro ao carregar as configurações do php.ini']);
    }

    // Obtém as configurações do banco de dados a partir do php.ini
    $host = $config['database']['host'] ?? null;
    $dbname = $config['database']['dbname'] ?? null;
    $user = $config['database']['user'] ?? null;
    $password = $config['database']['password'] ?? null;

    if (!$host || !$dbname || !$user || !$password) {
        respondWithJson(['error' => 'Configurações do banco de dados inválidas']);
    }

    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

    // Cria uma nova instância de PDO
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recebe os dados do formulário
    $nome = htmlspecialchars($_POST['nome'], ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');
    $telefone = htmlspecialchars($_POST['telefone'], ENT_QUOTES, 'UTF-8');
    $mensagem = !empty($_POST['mensagem']) ? htmlspecialchars($_POST['mensagem'], ENT_QUOTES, 'UTF-8') : null;
    $enterprise = htmlspecialchars($_POST['enterprise'], ENT_QUOTES, 'UTF-8');
    $cnpj = htmlspecialchars($_POST['cnpj'], ENT_QUOTES, 'UTF-8');
    $question = htmlspecialchars($_POST['question'], ENT_QUOTES, 'UTF-8');

    // Verifica se o CNPJ já está registrado no banco de dados
    $checkCnpjSql = "SELECT COUNT(*) FROM orcamento WHERE cnpj = :cnpj";
    $checkCnpjStmt = $pdo->prepare($checkCnpjSql);
    $checkCnpjStmt->bindParam(':cnpj', $cnpj);
    $checkCnpjStmt->execute();

    if ($checkCnpjStmt->fetchColumn() > 0) {
        respondWithJson(['error' => 'CNPJ já registrado no banco de dados']);
    }

    // Insere os dados na tabela orcamento
    $sql = "INSERT INTO orcamento (nome, email, telefone, mensagem, enterprise, cnpj, question, data_criacao, data_atualizacao) 
            VALUES (:nome, :email, :telefone, :mensagem, :enterprise, :cnpj, :question, CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindParam(':mensagem', $mensagem);
    $stmt->bindParam(':enterprise', $enterprise);
    $stmt->bindParam(':cnpj', $cnpj);
    $stmt->bindParam(':question', $question);
    $stmt->execute();

    // Obtém o último ID inserido
    $idOrcamento = $pdo->lastInsertId();

    // Insere na tabela notification_status
    $stmtNotification = $pdo->prepare("INSERT INTO notification_status (nome, tipo, data_criacao, data_atualizacao, id_orcamento) 
        VALUES (:nome, 'formulario', CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'), :id_orcamento)");
    $stmtNotification->bindParam(':nome', $nome);
    $stmtNotification->bindParam(':id_orcamento', $idOrcamento);
    $stmtNotification->execute();

    // Configurações do e-mail
    $subject = 'Recebimento de Formulário - Your Storage';
    $body = "
    <html>
    <head><meta charset='UTF-8'></head>
    <body>
        <p>Olá $nome,</p>
        <p>Agradecemos pelo envio das suas informações! Gostaríamos de informar que recebemos e salvamos os dados em nosso banco de dados com sucesso.</p>
        <p>Um de nossos agentes comerciais entrará em contato com você dentro de <b>1 a 2 dias úteis</b>.</p>
        <p>Se precisar de mais informações ou tiver alguma dúvida imediata, não hesite em nos contatar.</p>
        <hr>
        <p>Atenciosamente,<br>Equipe Your Storage</p>
    </body>
    </html>";
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: form-noreply@yourstorage.x10.mx\r\n";
    $headers .= "Bcc: yourstoragee@gmail.com\r\n";

    // Envia o e-mail
    if (!mail($email, $subject, $body, $headers)) {
        respondWithJson(['error' => 'Erro ao enviar o e-mail']);
    }

    // Retorna sucesso
    respondWithJson(['success' => true, 'message' => 'Formulário enviado com sucesso!']);
} catch (PDOException $e) {
    respondWithJson(['error' => 'Erro ao processar o formulário: ' . $e->getMessage()]);
} catch (Exception $e) {
    respondWithJson(['error' => 'Erro inesperado: ' . $e->getMessage()]);
}

?>