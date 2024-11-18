<?php

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

if (!$host || !$dbname || !$user || !$password) {
    echo json_encode(["error" => "Configurações do banco de dados inválidas"]);
    exit();
}

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

try {
    // Cria uma nova instância de PDO
    $pdo = new PDO($dsn, $user, $password);
    // Define o modo de erro para exceções
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recebe os dados do formulário
    $nome = htmlspecialchars($_POST['nome'], ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $telefone = htmlspecialchars($_POST['telefone'], ENT_QUOTES, 'UTF-8');
    $mensagem = !empty($_POST['mensagem']) ? htmlspecialchars($_POST['mensagem'], ENT_QUOTES, 'UTF-8') : null;  // Mensagem pode ser nula
    $enterprise = htmlspecialchars($_POST['enterprise'], ENT_QUOTES, 'UTF-8');
    $cnpj = htmlspecialchars($_POST['cnpj'], ENT_QUOTES, 'UTF-8');
    $question = htmlspecialchars($_POST['question'], ENT_QUOTES, 'UTF-8');

    // Verifica se o e-mail já está registrado no banco de dados
    $checkEmailSql = "SELECT COUNT(*) FROM orcamento WHERE email = :email";
    $checkEmailStmt = $pdo->prepare($checkEmailSql);
    $checkEmailStmt->bindParam(':email', $email);
    $checkEmailStmt->execute();

    // Se o e-mail já estiver registrado, redireciona para a página de erro
    if ($checkEmailStmt->fetchColumn() > 0) {
        header("Location: /homepage/orcamentoerro.html");
        exit();
    }

    // Prepara a consulta SQL para inserção na tabela orcamento
    $sql = "INSERT INTO orcamento (nome, email, telefone, mensagem, enterprise, cnpj, question, data_criacao, data_atualizacao) 
            VALUES (:nome, :email, :telefone, :mensagem, :enterprise, :cnpj, :question, CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))";
    $stmt = $pdo->prepare($sql);

    // Vincula os parâmetros
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindParam(':mensagem', $mensagem);
    $stmt->bindParam(':enterprise', $enterprise);
    $stmt->bindParam(':cnpj', $cnpj);
    $stmt->bindParam(':question', $question);

    // Executa a consulta
    $stmt->execute();

    // Obtém o último ID inserido na tabela orcamento
    $idOrcamento = $pdo->lastInsertId();

    // Prepara a inserção na tabela notification_status
    $stmtNotification = $pdo->prepare("
        INSERT INTO notification_status (nome, tipo, data_criacao, data_atualizacao, id_orcamento)
        VALUES (:nome, 'formulario', CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'), :id_orcamento)
    ");
    $stmtNotification->bindParam(':nome', $nome);
    $stmtNotification->bindParam(':id_orcamento', $idOrcamento); // Liga o ID do orçamento ao parâmetro :id_orcamento
    $stmtNotification->execute();


    // Configurações do e-mail
    $subject = 'Recebimento de Formulário - Your Storage';
    $to = $email;
    $body = "
    <html>
    <head>
        <meta charset='UTF-8'>
    </head>
    <body>
        <p>Olá $nome,</p>
        <p>Agradecemos pelo envio das suas informações! Gostaríamos de informar que recebemos e salvamos os dados em nosso banco de dados com sucesso.</p>
        <p>Um de nossos agentes comerciais entrará em contato com você dentro de <b>1 a 2 dias úteis</b> para discutir mais detalhes e esclarecer quaisquer dúvidas que você possa ter. O contato poderá ser realizado através do <b>e-mail</b> ou <b>telefone</b> fornecidos no formulário.</p>
        <p>Agradecemos por escolher nossa empresa e pelo tempo dedicado para preencher o formulário. Valorizamos cada dado recebido e faremos uma análise cuidadosa para garantir que possamos oferecer o melhor atendimento possível.</p>
        <p>Se precisar de mais informações ou tiver alguma dúvida imediata, não hesite em nos contatar.</p>
        <hr>
        <p>Atenciosamente,<br>Thiago Freitas / Your Storage</p>
    </body>
    </html>";

    // Cabeçalhos do e-mail
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: form-noreply@yourstorage.x10.mx" . "\r\n";
    $headers .= "Bcc: yourstoragee@gmail.com" . "\r\n";

    // Envia o e-mail
    if (mail($to, $subject, $body, $headers)) {
        // Redireciona para a página de confirmação após o e-mail ser enviado com sucesso
        header("Location: /homepage/orcamentopendente.html");
        exit();
    } else {
        echo "Erro ao enviar o e-mail.";
        // Redireciona para a página de erro
        header("Location: /homepage/orcamentoerro.html");
        exit();
    }
} catch (PDOException $e) {
    // Mostra o erro para depuração
    echo json_encode(["error" => "Erro ao processar o formulário: " . $e->getMessage()]);
    exit();
}
?>
