<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["status" => "error", "message" => "Erro ao carregar as configurações do php.ini"]);
    exit();
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
    echo json_encode(["status" => "error", "message" => "Falha na conexão: " . $e->getMessage()]);
    exit();
}

// Verificação de Login
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Preparação de seleção para verificação dos dados (conforme o email)
    $stmt = $pdo->prepare('SELECT id, nome, senha FROM funcionarios WHERE email = ?');
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $user['id'];
        $nome = $user['nome'];
        $hashed_password = $user['senha'];

        // Verifica a senha
        if (password_verify($password, $hashed_password)) {
            $_SESSION['id_funcionario'] = $id;
            $_SESSION['nome_funcionario'] = $nome;
            $_SESSION['email_funcionario'] = $email;

            // Retorna um JSON de sucesso com a URL de redirecionamento
            echo json_encode(["status" => "success", "redirect_url" => "dashboard.html"]);
        } else {
            // Retorna um JSON com a mensagem de erro de senha incorreta
            echo json_encode(["status" => "error", "message" => "Senha incorreta. Por favor, tente novamente."]);
        }
    } else {
        // Retorna um JSON com a mensagem de erro de email não encontrado
        echo json_encode(["status" => "error", "message" => "Email não encontrado. Tente novamente."]);
    }
}
?>
