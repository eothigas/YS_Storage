<?php
include 'check_session.php'; // Inclui o arquivo de verificação de sessão (caso usuário deslogado tente acessar diretamente o arquivo)

session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

$error = '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $senha = $_POST['password'];
    $confirmSenha = $_POST['confirm-password'];
    $plano = $_POST['plano'];
    $tipo = $_POST['tipo']; // Novo campo para o tipo de usuário
    $empresa = trim($_POST['empresa']); // Novo campo para a empresa

    // Validações
    if (strlen($senha) < 8) {
        $error = 'A senha precisa ter no mínimo 8 caracteres.';
    } elseif ($senha !== $confirmSenha) {
        $error = 'As senhas não correspondem.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'E-mail inválido.';
    } else {
        try {
            // Conectar ao banco de dados
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Verifica se o nome ou e-mail já existem
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE nome = :name OR email = :email");
            $stmt->execute([':name' => $name, ':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $error = 'O nome ou o e-mail já estão cadastrados.';
            } else {
                // Cadastra o novo usuário
                $hashedPassword = password_hash($senha, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, plano, tipo, empresa) VALUES (:name, :email, :password, :plan, :tipo, :empresa)");
                $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hashedPassword, ':plan' => $plano, ':tipo' => $tipo, ':empresa' => $empresa]);

                // Mensagem de sucesso
                $_SESSION['message'] = "Pronto! Usuário cadastrado.";
                $_SESSION['messageType'] = "success";
                header('Location: /funcionario/cadastro.php'); // Redirecionar para a página de cadastro
                exit();
            }
        } catch (PDOException $e) {
            $error = 'Erro ao conectar ao banco de dados: ' . $e->getMessage();
        }
    }

    // Se houver algum erro, armazena na sessão
    if ($error) {
        $_SESSION['message'] = $error;
        $_SESSION['messageType'] = 'error';
        header('Location: /funcionario/cadastro.php'); // Redirecionamento para o formulário zerado
        exit();
    }
}
?>
