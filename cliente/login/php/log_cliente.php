<?php
// Iniciar sessão
session_start();

header('Content-Type: application/json; charset=utf-8');

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die(json_encode(["status" => "error", "message" => "Erro ao carregar o arquivo php.ini."]));
}

// Acessar credenciais do banco de dados e o charset
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$username = $config['database']['user'];
$password = $config['database']['password'];
$charset = 'utf8mb4';

// DSN (Data Source Name) para a conexão PDO
$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

try {
    // Cria a conexão com o banco de dados sem opções adicionais
    $conn = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Erro ao conectar ao banco de dados: " . $e->getMessage()])); 
}

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $senha = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

    // Verifica se o email e a senha foram preenchidos
    if (empty($email) || empty($senha)) {
        echo json_encode(["status" => "error", "message" => "Por favor, preencha todos os campos."]);
        exit();
    }

    // Preparar a consulta para verificar o usuário
    $stmt = $conn->prepare("SELECT id, nome, tipo, email, empresa, senha FROM clientes WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Verifica se o usuário foi encontrado
    if ($user) {
        // Verificar a senha
        if (password_verify($senha, $user['senha'])) {
            // Buscar a empresa na tabela empresa usando o valor da coluna `empresa` do cliente
            $stmtEmpresa = $conn->prepare("SELECT status, plano, logo FROM empresa WHERE razao = ? LIMIT 1");
            $stmtEmpresa->execute([$user['empresa']]);
            $empresa = $stmtEmpresa->fetch();

            // Verificar o status da empresa
            if ($empresa && strtolower(trim($empresa['status'])) === 'ativo') {
                // Se a empresa estiver ativa, iniciar a sessão e armazenar os dados necessários
                $_SESSION['id'] = $user['id'];
                $_SESSION['nome'] = $user['nome'];
                $_SESSION['tipo'] = $user['tipo'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['empresa'] = $user['empresa'];
                $_SESSION['plano'] = $empresa['plano'];
                $_SESSION['logo'] = $empresa['logo'];

                // Enviar sucesso como resposta
                echo json_encode(["status" => "success", "redirect" => "../sistema/home.html"]);
                exit();
            } else {
                // Empresa suspensa
                echo json_encode(["status" => "error", "message" => "Empresa suspensa."]);
                exit();
            }
        } else {
            // Senha incorreta
            echo json_encode(["status" => "error", "message" => "Senha incorreta."]);
            exit();
        }
    } else {
        // Usuário não encontrado
        echo json_encode(["status" => "error", "message" => "Usuário não encontrado."]);
        exit();
    }
}
?>
