<?php
session_start();
header('Content-Type: application/json');

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true); // Ajuste o caminho conforme necessário

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Verifica se o email está armazenado na sessão
if (isset($_SESSION['email_funcionario'])) {
    $email = $_SESSION['email_funcionario'];

    try {
        // Conexão ao banco de dados
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Busca o nome e imagem no banco de dados baseado no email da sessão
        $stmt = $pdo->prepare('SELECT nome, email, imagem FROM funcionarios WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $funcionario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($funcionario) {
            // Retorna os dados do funcionário em JSON
            echo json_encode([
                'nome_funcionario' => $funcionario['nome'],
                'email' => $funcionario['email'],
                'imagem' => $funcionario['imagem'] // O caminho da imagem está sendo retornado
            ]);
        } else {
            echo json_encode(['error' => 'Funcionário não encontrado.']);
        }

    } catch (PDOException $e) {
        // Captura erros de conexão com o banco de dados
        echo json_encode(['error' => 'Erro ao se conectar ao banco de dados: ' . $e->getMessage()]);
    }

} else {
    // Erro caso o email não esteja disponível na sessão
    echo json_encode(['error' => 'Nenhum usuario logado.']);
}
?>
