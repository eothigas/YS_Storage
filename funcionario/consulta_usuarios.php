<?php
session_start(); // Correção aqui
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

// Verificar se há uma query de pesquisa
$query = isset($_GET['query']) ? $_GET['query'] : '';

// Consultar o número total de usuários
if (!empty($query)) {
    // Pesquisa com filtro
    $total_query = "SELECT COUNT(*) as total FROM usuarios WHERE nome LIKE :query OR email LIKE :query OR plano LIKE :query";
    $stmt = $pdo->prepare($total_query);
    $stmt->bindValue(':query', '%' . $query . '%', PDO::PARAM_STR);
} else {
    // Consulta sem filtro
    $total_query = "SELECT COUNT(*) as total FROM usuarios";
    $stmt = $pdo->prepare($total_query);
}

$stmt->execute();
$total_result = $stmt->fetch(PDO::FETCH_ASSOC);
$total_users = $total_result['total'];
$total_pages = ceil($total_users / $limit);

// Consultar os dados dos usuários com limite e offset
if (!empty($query)) {
    // Pesquisa com filtro
    $user_query = "SELECT nome, email, plano FROM usuarios WHERE nome LIKE :query OR email LIKE :query OR plano LIKE :query LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($user_query);
    $stmt->bindValue(':query', '%' . $query . '%', PDO::PARAM_STR);
} else {
    // Consulta sem filtro
    $user_query = "SELECT nome, email, plano FROM usuarios LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($user_query);
}

$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Retornar os dados no formato JSON
echo json_encode([
    'usuarios' => $usuarios,
    'total_pages' => $total_pages,
    'current_page' => $page
]);