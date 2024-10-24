<?php
header('Content-Type: application/json');
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

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se os dados foram enviados via POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtém os dados do formulário
        $id = $_POST['edit-id']; 
        $nome = ucwords($_POST['edit-name'] ?? '');
        $email = $_POST['edit-email'] ?? null;
        $senha = trim($_POST['edit-password'] ?? '');
        $confirmarSenha = trim($_POST['confirm-password'] ?? null);
        $tipoUser = $_POST['tipo'] ?? null;

        // Valida os campos
        if (empty($nome) || empty($email)) {
            echo json_encode(['message' => 'Nome e email são obrigatórios.', 'type' => 'error']);
            exit;
        }

        // Verifica se o email já está cadastrado (exceto o usuário atual)
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email AND id != :id");
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Usuário já existe com esse email.', 'type' => 'error']);
            exit;
        }

        // Valida a senha
        if (!empty($senha) && $senha !== $confirmarSenha) {
            echo json_encode(['message' => 'As senhas não coincidem.', 'type' => 'error']);
            exit;
        }

        if (!empty($senha) && strlen($senha) < 8) {
            echo json_encode(['message' => 'A senha deve ter pelo menos 8 caracteres.', 'type' => 'error']);
            exit;
        }

        // Prepara a consulta para atualizar os dados do usuário
        $updateQuery = "UPDATE usuarios SET nome = :nome, email = :email, tipo = :tipo";
        if (!empty($senha)) {
            $updateQuery .= ", senha = :senha"; // Adiciona a senha se fornecida
        }
        $updateQuery .= " WHERE id = :id";

        $stmt = $pdo->prepare($updateQuery);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':tipo', $tipoUser);
        $stmt->bindParam(':id', $id);

        // Vincula a senha, se fornecida
        if (!empty($senha)) {
            $stmt->bindParam(':senha', password_hash($senha, PASSWORD_DEFAULT)); // Cria o hash da senha
        }

        // Executa a consulta
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Usuário atualizado com sucesso.', 'type' => 'success']);
        } else {
            echo json_encode(['message' => 'Falha ao atualizar o usuário.', 'type' => 'error']);
        }
    } else {
        echo json_encode(['error' => 'Método de requisição inválido.']);
    }
} catch (PDOException $e) {
    echo json_encode(['message' => 'Erro: ' . $e->getMessage(), 'type' => 'error']);
}
?>
