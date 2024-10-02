<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die(json_encode(["mensagem" => "Erro ao carregar o arquivo php.ini."]));
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
    die(json_encode(["mensagem" => "Erro de conexão: " . $e->getMessage()]));
}

// Verifica se os dados foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $produto = $_POST['produto'];
    $tipoMovimentacao = $_POST['tipo'];
    $motivo = $_POST['motivo'];
    $quantidade = $_POST['quantidade-movimentacao'];

    // Consultar a quantidade atual do produto
    $stmt = $pdo->prepare("SELECT quantidade FROM produtos WHERE codigo = :produto");
    $stmt->execute(['produto' => $produto]);
    $produtoDados = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$produtoDados) {
        echo json_encode(["mensagem" => "Produto não encontrado."]); // Enviar JSON
        exit();
    }

    // Verificar a quantidade do produto
    if ($tipoMovimentacao === 'saida' && $produtoDados['quantidade'] < $quantidade) {
        echo json_encode(["mensagem" => "Produto em quantidade insuficiente."]); // Enviar JSON
        exit();
    }

    // Lógica para registrar a movimentação (entrada ou saída)
    $novoQuantidade = $tipoMovimentacao === 'saida' ? $produtoDados['quantidade'] - $quantidade : $produtoDados['quantidade'] + $quantidade;

    // Atualizar a quantidade do produto no banco de dados
    $updateStmt = $pdo->prepare("UPDATE produtos SET quantidade = :quantidade WHERE codigo = :produto");
    $updateStmt->execute(['quantidade' => $novoQuantidade, 'produto' => $produto]);

    // Registrar a movimentação em uma tabela de movimentações (opcional)
    // $registrarStmt = $pdo->prepare("INSERT INTO movimentacoes (produto, tipo, quantidade, motivo) VALUES (:produto, :tipo, :quantidade, :motivo)");
    // $registrarStmt->execute(['produto' => $produto, 'tipo' => $tipoMovimentacao, 'quantidade' => $quantidade, 'motivo' => $motivo]);

    echo json_encode(["mensagem" => "Movimentação registrada com sucesso!"]); // Enviar JSON
    exit();
}

// Se não for um POST, retornar erro
echo json_encode(["mensagem" => "Método não permitido."]); // Enviar JSON
exit();
?>
