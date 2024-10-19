<?php
header('Content-Type: application/json');
session_start();
$ini_array = parse_ini_file('../../../PHP/php.ini', true);

// Verifica se as configurações de banco de dados foram carregadas corretamente
if (!isset($ini_array['database'])) {
    echo json_encode(['error' => 'Configurações do banco de dados não encontradas.']);
    exit;
}

// Carrega as configurações do banco de dados
$host = $ini_array['database']['host'];
$dbname = $ini_array['database']['dbname'];
$user = $ini_array['database']['user'];
$password = $ini_array['database']['password'];

try {
    // Configurações de conexão com o banco de dados
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se os dados foram enviados via POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtém o ID do usuário da sessão
        $id = $_POST['edit-id']; 

        // Obtém os dados do formulário
        $nome = ucwords($_POST['edit-name']);
        $tipo = $_POST['tipo'];
        $email = $_POST['edit-email'];
        $password = $_POST['edit-password'];

        // Verifica se a senha não tem mais de 8 caracteres
        if (!empty($password) && strlen($password) > 8) {
            echo json_encode(['error' => 'A senha deve ter até 8 caracteres.']);
            exit;
        }

        // Prepara a consulta para atualizar os dados do usuário
        if (empty($password)) {
            // Se a senha estiver vazia, não atualiza a senha
            $stmt = $pdo->prepare("UPDATE usuarios SET nome = :nome, tipo = :tipo, email = :email WHERE id = :id");
        } else {
            // Atualiza a senha
            $stmt = $pdo->prepare("UPDATE usuarios SET nome = :nome, tipo = :tipo, senha = :senha, email = :email WHERE id = :id");
            $stmt->bindParam(':senha', password_hash($password, PASSWORD_DEFAULT)); // Atualiza a senha com hash
        }

        // Atribui os parâmetros
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':tipo', $tipo);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':id', $id);

        // Executa a consulta
        $stmt->execute();

        echo json_encode(['success' => 'Usuário atualizado com sucesso.']);
    } else {
        echo json_encode(['error' => 'Método de requisição inválido.']);
    }
} catch (PDOException $e) {
    // Retorna erro em formato JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
