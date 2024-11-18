<?php
header('Content-Type: application/json');

// Carregar configurações do php.ini
$config = parse_ini_file('./../../../../PHP/php.ini', true);

// Configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Função para coletar dados de empresas com limite de 5 registros em ordem aleatória
    function fetchEmpresasData($pdo) {
        $stmt = $pdo->query("
            SELECT 
                e.razao,
                e.plano,
                COUNT(DISTINCT c.id) AS clientes,
                COUNT(DISTINCT s.id) AS storage,
                e.status
            FROM empresa e
            LEFT JOIN clientes c ON c.empresa = e.razao
            LEFT JOIN storage s ON s.empresa = e.razao
            GROUP BY e.id
            ORDER BY RAND()  -- Ordem aleatória
            LIMIT 5
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Função para coletar dados de clientes com limite de 5 registros em ordem aleatória
    function fetchClientesData($pdo) {
        $stmt = $pdo->query("SELECT nome, email, empresa, tipo, status FROM clientes ORDER BY RAND() LIMIT 5");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Função para coletar dados de storages com limite de 5 registros em ordem aleatória
    function fetchStoragesData($pdo) {
        $stmt = $pdo->query("SELECT nome, endereco, empresa, imagem, status FROM storage ORDER BY RAND() LIMIT 5");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Coletando os dados de cada tabela
    $empresas = fetchEmpresasData($pdo);
    $clientes = fetchClientesData($pdo);
    $storages = fetchStoragesData($pdo);

    // Retornando dados em JSON
    echo json_encode([
        'empresa' => $empresas,
        'clientes' => $clientes,
        'storage' => $storages
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
