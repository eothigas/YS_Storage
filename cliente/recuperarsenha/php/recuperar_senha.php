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
    $de = 'noreply@yourstorage.x10.mx';
    $assunto = 'Recuperação de Senha - Your Storage';
    $assunto = mb_encode_mimeheader($assunto, 'UTF-8');
    $mensagem = "
    <html>
    <head>
        <meta charset='UTF-8'>
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
    $headers .= 'Reply-To: ' . $de . "\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();

    mail($mail, $assunto, $mensagem, $headers);
}

// Verificar se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coleta o e-mail do formulário
    $email = $_POST['email'] ?? null;

    // Valida o formato do e-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Por favor, insira um e-mail válido.";
        header("Location: ../recuperarsenha.html?error=dadosinvalidos"); // Adiciona o parâmetro
        exit();
    }

    try {
        // Criar uma nova conexão PDO
        $conn = new PDO($dsn, $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Preparar e executar a consulta para verificar o e-mail
        $sql = "SELECT email FROM clientes WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        // Verifica se o e-mail existe
        if ($stmt->fetch(PDO::FETCH_ASSOC)) { // Fetch retorna um array se o e-mail for encontrado
            // Gerar um código de recuperação
            $codigo = bin2hex(random_bytes(3)); // Gera um código hexadecimal de 8 caracteres
            date_default_timezone_set('America/Sao_Paulo'); //Datetime Correto
            $validade = date('Y-m-d H:i:s', strtotime('+5 minutes')); // Validade de 5 minutos

            // Preparar e executar a consulta para inserir o código e a validade
            try {
                $sql = "INSERT INTO recuperacao_senha (email, codigo, validade) VALUES (:email, :codigo, :validade)
                        ON DUPLICATE KEY UPDATE codigo = :codigo, validade = :validade";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':codigo', $codigo);
                $stmt->bindParam(':validade', $validade);
                $stmt->execute();
            } catch (PDOException $e) {
                // Log do erro
                file_put_contents('../../../logs/erro.log', $e->getMessage(), FILE_APPEND);
                $_SESSION['error'] = "Erro ao armazenar no banco de dados: " . $e->getMessage();
                header("Location: ../recuperarsenha.html?error=");
                exit();
            }

            // Salvar o e-mail na sessão
            $_SESSION['email'] = $email;

            // Enviar e-mail com o código de recuperação
            enviarEmail($email, $codigo); // Corrigido para usar a variável correta $email

            // Redirecionar após enviar o e-mail
            header("Location: ../enviocodigo.html");
            exit();
        } else {
            // Definir uma mensagem de erro na sessão se o e-mail não for encontrado
            $_SESSION['error'] = "Cliente não existe.";
            header("Location: ../recuperarsenha.html?error=usuario_nao_encontrado");
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
