<?php

header('Content-Type: application/json; charset=UTF-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Carregar configurações do arquivo php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo php.ini foi carregado corretamente
if (!$config) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao carregar o arquivo de configuração php.ini']);
    exit();
}

// Configuração do banco de dados
$host = $config['database']['host'] ?? 'localhost';
$dbname = $config['database']['dbname'] ?? 'nome_do_banco';
$user = $config['database']['user'] ?? 'usuario';
$password = $config['database']['password'] ?? 'senha';

// Conectar ao banco de dados
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Configurar o charset da conexão para UTF-8
$conn->set_charset("utf8mb4");

// Função para upload de imagem no IMGUR
function uploadImageToImgur($imageFile) {
    global $imgurClientId;
    $url = 'https://api.imgur.com/3/upload';
    $data = [
        'image' => base64_encode(file_get_contents($imageFile['tmp_name'])),
        'type' => 'base64'
    ];
    $headers = [
        'Authorization: Client-ID ' . $imgurClientId
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo json_encode(['status' => 'error', 'message' => 'Erro no cURL: ' . curl_error($ch)]);
        curl_close($ch);
        exit();
    }

    curl_close($ch);

    $responseData = json_decode($response, true);
    if ($responseData['success']) {
        return $responseData['data']['link'];
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao fazer upload da imagem: ' . $responseData['data']['error']]);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Coletar os dados
    $id_storage = $_POST['storage-id'] ?? null;
    $logo_url = null;
    $razao = $_POST['razao'] ?? null;
    $endereco = $_POST['endereco'] ?? null;
    $altura = $_POST['altura'] ?? null;
    $largura = $_POST['largura'] ?? null;
    $comprimento = $_POST['comprimento'] ?? null;
    $status = $_POST['status'] ?? null;
    
    // Verificar se foi enviada uma imagem
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0) {
        $logo_url = uploadImageToImgur($_FILES['imagem']);
    }

    // Construir a consulta SQL
    $query = "UPDATE storage SET ";
    $params = [];
    $types = "";

    if ($logo_url !== null) {
        $query .= "imagem = ?, ";
        $params[] = $logo_url;
        $types .= "s";
    }
    if ($razao) {
        $query .= "nome = ?, ";
        $params[] = $razao;
        $types .= "s";
    }
    if ($endereco) {
        $query .= "endereco = ?, ";
        $params[] = $endereco;
        $types .= "s";
    }
    if ($altura) {
        $query .= "altura = ?, ";
        $params[] = $altura;
        $types .= "s";
    }
    if ($largura) {
        $query .= "largura = ?, ";
        $params[] = $largura;
        $types .= "s";
    }
    if ($comprimento) {
        $query .= "comprimento = ?, ";
        $params[] = $comprimento;
        $types .= "s";
    }
    if ($status) {
        $query .= "status = ?, ";
        $params[] = $status;
        $types .= "s";
    }

    $query .= "data_atualizacao = CONVERT_TZ(NOW(), '+00:00', '+02:00')";

    // Remover a última vírgula da consulta
    $query = rtrim($query, ', ') . " WHERE id = ?";

    $params[] = $id_storage;
    $types .= "i";

    // Agora, ao invés de "echo", usamos json_encode para evitar problemas na saída
    $query_log = json_encode(['query' => $query, 'params' => $params]);

    // Log da query, apenas para depuração
    file_put_contents('query_log.json', $query_log . PHP_EOL, FILE_APPEND);

    if ($stmt = $conn->prepare($query)) {
        // A ligação de parâmetros deve ser correta
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Storage atualizado com sucesso.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar o storage: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
    }

    $conn->close();
}
?>
