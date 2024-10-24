<?php
session_start();
header('Content-Type: application/json');

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

// DSN para conexão com o banco de dados
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
    // Conexão com o banco de dados usando PDO
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta o nome, email e plano dos 5 primeiros clientes cadastrados
    $sql = "SELECT nome, tipo, email, plano, empresa FROM usuarios ORDER BY RAND() LIMIT 5";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Armazena os resultados
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retorna os dados em formato JSON
    if (!empty($usuarios)) {
        echo json_encode(['status' => 'success', 'data' => $usuarios]);
    } else {
        echo json_encode(['status' => 'info', 'message' => 'Nenhum cliente encontrado.']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
}
?>
