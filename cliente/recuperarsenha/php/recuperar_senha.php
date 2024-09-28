<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

// Carrega as configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

if (!$config) {
    echo "<p>Erro ao carregar as configurações do php.ini</p>";
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'] ?? null;
$dbname = $config['database']['dbname'] ?? null;
$user = $config['database']['user'] ?? null;
$password = $config['database']['password'] ?? null;

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

// Função para enviar e-mail
function enviarEmail($mail, $codigo) {
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

    mail($mail, $assunto, $mensagem, $headers);
}

// Verificar se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coleta o e-mail do formulário
    $email = $_POST['email'] ?? null;

    // Verifica se o campo de e-mail está vazio
    if (empty($email)) {
        $_SESSION['error'] = "O campo de e-mail é obrigatório.";
        header("Location: ../recuperarsenha.html"); // Redireciona para a página de recuperação
        exit();
    }

    // Valida o formato do e-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Por favor, insira um e-mail válido.";
        header("Location: ../recuperarsenha.html"); // Redireciona para a página de recuperação
        exit();
    }

    try {
        // Criar uma nova conexão PDO
        $conn = new PDO($dsn, $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Preparar e executar a consulta para verificar o e-mail
        $sql = "SELECT email FROM usuarios WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        // Verifica se o e-mail existe
        if ($stmt->fetch(PDO::FETCH_ASSOC)) { // Fetch retorna um array se o e-mail for encontrado
            // Gerar um código de recuperação
            $codigo = bin2hex(random_bytes(4)); // Gera um código hexadecimal de 8 caracteres
            $validade = date('Y-m-d H:i:s', strtotime('+4 hours')); // Define a validade para 4 horas a partir de agora

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
            enviarEmail($email, $codigo); // Corrigido para usar a variável correta $email

            // Redirecionar após enviar o e-mail
            header("Location: ../enviocodigo.html");
            exit();
        } else {
            // Definir uma mensagem de erro na sessão se o e-mail não for encontrado
            $_SESSION['error'] = "Usuário não encontrado.";
            header("Location: ../recuperarsenha.html"); // Redireciona para a página de recuperação
            exit();
        }
    } catch (PDOException $e) {
        // Em caso de erro na conexão ou consulta ao banco de dados
        $_SESSION['error'] = "Erro: " . $e->getMessage();
        header("Location: ../recuperarsenha.html"); // Redireciona para a página de recuperação
        exit();
    } finally {
        // Fechar a conexão
        $conn = null;
    }
}
?>