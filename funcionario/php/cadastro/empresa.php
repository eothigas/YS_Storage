<?php
session_start();
$config = parse_ini_file('../../../PHP/php.ini', true);
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];
$imgurClientId = $config['imgur']['client_id'];

header('Content-Type: application/json');

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $razao = trim($_POST['razao']);
        $fantasia = trim($_POST['fantasia']);
        $identidade = trim($_POST['identidade']);
        $endereco = trim($_POST['endereco']);
        $plano = trim($_POST['plano']);
        $contato = trim($_POST['contato']);
        $email = trim($_POST['email']);
        $imagemPath = null; // Inicializando o caminho da imagem

        // Verifica se a identidade é única
        $stmt = $pdo->prepare("SELECT id FROM empresa WHERE identidade = :identidade");
        $stmt->bindParam(':identidade', $identidade);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Identidade já cadastrada."]);
            exit();
        }

        // Processa o upload da imagem para o IMGUR
        if (!empty($_FILES["logo"]["name"])) {  
            $imagemData = file_get_contents($_FILES["logo"]["tmp_name"]); 

            // Codifica a imagem em base64
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

            // Verifica se a resposta é válida
            $responseData = json_decode($response, true);
            if (isset($responseData['data']['link'])) {
                $imagemPath = $responseData['data']['link'];
            } else {
                echo json_encode(["status" => "error", "message" => "Erro ao fazer upload da imagem no IMGUR."]);
                exit();
            }
        }

        // Insere os dados no banco de dados com ajuste de fuso horário (+02:00) para as colunas de data
        $stmt = $pdo->prepare("INSERT INTO empresa (logo, razao, fantasia, identidade, endereco, plano, contato, email, data_criacao, data_atualizacao) 
                               VALUES (:imagem, :razao, :fantasia, :identidade, :endereco, :plano, :contato, :email, 
                                       CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))");
        $stmt->bindParam(':imagem', $imagemPath);
        $stmt->bindParam(':razao', $razao);
        $stmt->bindParam(':fantasia', $fantasia);
        $stmt->bindParam(':identidade', $identidade);
        $stmt->bindParam(':endereco', $endereco);
        $stmt->bindParam(':plano', $plano);
        $stmt->bindParam(':contato', $contato);
        $stmt->bindParam(':email', $email);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Empresa cadastrada com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao cadastrar empresa."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
