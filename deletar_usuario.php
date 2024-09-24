<?php
// Inicia a sessão
session_start();

// Configurações do banco de dados
$host = 'localhost'; // Altere conforme necessário
$dbname = 'pgudxdii_yourstorage'; // Nome do banco de dados
$user = 'pgudxdii_yourstorage'; // Nome do usuário
$password = 'PK7hdr7c9&L8SK#J'; // Senha do banco de dados

try {
    // Conexão com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obter o email do usuário a ser deletado
    $email = $_POST['email'];

    // Verificar se o email foi fornecido
    if (empty($email)) {
        echo json_encode(['error' => 'Email não fornecido.']);
        exit();
    }

    // Preparar e executar a consulta para deletar o usuário
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    // Verifica se o usuário foi deletado
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => 'Usuário deletado com sucesso.']);
    } else {
        echo json_encode(['error' => 'Nenhum usuário encontrado com este email.']);
    }

} catch (PDOException $e) {
    // Mensagem de erro em caso de falha na conexão ou execução
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
}
?>
