<?php
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

    // Verifica se o parâmetro email foi passado
    if (!isset($_GET['email'])) {
        echo json_encode(['error' => 'Email não fornecido.']);
        exit;
    }

    $email = $_GET['email'];

    // Prepara a consulta para buscar o usuário pelo email
    $stmt = $pdo->prepare("SELECT nome, tipo, email FROM usuarios WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    // Busca o usuário
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        // Retorna os dados do usuário em formato JSON
        echo json_encode($usuario);
    } else {
        echo json_encode(['error' => 'Usuário não encontrado.']);
    }
} catch (PDOException $e) {
    // Retorna erro em formato JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
