<?php
session_start();
$ini_array = parse_ini_file('../../../PHP/php.ini', true);

if (!isset($ini_array['database'])) {
    echo json_encode(['error' => 'Configurações do banco de dados não encontradas.']);
    exit;
}

$host = $ini_array['database']['host'];
$dbname = $ini_array['database']['dbname'];
$user = $ini_array['database']['user'];
$password = $ini_array['database']['password'];

// Inicializa a variável de mensagem
$message = '';

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtém os dados do formulário
    $nome = ucwords($_POST['name'] ?? '');
    $identidade = $_POST['identidade'] ?? ''; 
    $contato = $_POST['contato'] ?? '';
    $email = $_POST['email-user'] ?? null;  
    $senha = trim($_POST['password'] ?? '');
    $confirmarSenha = trim($_POST['confirm-password']) ?? null;
    $tipoUser = trim($_POST['tipo-user']) ?? null;

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Verifica se a identidade ou o email já estão cadastrados
        $stmt = $pdo->prepare("SELECT * FROM clientes WHERE identidade = :identidade OR email = :email");
        $stmt->bindParam(':identidade', $identidade);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Se a identidade ou email já existe
            echo json_encode(['message' => 'Usuário já existe.', 'type' => 'error']);
            exit;
        }

        // Valida a senha
        if ($senha !== $confirmarSenha) {
            echo json_encode(['message' => 'As senhas não coincidem.', 'type' => 'error']);
            exit;
        }

        if (strlen($senha) < 8) {
            echo json_encode(['message' => 'A senha deve ter pelo menos 8 caracteres.', 'type' => 'error']);
            exit;
        }

        // Insere o novo usuário
        $stmt = $pdo->prepare("INSERT INTO clientes (nome, identidade, contato, email, senha, tipo, empresa, data_criacao, data_atualizacao) 
                                    VALUES (:nome, :identidade, :contato, :email, :senha, :tipo, :empresa, CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':identidade', $identidade);
        $stmt->bindParam(':contato', $contato);
        $stmt->bindParam(':email', $email); 
        $stmt->bindParam(':senha', password_hash($senha, PASSWORD_DEFAULT));
        $stmt->bindParam(':tipo', $tipoUser);
        $stmt->bindParam(':empresa', $_SESSION['empresa']);
        $stmt->execute();

        echo json_encode(['message' => 'Usuário cadastrado com sucesso.', 'type' => 'success']);
        exit;

    } catch (PDOException $e) {
        echo json_encode(['message' => 'Erro: ' . $e->getMessage(), 'type' => 'error']);
        exit;
    }
}
?>
