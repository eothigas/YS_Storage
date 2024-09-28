<?php
session_start();

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Acessar credenciais do banco de dados e o Client ID do Imgur
$host = $config['database']['host'];
$dbname = $config['database']['db_name'];
$username = $config['database']['user'];
$password = $config['database']['password'];

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

// Função para enviar e-mail
function enviarEmail($para, $codigo) {
    $de = 'no-reply@yourstorage.x10.mx';
    $assunto = 'Recuperação de Senha - Your Storage';
    $mensagem = "
    <html>
    <head>
        <title>Recuperação de Senha</title>
    </head>
    <body>
        <p>Olá!</p>
        <p>Foi solicitado a alteração de senha da sua conta Your Storage. Insira o código abaixo na página de recuperação para redefinir sua senha.</p>
        <p><strong>Código gerado automaticamente: $codigo</strong></p>
        <p>Se você não solicitou a troca da senha, por favor desconsidere este e-mail.</p>
        <p>Atenciosamente,<br>Grupo Your Storage</p>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: ' . $de . "\r\n";

    mail($para, $assunto, $mensagem, $headers);
}

try {
    // Criar uma nova conexão PDO
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar se o formulário foi enviado
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = $_POST['email'];

        // Preparar e executar a consulta para verificar o e-mail
        $sql = "SELECT email FROM usuarios WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Gerar um código de recuperação
            $codigo = bin2hex(random_bytes(4)); // Gera um código hexadecimal de 8 caracteres
            $validade = date('Y-m-d H:i:s', strtotime('+3 hours')); // Define a validade para 3 horas a partir de agora

            // Preparar e executar a consulta para inserir o código e a validade
            $sql = "INSERT INTO recuperacao_senha (email, codigo, validade) VALUES (:email, :codigo, :validade)
                    ON DUPLICATE KEY UPDATE codigo = :codigo, validade = :validade";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':codigo', $codigo);
            $stmt->bindParam(':validade', $validade);
            $stmt->execute();

            // Salvar o e-mail na sessão
            $_SESSION['email'] = $email;

            // Enviar e-mail com o código de recuperação
            enviarEmail($email, $codigo);

            header("Location: enviocodigo.html");
            exit();
        } else {
            echo "<p class='message'>E-mail não encontrado.</p>";
        }
    }
} catch (PDOException $e) {
    echo "<p class='message'>Erro: " . $e->getMessage() . "</p>";
}

// Fechar a conexão
$conn = null;
?>