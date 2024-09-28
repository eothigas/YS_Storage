<?php
// Inicia a sessão
session_start();

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

try {
    // Conexão com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtém o email do usuário a ser deletado
    $email = $_POST['email'];

    // Verifica se o email foi fornecido
    if (empty($email)) {
        echo json_encode(['error' => 'Email não fornecido.']);
        exit();
    }

    // Prepara e executa a consulta para deletar o usuário
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    // Verifica se o usuário foi deletado
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => 'Usuário deletado com sucesso.']);
    } else {
        echo json_encode(['error' => 'Nenhum usuário encontrado com este email.']);
    }

} catch (PDOException $e) {
    // Mensagem de erro em caso de falha na conexão ou execução
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
}
?>
