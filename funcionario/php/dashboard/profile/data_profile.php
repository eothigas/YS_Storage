<?php

session_start();  // Inicia a sessão
header('Content-Type: application/json'); // Retorno JSON

// Carregar configurações do php.ini
$config = parse_ini_file('./../../../../PHP/php.ini', true);

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

// Verifica se o ID da sessão está disponível (ele já é atribuído pelo check_session.php)
if (isset($_SESSION['id_funcionario'])) {
    $idFuncionario = $_SESSION['id_funcionario']; // Obtém o ID do funcionário da sessão

    try {
        // Conexão com o banco de dados usando PDO
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Consulta para obter o nome e a imagem do funcionário
        $sql = "SELECT nome, imagem FROM funcionarios WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $idFuncionario, PDO::PARAM_INT);
        $stmt->execute();

        // Verifica se encontrou o funcionário
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // Retorna os dados como JSON
            echo json_encode([
                'loggedIn' => true,  // Confirma que o usuário está logado
                'nome' => $row['nome'],
                'imagem' => $row['imagem']  // Retorna o nome e a imagem
            ]);
        } else {
            // Caso não encontre o funcionário
            echo json_encode([
                'loggedIn' => false,
                'error' => 'Funcionário não encontrado'
            ]);
        }

    } catch (PDOException $e) {
        // Caso ocorra algum erro na consulta
        echo json_encode([
            'loggedIn' => false,
            'error' => 'Erro na conexão com o banco de dados: ' . $e->getMessage()
        ]);
    }
} else {
    // Se o ID da sessão não estiver disponível
    echo json_encode([
        'loggedIn' => false,
        'error' => 'ID de sessão não encontrado'
    ]);
}
?>