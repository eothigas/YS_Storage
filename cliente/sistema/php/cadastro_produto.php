<?php
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
$imgurClientID = $config['imgur']['client_id']; // Pega o Client ID do Imgur

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erro de conexão: " . $e->getMessage()]);
    exit();
}

// Verifica se os dados foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Verifica se todos os campos necessários foram enviados
    if (isset($_POST['codigo'], $_POST['nome'], $_POST['descricao'], $_POST['quantidade'], $_POST['tipo'])) {

        // Sanitiza os dados recebidos
        $codigo = filter_var($_POST['codigo'], FILTER_SANITIZE_STRING);
        $nome = filter_var($_POST['nome'], FILTER_SANITIZE_STRING);
        $descricao = filter_var($_POST['descricao'], FILTER_SANITIZE_STRING);
        $quantidade = filter_var($_POST['quantidade'], FILTER_VALIDATE_INT);
        $tipo = filter_var($_POST['tipo'], FILTER_SANITIZE_STRING);

        // Verifica se o código do produto já existe no banco de dados
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM produtos WHERE codigo = :codigo");
        $stmt->bindParam(':codigo', $codigo);
        $stmt->execute();
        $codigoExistente = $stmt->fetchColumn();

        if ($codigoExistente > 0) {
            echo json_encode(["error" => "Já existe um produto com este código."]);
            exit();
        }

        // Verifica se uma imagem foi enviada
        if (!empty($_FILES['imagem']['tmp_name'])) {
            $imagem = $_FILES['imagem'];
            $filePath = $imagem['tmp_name'];
            $imgurUrl = uploadToImgur($filePath, $imgurClientID);

            if (!$imgurUrl) {
                echo json_encode(["error" => "Erro ao enviar a imagem para o Imgur."]);
                exit();
            }
        } else {
            // Se não houver imagem, pode armazenar um link padrão ou deixar vazio
            $imgurUrl = '';
        }

        // Insere os dados no banco de dados
        $sql = "INSERT INTO produtos (codigo, nome, descricao, quantidade, tipo, imagem) VALUES (:codigo, :nome, :descricao, :quantidade, :tipo, :imagem)";
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindParam(':codigo', $codigo);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':quantidade', $quantidade);
        $stmt->bindParam(':tipo', $tipo);
        $stmt->bindParam(':imagem', $imgurUrl); // Armazena a URL da imagem do Imgur

        // Executa a inserção no banco de dados
        if ($stmt->execute()) {
            echo json_encode(["success" => "Produto cadastrado com sucesso!"]);
        } else {
            echo json_encode(["error" => "Erro ao cadastrar o produto no banco de dados."]);
        }

    } else {
        echo json_encode(["error" => "Dados incompletos."]);
    }

} else {
    echo json_encode(["error" => "Método de requisição inválido."]);
}

// Função para enviar imagem ao Imgur
function uploadToImgur($imagePath, $clientID) {
    $url = 'https://api.imgur.com/3/image';
    $headers = array('Authorization: Client-ID ' . $clientID);

    // Lê o arquivo de imagem e codifica em base64
    $imageData = file_get_contents($imagePath);
    $imageBase64 = base64_encode($imageData);

    // Prepara os dados para enviar para a API
    $data = array('image' => $imageBase64);

    // Inicializa cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Executa o upload
    $response = curl_exec($ch);
    curl_close($ch);

    // Verifica a resposta do Imgur
    $responseData = json_decode($response, true);
    if (isset($responseData['data']['link'])) {
        return $responseData['data']['link']; // Retorna a URL da imagem
    } else {
        return false; // Em caso de erro
    }
}
?>
