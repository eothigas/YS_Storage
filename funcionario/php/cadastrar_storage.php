<?php
// Incluir a conexão com o banco de dados
$config = parse_ini_file('../../PHP/php.ini');
$dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8";
$pdo = new PDO($dsn, $config['user'], $config['password']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os dados do formulário
    $nome = $_POST['name'];
    $endereco = $_POST['adress'];
    $altura = $_POST['altura'];
    $largura = $_POST['largura'];
    $comprimento = $_POST['comprimento'];
    $empresa = $_POST['work'];
    $imagem = $_FILES['imagem'];

    // Verifica se a imagem foi enviada corretamente
    if ($imagem['error'] === UPLOAD_ERR_OK) {
        // Obtém o caminho temporário do arquivo
        $tempImagePath = $imagem['tmp_name'];

        // Upload para o Imgur
        $clientId = $config['client_id']; // Obtém o Client ID do Imgur
        $imageData = file_get_contents($tempImagePath);
        $base64 = base64_encode($imageData);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.imgur.com/3/image");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Client-ID $clientId"));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, array('image' => $base64));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        $responseData = json_decode($response, true);
        if (isset($responseData['data']['link'])) {
            $imgurLink = $responseData['data']['link']; // URL da imagem no Imgur

            // Verifica se já existe um storage com o mesmo endereço
            $sqlCheck = "SELECT COUNT(*) FROM storage WHERE endereco = :endereco";
            $stmtCheck = $pdo->prepare($sqlCheck);
            $stmtCheck->bindParam(':endereco', $endereco, PDO::PARAM_STR);
            $stmtCheck->execute();
            $count = $stmtCheck->fetchColumn();

            if ($count > 0) {
                // Se já existe, retorna mensagem de erro
                echo json_encode(["status" => "error", "message" => "Storage já cadastrado."]);
            } else {
                // Preparação da consulta SQL para inserir os dados no banco
                $sql = "INSERT INTO storage (imagem, nome, endereco, altura, largura, comprimento, empresa) 
                        VALUES (:imagem, :nome, :endereco, :altura, :largura, :comprimento, :empresa)";
                
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':imagem', $imgurLink, PDO::PARAM_STR);
                $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
                $stmt->bindParam(':endereco', $endereco, PDO::PARAM_STR);
                $stmt->bindParam(':altura', $altura, PDO::PARAM_INT);
                $stmt->bindParam(':largura', $largura, PDO::PARAM_INT);
                $stmt->bindParam(':comprimento', $comprimento, PDO::PARAM_INT);
                $stmt->bindParam(':empresa', $empresa, PDO::PARAM_STR);

                // Execução da consulta
                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Dados cadastrados com sucesso!"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Erro ao cadastrar os dados."]);
                }
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao fazer upload da imagem no Imgur."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Erro ao receber a imagem."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método de requisição inválido."]);
}
?>
