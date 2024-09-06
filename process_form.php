<?php
// Inicializa as variáveis de mensagem
$mensagemErro = '';

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Configurações do banco de dados
    $host = 'localhost';
    $dbname = 'tqvguepm_orcamento';
    $user = 'tqvguepm_orcamento';
    $password = 'yourstorage';

    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

    try {
        // Cria uma nova instância de PDO
        $pdo = new PDO($dsn, $user, $password);
        // Define o modo de erro para exceções
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Recebe os dados do formulário
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $telefone = $_POST['telefone'];
        $mensagem = $_POST['mensagem'];

        // Prepara a consulta SQL
        $sql = "INSERT INTO cliente (nome, email, telefone, mensagem) VALUES (:nome, :email, :telefone, :mensagem)";
        $stmt = $pdo->prepare($sql);

        // Vincula os parâmetros
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telefone', $telefone);
        $stmt->bindParam(':mensagem', $mensagem);

        // Executa a consulta
        $stmt->execute();

        // Redireciona para a mesma página para evitar reenvio do formulário
        header("Location: " . $_SERVER['PHP_SELF']);
        exit();
    } catch (PDOException $e) {
        // Define a mensagem de erro
        $mensagemErro = "Falha ao enviar os dados: " . $e->getMessage();
    }
}
?>
