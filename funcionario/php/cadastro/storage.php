<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Configurações do banco de dados e do IMGUR a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];
$imgurClientId = $config['imgur']['client_id'];

header('Content-Type: application/json'); // Define o cabeçalho para JSON

try {
    // Conexão com o banco de dados MySQL
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Recebe os dados do formulário
        $nome = trim($_POST['nome']);
        $empresa = trim($_POST['empresa']);
        $endereco = trim($_POST['endereco']);
        $altura = trim($_POST['altura']);
        $largura = trim($_POST['largura']);
        $comprimento = trim($_POST['comprimento']);

        // Validação de endereço único
        $stmt = $pdo->prepare("SELECT id FROM storage WHERE endereco = :endereco");
        $stmt->bindParam(':endereco', $endereco);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Storage já cadastrado."]);
            exit();
        }

        // Processa o upload da imagem para o IMGUR
        $imagemPath = null;
        if (!empty($_FILES["imagem"]["name"])) {
            $imagemData = file_get_contents($_FILES["imagem"]["tmp_name"]);
            $base64 = base64_encode($imagemData);
            
            // Faz o upload para o IMGUR
            $url = "https://api.imgur.com/3/image";
            $headers = [
                "Authorization: Client-ID $imgurClientId",
                "Content-Type: application/json"
            ];
            $postFields = json_encode(['image' => $base64]);

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);

            // Decodifica a resposta do IMGUR
            $responseData = json_decode($response, true);
            if (isset($responseData['data']['link'])) {
                $imagemPath = $responseData['data']['link'];
            } else {
                echo json_encode(["status" => "error", "message" => "Erro ao fazer upload da imagem no IMGUR."]);
                exit();
            }
        }

        // Insere os dados no banco de dados com ajuste do fuso horário para +02:00
        $stmt = $pdo->prepare("INSERT INTO storage (imagem, nome, empresa, endereco, altura, largura, comprimento, data_criacao, data_atualizacao)
            VALUES (:imagem, :nome, :empresa, :endereco, :altura, :largura, :comprimento, 
                    CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))");
        $stmt->bindParam(':imagem', $imagemPath);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':empresa', $empresa);
        $stmt->bindParam(':endereco', $endereco);
        $stmt->bindParam(':altura', $altura);
        $stmt->bindParam(':largura', $largura);
        $stmt->bindParam(':comprimento', $comprimento);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Storage cadastrado com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao cadastrar storage."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
