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
        $nome = trim($_POST['nome']) . ' ' . trim($_POST['sobrenome']); // Combina nome e sobrenome
        $identidade = trim($_POST['identidade']); // Use trim para remover espaços
        $contato = trim($_POST['contato']);
        $email = trim($_POST['email']);
        $senha = trim($_POST['senha']);
        $confirmeSenha = trim($_POST['confirme_senha']);

        // Verifica se a identidade é única
        $stmt = $pdo->prepare("SELECT id FROM funcionarios WHERE identidade = :identidade");
        $stmt->bindParam(':identidade', $identidade);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Identidade já cadastrada."]);
            exit();
        }

        // Validação da senha
        if ($senha !== $confirmeSenha) {
            echo json_encode(["status" => "error", "message" => "As senhas não coincidem."]);
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

        // Hash da senha
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        // Insere os dados no banco de dados
        $stmt = $pdo->prepare("
            INSERT INTO funcionarios 
            (imagem, nome, identidade, contato, email, senha, data_criacao, data_atualizacao) 
            VALUES 
            (:imagem, :nome, :identidade, :contato, :email, :senha, 
            CONVERT_TZ(NOW(), '+00:00', '+02:00'), CONVERT_TZ(NOW(), '+00:00', '+02:00'))
        ");
        $stmt->bindParam(':imagem', $imagemPath);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':identidade', $identidade);
        $stmt->bindParam(':contato', $contato);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':senha', $senhaHash);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Funcionário cadastrado com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao cadastrar funcionário."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
