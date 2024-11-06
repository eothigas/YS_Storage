<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Configurações do banco de dados
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

header('Content-Type: application/json'); // Define o cabeçalho para JSON

try {
    // Conexão com o banco de dados MySQL
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Recebe os dados do formulário
        $nome = trim($_POST['nome']) . ' ' . trim($_POST['sobrenome']); // Combina nome e sobrenome
        $identidade = trim($_POST['identidade']);
        $contato = trim($_POST['contato']);
        $empresa = trim($_POST['empresa']);
        $tipo = trim($_POST['tipo']);
        $email = trim($_POST['email']);
        $senha = trim($_POST['senha']);
        $confirmeSenha = trim($_POST['confirme_senha']);

        // Validação de identidade única
        $stmt = $pdo->prepare("SELECT id FROM clientes WHERE identidade = :identidade");
        $stmt->bindParam(':identidade', $identidade);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Identidade já cadastrada."]);
            exit();
        }

        // Validação de senhas
        if ($senha !== $confirmeSenha) {
            echo json_encode(["status" => "error", "message" => "As senhas não coincidem."]);
            exit();
        }

        // Hash da senha
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        // Insere os dados na tabela clientes
        $stmt = $pdo->prepare("INSERT INTO clientes (nome, identidade, contato, empresa, tipo, email, senha, data_criacao, data_atualizacao)
            VALUES (:nome, :identidade, :contato, :empresa, :tipo, :email, :senha, NOW(), NOW())");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':identidade', $identidade);
        $stmt->bindParam(':contato', $contato);
        $stmt->bindParam(':empresa', $empresa);
        $stmt->bindParam(':tipo', $tipo);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':senha', $senhaHash);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Cliente cadastrado com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao cadastrar cliente."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
