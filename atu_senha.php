<?php
// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

// Obter os valores do formulário
$email = $_POST['email'];
$novaSenha = $_POST['password'];
$confirmacaoSenha = $_POST['confirm'];

// Verificar se as senhas correspondem
if ($novaSenha !== $confirmacaoSenha) {
    echo "<p class='message'>As senhas não correspondem.</p>";
    exit();
}

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

try {
    // Criar uma nova conexão PDO
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Gerar o hash da nova senha
    $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
    
    // Preparar e executar a consulta para atualizar a senha
    $sql = "UPDATE usuarios SET senha = :senhaHash WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':senhaHash', $senhaHash);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    // Redirecionar para a página de senha redefinida
    header('Location: senharedefinida.html');
    exit();
    
} catch (PDOException $e) {
    // Mostrar mensagem de erro em caso de falha de conexão ou execução de consulta
    echo "<p class='message'>Erro: " . $e->getMessage() . "</p>";
}

// Fechar a conexão
$conn = null;
?>
