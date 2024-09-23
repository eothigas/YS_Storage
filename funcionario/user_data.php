<?php
// Faz uma requisição ao arquivo check_user.php para verificar se o usuário está logado
$checkUserResponse = file_get_contents('check_user.php');
$checkUserData = json_decode($checkUserResponse, true);

if (isset($checkUserData['loggedIn']) && $checkUserData['loggedIn'] === true) {
    // Verifica se o email do usuário está disponível no retorno de check_user
    if (isset($checkUserData['email'])) {
        // Conexão ao banco de dados usando o email retornado
        $stmt = $pdo->prepare("SELECT nome, imagem FROM funcionarios WHERE email = :email");
        $stmt->bindParam(':email', $checkUserData['email']);
        $stmt->execute();
        $funcionario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($funcionario) {
            // Retorna o nome e o link da imagem
            echo json_encode([
                'nome_funcionario' => $funcionario['nome'],
                'imagem' => $funcionario['imagem']
            ]);
        } else {
            echo json_encode(['error' => 'Funcionário não encontrado.']);
        }
    } else {
        echo json_encode(['error' => 'Email não encontrado na sessão.']);
    }
} else {
    echo json_encode(['error' => 'Usuário não autenticado.']);
    exit;
}

