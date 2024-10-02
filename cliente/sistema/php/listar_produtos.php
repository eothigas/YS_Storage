<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
ob_start(); // Inicia a captura da saída

// Verifica se o cliente está logado e se o email está na sessão
if (isset($_SESSION['email'])) {
    $response = [
        'loggedIn' => true,
        'nome' => $_SESSION['nome'],
        'tipo' => $_SESSION['tipo'],
        'email' => $_SESSION['email'],  // Aqui está o email do cliente
        'plano' => $_SESSION['plano'],  // Inclui o plano do cliente
        'empresa' => $_SESSION['empresa']  // Inclui a empresa do cliente
    ];
} else {
    echo json_encode(['loggedIn' => false]);
    exit();
}

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar o arquivo php.ini."]);
    exit();
}

// Acessar credenciais do banco de dados
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$username = $config['database']['user'];
$password = $config['database']['password'];

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erro de conexão: " . $e->getMessage()]);
    exit();
}

// Define o número de produtos por página
$produtosPorPagina = 5;

// Obtém o número da página a partir do parâmetro da URL, se não existir, inicia na página 1
$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$offset = ($pagina - 1) * $produtosPorPagina;

// Captura o termo de busca se existir
$search = isset($_GET['search']) ? $_GET['search'] : '';

// Verifica se um código foi enviado via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'])) {
    $codigo = $_POST['codigo'];

    // Consulta um único produto
    $stmt = $pdo->prepare("SELECT * FROM produtos WHERE codigo = :codigo AND empresa = :empresa");
    $stmt->execute(['codigo' => $codigo, 'empresa' => $response['empresa']]);
    $produto = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($produto) {
        // Decodifica as entidades HTML
        $produto['nome'] = html_entity_decode($produto['nome']);
        $produto['descricao'] = html_entity_decode($produto['descricao']);
        // Repita para outros campos conforme necessário

        header('Content-Type: application/json; charset=utf-8'); // Define o cabeçalho
        echo json_encode($produto);
    } else {
        echo json_encode(['error' => 'Produto não encontrado.']);
    }
} else {
    // Prepare a consulta para obter os produtos com base na pesquisa
    if ($search) {
        $stmt = $pdo->prepare("SELECT * FROM produtos WHERE empresa = :empresa AND (codigo LIKE :search OR nome LIKE :search OR tipo LIKE :search) LIMIT :offset, :limit");
        $searchParam = "%$search%";
        $stmt->bindParam(':empresa', $response['empresa']);
        $stmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM produtos WHERE empresa = :empresa LIMIT :offset, :limit");
        $stmt->bindParam(':empresa', $response['empresa']);
    }
    
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $produtosPorPagina, PDO::PARAM_INT);
    $stmt->execute();
    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Consulta para obter o total de produtos
    if ($search) {
        $totalStmt = $pdo->prepare("SELECT COUNT(*) FROM produtos WHERE empresa = :empresa AND (codigo LIKE :search OR nome LIKE :search OR tipo LIKE :search)");
        $totalStmt->bindParam(':empresa', $response['empresa']);
        $totalStmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
    } else {
        $totalStmt = $pdo->prepare("SELECT COUNT(*) FROM produtos WHERE empresa = :empresa");
        $totalStmt->bindParam(':empresa', $response['empresa']);
    }
    
    $totalStmt->execute();
    $totalProdutos = $totalStmt->fetchColumn();

    // Decodifica as entidades HTML para cada produto
    foreach ($produtos as &$produto) {
        $produto['nome'] = html_entity_decode($produto['nome']);
        $produto['descricao'] = html_entity_decode($produto['descricao']);
        // Repita para outros campos conforme necessário
    }

    // Adiciona os produtos e informações de paginação à resposta
    $response['produtos'] = $produtos;
    $response['totalProdutos'] = $totalProdutos;
    $response['paginaAtual'] = $pagina;
    $response['totalPaginas'] = ceil($totalProdutos / $produtosPorPagina); // Calcula o total de páginas

    // Enviar a resposta como JSON
    header('Content-Type: application/json; charset=utf-8'); // Define o cabeçalho
    ob_end_clean(); // Limpa a saída
    echo json_encode($response);
}
?>
