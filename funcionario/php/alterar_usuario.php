<?php

session_start();

// Verifica se a sessão está ativa
if (!isset($_SESSION['id_funcionario'])) {
    echo json_encode(["error" => "Usuário não autenticado."]);
    exit();
}

// Carrega as configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Conexão ao banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    file_put_contents('log.txt', "Conexão bem-sucedida\n", FILE_APPEND);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
    exit();
}

// Coleta dados do formulário
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$plan = $_POST['plan'] ?? '';

// Buscar o usuário atual
$current_user_query = $pdo->prepare("SELECT nome, email, plano FROM usuarios WHERE email = :email");
$current_user_query->bindValue(':email', $email);
$current_user_query->execute();
$current_user = $current_user_query->fetch(PDO::FETCH_ASSOC);

if ($current_user) {
    $current_name = $current_user['nome'];
    $current_plan = $current_user['plano'];

    // Verifica se o nome ou email foram alterados
    $name_exists = false;
    $email_exists = false;

    // Verifica se o novo nome já existe
    if ($name !== $current_name) {
        $name_check_query = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE nome = :name");
        $name_check_query->bindValue(':name', $name);
        $name_check_query->execute();
        $name_exists = $name_check_query->fetchColumn() > 0;
    }

    // Verifica se o novo email já existe
    if ($email !== $current_user['email']) {
        $email_check_query = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = :email");
        $email_check_query->bindValue(':email', $email);
        $email_check_query->execute();
        $email_exists = $email_check_query->fetchColumn() > 0;
    }

    // Se o novo nome já existe
    if ($name_exists) {
        echo json_encode(['error' => 'Usuário informado já existe!']);
        exit();
    }

    // Se o novo email já existe
    if ($email_exists) {
        echo json_encode(['error' => 'Email informado já existe!']);
        exit();
    }

    // Atualizar somente se o nome ou email foram alterados
    $update_query = "UPDATE usuarios SET plano = :plan";
    
    // Se o nome ou email forem alterados, adiciona a consulta
    if ($name !== $current_name) {
        $update_query .= ", nome = :name";
    }
    if ($email !== $current_user['email']) {
        $update_query .= ", email = :email";
    }

    $update_query .= " WHERE email = :current_email";
    $stmt = $pdo->prepare($update_query);

    // Vincula os valores
    $stmt->bindValue(':plan', $plan);
    $stmt->bindValue(':current_email', $email);

    if ($name !== $current_name) {
        $stmt->bindValue(':name', $name);
    }
    if ($email !== $current_user['email']) {
        $stmt->bindValue(':email', $email);
    }

    // Realiza a atualização (update)
    try {
        $stmt->execute();
        echo json_encode(['success' => 'Usuário atualizado com sucesso!']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao atualizar os dados: ' . $e->getMessage()]);
    }
} else {
    echo json_encode([
        'redirect' => 'cadastro.php',
        'message' => 'Usuário não existe. Redirecionando para cadastro.', // Redireciona caso o usuário não exista, a tela de cadastro de novo usuário
        'name' => $name,
        'email' => $email,
        'plan' => $plan
    ]);
    exit();
}
?>
