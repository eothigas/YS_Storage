<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true); // Ajuste o caminho conforme necessário

// Verificar se as configurações foram carregadas corretamente
if (!$config) {
    die(json_encode(["error" => "Erro ao carregar as configurações do php.ini"]));
}

// Configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Configuração do DSN para PDO
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Falha na conexão: " . $e->getMessage());
}

// Verificação de Login
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email']; // Coleta email
    $password = $_POST['password']; // Coleta senha

    // Preparação de seleção para verificação dos dados (conforme o email)
    $stmt = $pdo->prepare('SELECT id, nome, senha FROM funcionarios WHERE email = ?');
    $stmt->execute([$email]);

    // Se email existir
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $user['id'];
        $nome = $user['nome'];
        $hashed_password = $user['senha'];

        // Verifica a senha
        if (password_verify($password, $hashed_password)) {
            // Armazena o ID, nome e email na sessão
            $_SESSION['id_funcionario'] = $id;
            $_SESSION['nome_funcionario'] = $nome;
            $_SESSION['email_funcionario'] = $email; // Armazena o email na sessão

            // Executa o script check_session
            include 'php/check_session.php'; // Ajuste o caminho se necessário

            // Redireciona para a dashboard
            header('Location: ../dashboard.html'); // Redireciona para a raiz
            exit();  
        } else {
            header('Location: index.html?error=Senha incorreta'); // Se senha incorreta
            exit();
        }
    } else {
        header('Location: index.html?error=Email não encontrado'); // Se não existir o email cadastrado
        exit();
    }
}
?>
