<?php
// Iniciar sessão
session_start();

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Acessar credenciais do banco de dados e o charset
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$username = $config['database']['user'];
$password = $config['database']['password'];
$charset = 'utf8mb4';

// DSN (Data Source Name) para a conexão PDO
$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

try {
    // Cria a conexão com o banco de dados sem opções adicionais
    $conn = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    // Em caso de erro, exibe a mensagem e encerra o script
    die('Erro ao conectar ao banco de dados: ' . $e->getMessage());
}

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $senha = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

    // Verifica se o email e a senha foram preenchidos
    if (empty($email) || empty($senha)) {
        header("Location: ../login.html?error=empty_fields");
        exit();
    }

    // Preparar a consulta para verificar o usuário
    $stmt = $conn->prepare("SELECT email, plano, empresa, senha FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();


    // Verifica se o usuário foi encontrado
    if ($user) {
        // Verificar a senha
        if (password_verify($senha, $user['senha'])) {
            // Se a senha estiver correta, iniciar a sessão e redirecionar
            $_SESSION['email'] = $user['email'];
            $_SESSION['plano'] = $user['plano'];
            $_SESSION['empresa'] = $user['empresa'];
            header("Location: ../../sistema/home.html");

            include '../../sistema/php/check_session.php'; // Inclui o arquivo que retorna o JSON
            exit();  // Encerra o script após a inclusão
        } else {
            // Senha incorreta
            header("Location: ../login.html?error=invalid_password");
            exit();
        }
    } else {
        // Usuário não encontrado
        header("Location: ../login.html?error=user_not_found");
        exit();
    }
}
?>
