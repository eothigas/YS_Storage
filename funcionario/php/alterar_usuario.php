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
$name = ucwords(trim($_POST['name'] ?? ''));
$tipo = ucfirst(trim($_POST['tipo'] ?? ''));
$email = trim($_POST['email']);
$plan = ucfirst($_POST['plan'] ?? '');
$empresa = ucfirst($_POST['empresa'] ?? '');
$current_id = $_POST['id'] ?? '';

// Armazenar o ID do usuário a partir da requisição (via JavaScript)
$current_id = $_POST['id'] ?? '';

// Buscar o email atual com base no ID
$current_user_query = $pdo->prepare("SELECT email FROM usuarios WHERE id = :id");
$current_user_query->bindValue(':id', $current_id);
$current_user_query->execute();
$current_user = $current_user_query->fetch(PDO::FETCH_ASSOC);

// Verifica se o usuário existe
if ($current_user) {
    // Atualizar os dados do usuário, incluindo o email
    $update_query = "UPDATE usuarios SET nome = :name, tipo = :tipo, email = :email, plano = :plan, empresa = :empresa WHERE id = :id";
    $stmt = $pdo->prepare($update_query);

    // Vincula os valores para atualização
    $stmt->bindValue(':name', $name);
    $stmt->bindValue(':tipo', $tipo);
    $stmt->bindValue(':email', $email); // Sobrescrever com o novo email
    $stmt->bindValue(':plan', $plan);
    $stmt->bindValue(':empresa', $empresa);
    $stmt->bindValue(':id', $current_id); // Usar o ID armazenado

    // Realiza a atualização (update)
    try {
        $stmt->execute();
        echo json_encode(['success' => 'Usuário atualizado com sucesso!']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao atualizar os dados: ' . $e->getMessage()]);
    }
} else {
    // Caso o usuário não exista
    echo json_encode(['error' => 'Usuário não encontrado.']);
    exit();
}
?>
