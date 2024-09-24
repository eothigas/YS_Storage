<?php
session_start();

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

// Configuração do DSN para PDO
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Falha na conexão: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare('SELECT id, nome, senha FROM funcionarios WHERE email = ?');
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $user['id'];
        $nome = $user['nome'];
        $hashed_password = $user['senha'];

        if (password_verify($password, $hashed_password)) {
            // Armazena o ID, nome e email na sessão
            $_SESSION['id_funcionario'] = $id;
            $_SESSION['nome_funcionario'] = $nome;
            $_SESSION['email_funcionario'] = $email; // Armazena o email na sessão

            // Executa o script check_session
            include 'check_session.php';

            // Redireciona para a dashboard
            header('Location: dashboard.html');
            exit();
        } else {
            header('Location: index.html?error=Senha incorreta');
            exit();
        }
    } else {
        header('Location: index.html?error=Email não encontrado');
        exit();
    }
}
?>
