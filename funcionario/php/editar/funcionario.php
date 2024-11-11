<?php
session_start();

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

// Verificar conexão com o banco de dados
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
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
    $id_funcionario = $_POST['id_funcionario'];
    $nome = $_POST['nome'] ?? null;
    $identidade = $_POST['identidade'] ?? null;
    $contato = $_POST['contato'] ?? null;
    $status = $_POST['status'] ?? null;
    $email = $_POST['email'] ?? null;
    $senha = $_POST['senha'] ?? null;
    $confirme_senha = $_POST['confirme_senha'] ?? null;

    // Verificar se as senhas coincidem
    if ($senha && $confirme_senha && $senha !== $confirme_senha) {
        echo json_encode(['status' => 'error', 'message' => 'As senhas não coincidem.']);
        exit();
    }

    // Hash da senha (somente se foi fornecida uma nova senha)
    if ($senha) {
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    } else {
        $senha_hash = null; // Não alterar a senha, mantê-la no banco
    }

    // Verificar se a identidade foi alterada e, se sim, fazer a verificação de identidade única
    if ($identidade) {
        // Verificar se a identidade já existe, mas excluir o próprio funcionário da verificação
        $stmt = $conn->prepare("SELECT id FROM funcionarios WHERE identidade = ? AND id != ?");
        $stmt->bind_param('si', $identidade, $id_funcionario);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Identidade já cadastrada."]);
            exit();
        }
        $stmt->close();
    }

    // Verificar se foi enviada uma imagem
    $image_url = null;
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0) {
        $image_url = uploadImageToImgur($_FILES['imagem']); // Envia a imagem para o IMGUR
    }

    // Preparar a consulta de atualização, apenas com os campos que foram alterados
    $query = "UPDATE funcionarios SET ";
    $params = [];
    $types = "";

    if ($nome) {
        $query .= "nome = ?, ";
        $params[] = $nome;
        $types .= "s";
    }
    if ($identidade) {
        $query .= "identidade = ?, ";
        $params[] = $identidade;
        $types .= "s";
    }
    if ($contato) {
        $query .= "contato = ?, ";
        $params[] = $contato;
        $types .= "s";
    }
    if ($status) {
        $query .= "status = ?, ";
        $params[] = $status;
        $types .= "s";
    }
    if ($email) {
        $query .= "email = ?, ";
        $params[] = $email;
        $types .= "s";
    }
    if ($senha_hash) {
        $query .= "senha = ?, ";
        $params[] = $senha_hash;
        $types .= "s";
    }
    if ($image_url !== null) {
        $query .= "imagem = ?, ";
        $params[] = $image_url;
        $types .= "s";
    }

    $query .= "data_atualizacao = CONVERT_TZ(NOW(), '+00:00', '+02:00')";

    // Remover a última vírgula da consulta
    $query = rtrim($query, ', ') . " WHERE id = ?";

    // Adicionar o ID do funcionário como parâmetro
    $params[] = $id_funcionario;
    $types .= "i";

    if ($stmt = $conn->prepare($query)) {
        // Bind dos parâmetros
        $stmt->bind_param($types, ...$params);

        // Executar a query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Funcionário atualizado com sucesso.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar o funcionário: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
    }

    // Fechar a conexão com o banco de dados
    $conn->close();
}
?>
