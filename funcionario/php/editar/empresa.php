<?php

header('Content-Type: application/json; charset=UTF-8');
// Ativar exibição de erros (para desenvolvimento)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Carregar as configurações do arquivo php.ini
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

// Verificar se a conexão com o banco de dados foi bem-sucedida
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Configurar o charset da conexão para UTF-8
$conn->set_charset("utf8mb4");

// Função para obter o horário atual com fuso horário +02:00
function getCurrentDateTimeWithTimezone() {
    $datetime = new DateTime('now', new DateTimeZone('Europe/Paris')); // Fuso horário de Paris (+02:00)
    return $datetime->format('Y-m-d H:i:s');
}

// Configuração do IMGUR
$imgurClientId = $config['imgur']['client_id'] ?? '';

// Função para upload de imagem no IMGUR
function uploadImageToImgur($imageFile) {
    global $imgurClientId;

    // Definir a URL de upload do IMGUR
    $url = 'https://api.imgur.com/3/upload';

    // Preparar os dados para o upload
    $data = [
        'image' => base64_encode(file_get_contents($imageFile['tmp_name'])),
        'type' => 'base64'
    ];

    // Enviar a requisição para o IMGUR
    $headers = [
        'Authorization: Client-ID ' . $imgurClientId
    ];

    // Inicializar cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Obter a resposta
    $response = curl_exec($ch);
    
    // Verificar erro no cURL
    if (curl_errno($ch)) {
        echo json_encode(['status' => 'error', 'message' => 'Erro no cURL: ' . curl_error($ch)]);
        curl_close($ch);
        exit();
    }

    curl_close($ch);

    // Decodificar a resposta JSON
    $responseData = json_decode($response, true);

    if ($responseData['success']) {
        return $responseData['data']['link']; // URL da imagem carregada
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao fazer upload da imagem: ' . $responseData['data']['error']]);
        exit();
    }
}

// Verificar se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter os dados do formulário
    $id_empresa = $_POST['empresa-id'];
    $logo_url = null;
    $razao = $_POST['razao'] ?? null;
    $identidade = $_POST['identidade'] ?? null;
    $endereco = $_POST['endereco'] ?? null;
    $plano = $_POST['plano'] ?? null;
    $contato = $_POST['contato'] ?? null;
    $email = $_POST['email'] ?? null;
    $status = $_POST['status'] ?? null;

    // Verificar se foi enviada uma imagem
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0) {
        $logo_url = uploadImageToImgur($_FILES['imagem']); // Envia a imagem para o IMGUR
    }

    // Preparar a consulta de atualização, apenas com os campos que foram alterados
    $query = "UPDATE empresa SET ";
    $params = [];
    $types = "";

    if ($logo_url !== null) {
        $query .= "logo = ?, ";
        $params[] = $logo_url;
        $types .= "s";
    }
    if ($razao) {
        $query .= "razao = ?, ";
        $params[] = $razao;
        $types .= "s";
    }
    if ($identidade) {
        $query .= "identidade = ?, ";
        $params[] = $identidade;
        $types .= "s";
    }
    if ($endereco) {
        $query .= "endereco = ?, ";
        $params[] = $endereco;
        $types .= "s";
    }
    if ($plano) {
        $query .= "plano = ?, ";
        $params[] = $plano;
        $types .= "s";
    }
    if ($contato) {
        $query .= "contato = ?, ";
        $params[] = $contato;
        $types .= "s";
    }
    if ($email) {
        $query .= "email = ?, ";
        $params[] = $email;
        $types .= "s";
    }
    if ($status) {
        $query .= "status = ?, ";
        $params[] = $status;
        $types .= "s";
    }

    $query .= "data_atualizacao = ?";

    // Obter a data e hora atual com fuso horário +02:00
    $data_atualizacao = getCurrentDateTimeWithTimezone();

    // Adicionar o parâmetro da data de atualização
    $params[] = $data_atualizacao;
    $types .= "s";

    // Remover a última vírgula da consulta
    $query = rtrim($query, ', ') . " WHERE id = ?";

    // Adicionar o ID da empresa como parâmetro
    $params[] = $id_empresa;
    $types .= "i";

    if ($stmt = $conn->prepare($query)) {
        // Bind dos parâmetros
        $stmt->bind_param($types, ...$params);

        // Executar a query
        if ($stmt->execute()) {
            // Inserir na tabela notification_status
            $insertQuery = "INSERT INTO notification_status (nome, tipo, data_criacao, data_atualizacao) VALUES (?, ?, ?, ?)";

            // Preparar a consulta de inserção
            if ($insertStmt = $conn->prepare($insertQuery)) {
                // O nome será a razão social
                $nome = $razao;
                // O tipo de notificação será 'empresa_alteracao'
                $tipo = 'empresa_alteracao';

                // Bind dos parâmetros
                $insertStmt->bind_param("ssss", $nome, $tipo, $data_atualizacao, $data_atualizacao);

                // Executar a inserção
                if ($insertStmt->execute()) {
                    echo json_encode(['status' => 'success', 'message' => 'Empresa atualizada com sucesso.']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Erro ao criar notificação: ' . $insertStmt->error]);
                }

                // Fechar a consulta de inserção
                $insertStmt->close();
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta de notificação: ' . $conn->error]);
            }

        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar a empresa: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
    }

    // Fechar a conexão com o banco de dados
    $conn->close();
}
?>
