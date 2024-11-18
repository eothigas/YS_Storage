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

    // Consultas para contar o total de linhas em cada tabela
    $totalFuncionarios = $pdo->query("SELECT COUNT(*) FROM funcionarios")->fetchColumn();
    $totalEmpresas = $pdo->query("SELECT COUNT(*) FROM empresa")->fetchColumn();
    $totalClientes = $pdo->query("SELECT COUNT(*) FROM clientes")->fetchColumn();
    $totalStorages = $pdo->query("SELECT COUNT(*) FROM storage")->fetchColumn();

    // Retorna o resultado em JSON
    echo json_encode([
        'funcionarios' => $totalFuncionarios,
        'empresa' => $totalEmpresas,
        'clientes' => $totalClientes,
        'storage' => $totalStorages,
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
