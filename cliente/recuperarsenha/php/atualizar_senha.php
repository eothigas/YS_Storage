<?php
session_start();

// Exibir todos os erros
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    echo json_encode(['error' => 'Erro ao carregar o arquivo php.ini.']);
    exit();
}

// Acessar credenciais do banco de dados
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$username = $config['database']['user'];
$password = $config['database']['password'];

// Verificar se o e-mail está na sessão
if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'Sessão expirada ou e-mail não encontrado.']);
    exit();
}

// Verificar se os dados foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter os valores do formulário
    $novaSenha = $_POST['senhanova'];
    $confirmacaoSenha = $_POST['confirm'];
    $email = $_SESSION['email'];

    // Verificar se as senhas correspondem
    if ($novaSenha !== $confirmacaoSenha) {
        echo json_encode(['error' => 'As senhas não correspondem.']);
        exit();
    }

    // Definir o DSN (Data Source Name)
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

    try {
        // Criar uma nova conexão PDO
        $conn = new PDO($dsn, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Gerar o hash da nova senha
        $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);

        // Preparar e executar a consulta para atualizar a senha
        $sql = "UPDATE usuarios SET senha = :senhaHash WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':senhaHash', $senhaHash);
        $stmt->bindParam(':email', $email);

        // Executar a consulta e verificar o resultado
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => 'Senha atualizada com sucesso.']);
                // Limpar a sessão após a atualização
                session_unset();
                session_destroy();
                exit();
            } else {
                echo json_encode(['error' => 'Nenhuma linha foi afetada. Verifique se o e-mail está correto.']);
            }
        } else {
            echo json_encode(['error' => 'Erro ao atualizar a senha.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro: ' . $e->getMessage()]);
    }

    // Fechar a conexão
    $conn = null;
} else {
    echo json_encode(['error' => 'Dados não enviados corretamente pelo formulário.']);
}
?>
