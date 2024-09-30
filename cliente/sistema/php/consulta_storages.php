<?php
session_start();

header('Content-Type: application/json');

// Carrega as configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

if (!$config) {
    echo json_encode(['error' => 'Erro ao carregar as configurações do php.ini']);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'] ?? null;
$dbname = $config['database']['dbname'] ?? null;
$user = $config['database']['user'] ?? null;
$password = $config['database']['password'] ?? null;

// Verifica se as credenciais estão configuradas corretamente
if (!$host || !$dbname || !$user || !$password) {
    echo json_encode(['error' => 'Configurações de banco de dados incompletas']);
    exit();
}

try {
    // Definir o DSN (Data Source Name)
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

    // Cria uma nova conexão PDO
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica a empresa passada na seção 
    if (isset($_SESSION['empresa'])) {
        $empresa = $_SESSION['empresa'];

        // Consulta os storages da empresa no banco de dados
        $stmt = $pdo->prepare("SELECT imagem, nome, endereco, altura, largura, comprimento FROM storage WHERE empresa = :empresa");
        $stmt->bindParam(':empresa', $empresa);
        $stmt->execute();
        $storages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retorna os storages ou uma lista vazia
        if ($storages) {
            echo json_encode($storages);
        } else {
            echo json_encode([]); // Nenhum storage encontrado
        }
    } else {
        echo json_encode(['error' => 'Empresa não fornecida']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro na conexão com o banco de dados: ' . $e->getMessage()]);
}
?>
