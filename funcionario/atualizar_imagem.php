<?php
// Conexão com o banco de dados
$dsn = 'mysql:host=localhost;dbname=pgudxdii_yourstorage';
$username = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recebe os dados enviados via JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Adicione esta linha para ver todos os dados recebidos
    file_put_contents('log.txt', print_r($data, true), FILE_APPEND);

    $nome = $data['nome'] ?? null;
    $email = $data['email'] ?? null;
    $novaSenha = $data['nova_senha'] ?? null;
    $imagem = $data['imagem'] ?? null;

    // ID do funcionário que será atualizado (pego da sessão)
    session_start();
    $sessionEmail = $_SESSION['email_funcionario']; // Usando o email da sessão para garantir que o funcionário está logado

    if (!$sessionEmail) {
        echo json_encode(['success' => false, 'message' => 'Email do funcionário não encontrado na sessão.']);
        exit;
    }

    // Monta o SQL dinamicamente para atualizar apenas os campos que foram alterados
    $sql = "UPDATE funcionarios SET nome = :nome";
    
    if ($novaSenha) {
        $hashedSenha = password_hash($novaSenha, PASSWORD_DEFAULT); // Faz o hash da nova senha
        $sql .= ", senha = :senha";
    }
    
    if ($imagem) {
        $sql .= ", imagem = :imagem";
    }

    // Filtra a atualização pelo email da sessão
    $sql .= " WHERE email = :email";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $sessionEmail);
    
    if ($novaSenha) {
        $stmt->bindParam(':senha', $hashedSenha);
    }

    if ($imagem) {
        $stmt->bindParam(':imagem', $imagem);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Falha ao atualizar os dados.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
