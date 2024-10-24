<?php
session_start();

// Verifica se a sessão está ativa
if (!isset($_SESSION['id_funcionario'])) {
    echo json_encode(["error" => "Usuário não autenticado."]);
    exit();
}

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Conectar ao banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
    exit();
}

// Parâmetros de paginação (números de páginas)
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

// Verificar se há uma query de pesquisa
$query = isset($_GET['query']) ? $_GET['query'] : '';

// Consulta do número total de usuários
if (!empty($query)) {
    // Pesquisa com filtro (search)
    $total_query = "SELECT COUNT(*) as total FROM usuarios WHERE nome LIKE :query OR tipo LIKE :query OR email LIKE :query OR plano LIKE :query OR empresa LIKE :query";
    $stmt = $pdo->prepare($total_query);
    $stmt->bindValue(':query', '%' . $query . '%', PDO::PARAM_STR);
} else {
    // Consulta sem filtro (sem search)
    $total_query = "SELECT COUNT(*) as total FROM usuarios";
    $stmt = $pdo->prepare($total_query);
}

$stmt->execute();
$total_result = $stmt->fetch(PDO::FETCH_ASSOC);
$total_users = $total_result['total'];
$total_pages = ceil($total_users / $limit);

// Consulta os dados dos usuários baseados nos caracteres escritos (atualiza conforme vai escrevendo)
if (!empty($query)) {
    // Pesquisa com filtro
    $user_query = "SELECT id, nome, tipo, email, plano, empresa FROM usuarios WHERE nome LIKE :query OR tipo LIKE :query OR email LIKE :query OR plano LIKE :query OR empresa LIKE :query LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($user_query);
    $stmt->bindValue(':query', '%' . $query . '%', PDO::PARAM_STR);
} else {
    // Consulta sem filtro
    $user_query = "SELECT id, nome, tipo, email, plano, empresa FROM usuarios LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($user_query);
}

// Vinculação de parâmetros de limite e offset
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Se não houver usuários encontrados, retorna a mensagem:
if (empty($usuarios)) {
    echo json_encode(['error' => 'Nenhum usuário encontrado.']);
    exit();
}

// Retorno de dados no formato JSON, para o JS coletar e exibir
echo json_encode([
    'usuarios' => $usuarios,
    'total_pages' => $total_pages,
    'current_page' => $page
]);
?>