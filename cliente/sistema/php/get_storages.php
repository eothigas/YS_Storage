<?php
session_start();
$ini_array = parse_ini_file('../../../PHP/php.ini', true);

if (!isset($ini_array['database'])) {
    echo json_encode(['error' => 'Configurações do banco de dados não encontradas.']);
    exit;
}

$host = $ini_array['database']['host'];
$dbname = $ini_array['database']['dbname'];
$user = $ini_array['database']['user'];
$password = $ini_array['database']['password'];

// Conecta ao banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtém o nome da empresa da sessão
    $empresa = $_SESSION['empresa'];

    // Pega a página atual a partir da URL, padrão para 1
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 5; // Limite de resultados por página
    $offset = ($page - 1) * $limit; // Offset para a consulta

    // Prepara e executa a consulta
    $stmt = $pdo->prepare("SELECT * FROM storage WHERE empresa = :empresa LIMIT :limit OFFSET :offset");
    $stmt->bindParam(':empresa', $empresa);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    // Obtém os resultados
    $storages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Conta o total de storages para calcular o número total de páginas
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM storage WHERE empresa = :empresa");
    $countStmt->bindParam(':empresa', $empresa);
    $countStmt->execute();
    $totalCount = $countStmt->fetchColumn();

    // Retorna os dados e informações de paginação em formato JSON
    echo json_encode([
        'storages' => $storages,
        'totalCount' => $totalCount,
        'totalPages' => ceil($totalCount / $limit),
        'currentPage' => $page
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
