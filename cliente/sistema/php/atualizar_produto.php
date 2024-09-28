<?php
header('Content-Type: application/json');

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Acessar credenciais do banco de dados e o Client ID do Imgur
$host = $config['database']['host'];
$dbname = $config['database']['db_name'];
$username = $config['database']['user'];
$password = $config['database']['password'];
$imgurClientID = $config['imgur']['client_id'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtem dados do formulário
    $codigo = $_POST['codigo-editar'];
    $nome = $_POST['nome-editar'];
    $descricao = $_POST['descricao-editar'];
    $quantidade = $_POST['quantidade-editar'];
    $tipo = $_POST['tipo-editar'];

    // Variável para o caminho da imagem
    $imagemPath = '';

    // Se uma nova imagem for enviada
    if (isset($_FILES['imagem-editar']) && $_FILES['imagem-editar']['error'] === UPLOAD_ERR_OK) {
        $imagemFile = $_FILES['imagem-editar']['tmp_name'];

        // Upload para o Imgur
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Client-ID ' . $imgurClientID,
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'image' => base64_encode(file_get_contents($imagemFile)),
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);

        if (isset($data['data']['link'])) {
            $imagemPath = $data['data']['link']; // Link direto da imagem
        } else {
            throw new Exception('Erro ao fazer upload da imagem no Imgur: ' . $data['data']['error']);
        }
    } else {
        // Se não houver nova imagem, use a imagem existente (você pode ajustar isso conforme necessário)
        $stmt = $pdo->prepare("SELECT imagem FROM produtos WHERE codigo = :codigo");
        $stmt->bindParam(':codigo', $codigo);
        $stmt->execute();
        $produto = $stmt->fetch(PDO::FETCH_ASSOC);
        $imagemPath = $produto['imagem'];
    }

    // Atualiza o produto no banco de dados
    $stmt = $pdo->prepare("UPDATE produtos SET nome = :nome, descricao = :descricao, quantidade = :quantidade, tipo = :tipo, imagem = :imagem WHERE codigo = :codigo");
    $stmt->bindParam(':codigo', $codigo);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':quantidade', $quantidade);
    $stmt->bindParam(':tipo', $tipo);
    $stmt->bindParam(':imagem', $imagemPath);
    $stmt->execute();

    echo json_encode(['success' => 'Produto atualizado com sucesso.']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro ao atualizar produto: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
