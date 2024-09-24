<?php
session_start();
header('Content-Type: application/json');

// Verifica se o email está armazenado na sessão
if (isset($_SESSION['email_funcionario'])) {
    $email = $_SESSION['email_funcionario'];

    try {
        // Conexão ao banco de dados
        $pdo = new PDO('mysql:host=localhost;dbname=pgudxdii_yourstorage;charset=utf8mb4', 'pgudxdii_yourstorage', 'PK7hdr7c9&L8SK#J');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Busca o nome e imagem no banco de dados baseado no email da sessão
        $stmt = $pdo->prepare('SELECT nome, email, imagem FROM funcionarios WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $funcionario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($funcionario) {
            // Retorna os dados do funcionário em JSON
            echo json_encode([
                'nome_funcionario' => $funcionario['nome'],
                'email' => $funcionario['email'],
                'imagem' => $funcionario['imagem'] // O caminho da imagem está sendo retornado
            ]);
        } else {
            echo json_encode(['error' => 'Funcionário não encontrado.']);
        }

    } catch (PDOException $e) {
        // Captura erros de conexão com o banco de dados
        echo json_encode(['error' => 'Erro ao se conectar ao banco de dados: ' . $e->getMessage()]);
    }

} else {
    // Erro caso o email não esteja disponível na sessão
    echo json_encode(    'Deu erro porque: sem usuario conectado.'    );
}
?>
