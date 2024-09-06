<?php
require 'vendor/autoload.php'; // Inclua o autoload do Composer

use Dotenv\Dotenv;

// Carregar as variáveis de ambiente
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configurações do banco de dados usando variáveis de ambiente
$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

// Cria uma conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Obtém os dados do formulário
$nome = $_POST['nome'];
$email = $_POST['email'];
$telefone = $_POST['telefone'];
$mensagem = $_POST['mensagem'];

// Prepara a consulta SQL para inserir os dados
$sql = "INSERT INTO orcamentos (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nome, $email, $telefone, $mensagem);

// Executa a consulta e redireciona
if ($stmt->execute()) {
    // Dados armazenados com sucesso, redireciona para a página HTML
    header("Location: orcamento.html");
    exit();
} else {
    // Exibe mensagem de erro e redireciona
    echo "Erro: " . $stmt->error;
}

// Fecha a conexão
$stmt->close();
$conn->close();
?>
