<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true); // Ajuste o caminho conforme necessário

// Carregar as configurações do banco de dados e a chave de API do Imgur a partir do php.ini
$imgurClientId = $config['imgur']['client_id']; // Carregar o Client ID do Imgur corretamente

header('Content-Type: application/json'); // Define o cabeçalho para JSON

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
            // Ler o conteúdo do arquivo de imagem
            $imagem = file_get_contents($_FILES['imagem']['tmp_name']);

            // Enviar a imagem para o Imgur
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "https://api.imgur.com/3/image");
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, ['image' => base64_encode($imagem)]);
            curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Client-ID ' . $imgurClientId]);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($curl);
            curl_close($curl);

            $imgurResponse = json_decode($response, true);

            if (isset($imgurResponse['success']) && $imgurResponse['success']) {
                // URL da imagem enviada para o Imgur
                $imageUrl = $imgurResponse['data']['link'];
                echo json_encode(["status" => "success", "data" => ["link" => $imageUrl]]);
            } else {
                echo json_encode(["status" => "error", "message" => "Erro ao enviar a imagem." . $imgurResponse['data']['error']]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Nenhuma imagem foi enviada ou houve um erro no upload."]);
        }
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Erro: " . $e->getMessage()]);
}
?>
