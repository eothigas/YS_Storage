<?php

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Definir cabeçalho como JSON
header('Content-Type: application/json');

// Conexão com o banco de dados
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Tente se conectar ao banco de dados e buscar as empresas
try {
    // Conexão com o banco de dados usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query para buscar as empresas
    $stmt = $pdo->query("SELECT razao FROM empresa ORDER BY razao");

    $empresas = [];
    
    // Preenche o array com as empresas
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $empresas[] = [
            'razao' => $row['razao'] // razão social da empresa
        ];
    }

    // Retorna o array de empresas como JSON, verificando se está vazio
    echo json_encode(['status' => 'success', 'data' => $empresas]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Erro ao carregar empresas: " . htmlspecialchars($e->getMessage())]);
}
?>
