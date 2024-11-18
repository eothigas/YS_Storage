<?php
session_start();
header('Content-Type: application/json'); // Retorno JSON

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["status" => "error", "message" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Configuração do DSN para PDO
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Falha na conexão: " . $e->getMessage()]);
    exit();
}

// Verifica se o funcionário está logado e se o email está na sessão
if (isset($_SESSION['email_funcionario']) && isset($_SESSION['id_funcionario'])) {
    $email = $_SESSION['email_funcionario'];
    $idFuncionario = $_SESSION['id_funcionario'];

    // Consulta ao banco de dados para verificar o status do usuário
    try {
        $stmt = $pdo->prepare('SELECT id, nome, status, imagem FROM funcionarios WHERE email = ?');
        $stmt->execute([$email]);

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $id = $user['id'];
            $nome = $user['nome'];
            $status = $user['status'];
            $imagem = $user['imagem'];  // Retorna o caminho da imagem

            // Retorna os dados, incluindo 'loggedIn' como true
            echo json_encode([
                'loggedIn' => true, // Mantém como true
                'status' => $status, // O status será retornado
                'id' => $id,
                'nome' => $nome,
                'email' => $email,
                'status' => $status,
                'imagem' => $imagemURL  // Envia a URL da imagem
            ]);
        } else {
            // Se o usuário não for encontrado no banco de dados
            echo json_encode(['loggedIn' => false, 'status' => 'error', 'message' => 'Funcionário não encontrado']);
        }
    } catch (PDOException $e) {
        echo json_encode(['loggedIn' => false, 'status' => 'error', 'message' => 'Erro ao consultar o banco: ' . $e->getMessage()]);
    }
} else {
    // Se o email ou ID do funcionário não estiver presente na sessão
    echo json_encode(['loggedIn' => false, 'status' => 'error', 'message' => 'Sessão inválida ou expirada']);
}
?>
