<?php

// Adicionando o uso do namespace PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir o autoload do Composer para carregar o PHPMailer
require '../vendor/autoload.php'; // Corrigido o caminho do autoload do Composer

// Carrega as configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'] ?? null;
$dbname = $config['database']['dbname'] ?? null;
$user = $config['database']['user'] ?? null;
$password = $config['database']['password'] ?? null;

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
    $mensagem = htmlspecialchars($_POST['mensagem'], ENT_QUOTES, 'UTF-8');

    // Verifica se o e-mail é válido
    if (!$email) {
        echo json_encode(["error" => "E-mail invalido."]);
        exit();
    }

    // Prepara a consulta SQL
    $sql = "INSERT INTO orcamento (nome, email, telefone, mensagem) VALUES (:nome, :email, :telefone, :mensagem)";
    $stmt = $pdo->prepare($sql);

    // Vincula os parâmetros
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindParam(':mensagem', $mensagem);

    // Executa a consulta
    $stmt->execute();

    // Configurações do PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configurações do servidor SMTP
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->Host       = 'mail.yourstorage.x10.mx'; // Servidor SMTP
        $mail->Username   = 'noreply@yourstorage.x10.mx'; // Seu e-mail
        $mail->Password   = 'Thiago@07'; // Senha do e-mail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Usar TLS
        $mail->Port       = 587; // Porta do SMTP

        // Define o charset como UTF-8
        $mail->CharSet = 'UTF-8';

        // Remetente
        $mail->setFrom('noreply@yourstorage.x10.mx', 'Your Storage');

        // Destinatário
        $mail->addAddress($email);  // Adiciona o e-mail do destinatário

        // Adiciona o e-mail em cópia oculta
        $mail->addBCC('yourstoragee@gmail.com');

        // Conteúdo do e-mail
        $mail->isHTML(true);
        $mail->Subject = 'Recebimento de Formulário - Your Storage';
        $mail->Body    = "
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

        // Enviar o e-mail
        $mail->send();

        // Redireciona para a página de confirmação após o e-mail ser enviado com sucesso
        header("Location: /homepage/orcamentopendente.html");
        exit();
    } catch (Exception $e) {
        echo header("Location: /homepage/orcamentoerro.html");
        exit();
    }
} catch (PDOException $e) {
    // Mostra o erro para depuração
    echo header("Location: /homepage/orcamentoerro.html");
    exit();
}
?>
