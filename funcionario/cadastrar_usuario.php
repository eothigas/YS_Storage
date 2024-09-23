<?php
session_start();

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

$error = '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $senha = $_POST['password'];
    $confirmSenha = $_POST['confirm-password'];
    $plano = $_POST['plan'];

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
            $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Verificar se o nome ou e-mail já existem
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE nome = :name OR email = :email");
            $stmt->execute([':name' => $name, ':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $error = 'O nome ou o e-mail já estão cadastrados.';
            } else {
                // Cadastrar o novo usuário
                $hashedPassword = password_hash($senha, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, plano) VALUES (:name, :email, :password, :plan)");
                $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hashedPassword, ':plan' => $plano]);

                // Mensagem de sucesso
                $_SESSION['message'] = "Pronto! Usuário cadastrado.";
                $_SESSION['messageType'] = "success";
                header('Location: cadastro.php'); // Redirecionar para a página de cadastro
                exit();
            }
        } catch (PDOException $e) {
            $error = 'Erro ao conectar ao banco de dados: ' . $e->getMessage();
        }
    }

    // Se houver erro, armazena na sessão
    if ($error) {
        $_SESSION['message'] = $error;
        $_SESSION['messageType'] = 'error';
        header('Location: cadastro.php'); // Redirecionar para o formulário
        exit();
    }
}
?>
