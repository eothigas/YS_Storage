<?php
// Conectar ao banco de dados (assumindo que você já tem a configuração PDO)
try {
    $pdo = new PDO("mysql:host=localhost;dbname=pgudxdii_yourstorage", "pgudxdii_yourstorage", "PK7hdr7c9&L8SK#J");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados.']);
    exit();
}

// Parâmetros de paginação
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

// Consultar o número total de usuários
$total_query = "SELECT COUNT(*) as total FROM usuarios";
$total_stmt = $pdo->prepare($total_query);
$total_stmt->execute();
$total_result = $total_stmt->fetch(PDO::FETCH_ASSOC);
$total_users = $total_result['total'];
$total_pages = ceil($total_users / $limit);

// Consultar os dados dos usuários com limite e offset
$query = "SELECT nome, email, plano FROM usuarios LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Retornar os dados no formato JSON
echo json_encode([
    'usuarios' => $usuarios,
    'total_pages' => $total_pages,
    'current_page' => $page
]);
