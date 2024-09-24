<?php

session_start();
// Conectar ao banco de dados (assumindo que você já tem a configuração PDO)
try {
    $pdo = new PDO("mysql:host=localhost;dbname=pgudxdii_yourstorage", "pgudxdii_yourstorage", "PK7hdr7c9&L8SK#J");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados.']);
    exit();
}

// Coletar os dados do formulário
$name = $_POST['name'];
$email = $_POST['email'];
$plan = $_POST['plan'];

// Buscar o usuário atual
$current_user_query = $pdo->prepare("SELECT nome, email, plano FROM usuarios WHERE email = :email");
$current_user_query->bindValue(':email', $email);
$current_user_query->execute();
$current_user = $current_user_query->fetch(PDO::FETCH_ASSOC);

if ($current_user) {
    $current_name = $current_user['nome'];
    $current_plan = $current_user['plano'];

    // Verificar se o nome ou email foram alterados
    $name_exists = false;
    $email_exists = false;

    // Verifica se o novo nome já existe, mas não é o mesmo do atual
    if ($name !== $current_name) {
        $name_check_query = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE nome = :name");
        $name_check_query->bindValue(':name', $name);
        $name_check_query->execute();
        $name_exists = $name_check_query->fetchColumn() > 0;
    }

    // Verifica se o novo email já existe, mas não é o mesmo do atual
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

    // Atualizar somente se o nome ou email foram alterados, ou o plano
    $update_query = "UPDATE usuarios SET plano = :plan";
    
    // Se o nome ou email forem alterados, adicione-os à consulta
    if ($name !== $current_name) {
        $update_query .= ", nome = :name";
    }
    if ($email !== $current_user['email']) {
        $update_query .= ", email = :email";
    }

    $update_query .= " WHERE email = :current_email";
    $stmt = $pdo->prepare($update_query);

    // Bind the values
    $stmt->bindValue(':plan', $plan);
    $stmt->bindValue(':current_email', $email);

    if ($name !== $current_name) {
        $stmt->bindValue(':name', $name);
    }
    if ($email !== $current_user['email']) {
        $stmt->bindValue(':email', $email);
    }

    // Execute the update
    if ($stmt->execute()) {
        echo json_encode(['success' => 'Usuário atualizado com sucesso!']);
    } else {
        echo json_encode(['error' => 'Erro ao atualizar os dados.']);
    }
} else {
    echo json_encode([
        'redirect' => 'cadastro.php',
        'message' => 'Usuário não existe. Redirecionando para cadastro.',
        'name' => $name,
        'email' => $email,
        'plan' => $plan
    ]);
    exit();
}

?>