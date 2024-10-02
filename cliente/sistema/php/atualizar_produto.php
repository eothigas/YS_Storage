<?php
ob_start(); // Inicia o buffer de saída
require_once 'check_session.php'; // Verifique se o usuário está autenticado
$sessionResponse = ob_get_clean(); // Captura a saída

// Agora, você pode usar $sessionResponse para verificar se o usuário está autenticado
$sessionData = json_decode($sessionResponse, true);
if (!isset($sessionData['loggedIn']) || !$sessionData['loggedIn']) {
    echo json_encode(['error' => 'Usuário não autenticado.']);
    exit; // Saia do script se o usuário não estiver autenticado
}

// Função para fazer upload da imagem para o Imgur
function uploadToImgur($imageFile) {
    $clientId = parse_ini_file('../../../PHP/php.ini')['client_id']; // Obtenha o Client ID do Imgur do php.ini
    $url = 'https://api.imgur.com/3/image';

    $headers = [
        'Authorization: Client-ID ' . $clientId,
        'Content-Type: application/json',
    ];

    $imageData = base64_encode(file_get_contents($imageFile));
    $data = json_encode(['image' => $imageData]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    $responseData = json_decode($response, true);
    return $responseData['data']['link'] ?? null; // Retorna o link da imagem
}

// Coleta os dados do formulário
$codigo = $_POST['codigo-editar'] ?? null;
$nome = $_POST['nome-editar'] ?? null;
$descricao = $_POST['descricao-editar'] ?? null;
$quantidade = $_POST['quantidade-editar'] ?? null;
$tipo = $_POST['tipo-editar'] ?? null;
$destaque = isset($_POST['destaque-editar']) && $_POST['destaque-editar'] === '1' ? 1 : 0; 
$imagemLink = null;

// Se uma nova imagem foi enviada, faça o upload
if (isset($_FILES['imagem-editar']) && $_FILES['imagem-editar']['error'] === UPLOAD_ERR_OK) {
    $imagemLink = uploadToImgur($_FILES['imagem-editar']['tmp_name']);
}

// Debugging: Verifique o que está sendo enviado
file_put_contents('../../../logs/error.log', print_r($_POST, true));

// Verifica se todos os campos obrigatórios estão preenchidos
if ($codigo && $nome && $descricao && $quantidade && $tipo) {
    // Conecta-se ao banco de dados
    $ini = parse_ini_file('../../../PHP/php.ini');
    $dsn = "mysql:host={$ini['host']};dbname={$ini['dbname']};charset=utf8mb4";
    $pdo = new PDO($dsn, $ini['user'], $ini['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    try {
        // Atualiza o produto no banco de dados
        $sql = "UPDATE produtos SET nome = :nome, descricao = :descricao, quantidade = :quantidade, tipo = :tipo, destaque = :destaque" .
               ($imagemLink ? ", imagem = :imagem" : "") . 
               " WHERE codigo = :codigo";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':codigo', $codigo);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':quantidade', $quantidade);
        $stmt->bindParam(':tipo', $tipo);
        $stmt->bindParam(':destaque', $destaque);

        if ($imagemLink) {
            $stmt->bindParam(':imagem', $imagemLink);
        }

        $stmt->execute();

        // Retorna uma resposta JSON
        echo json_encode(['success' => 'Produto atualizado com sucesso!']);
    } catch (Exception $e) {
        // Retorna uma mensagem de erro em caso de falha
        error_log($e->getMessage(), 3, '../../../logs/erro.log'); // Armazena logs de erro
        echo json_encode(['error' => 'Erro ao atualizar o produto.']);
    }
} else {
    // Retorna um erro se algum campo obrigatório estiver vazio
    echo json_encode(['error' => 'Todos os campos são obrigatórios.']);
}

// Limpa o buffer de saída e envia a saída
ob_end_flush();
?>
