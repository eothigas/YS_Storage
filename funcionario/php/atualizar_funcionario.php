<?php
session_start();

// Carregar configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Carregar as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

header('Content-Type: application/json'); // Define o cabeçalho para retorno JSON

try {
    // Conexão banco de dados
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        // Obter ID do funcionário da sessão
        if (!isset($_SESSION['id_funcionario'])) {
            echo json_encode(["status" => "error", "message" => "Funcionário não encontrado."]);
            exit();
        }
        $id = $_SESSION['id_funcionario'];

        // Buscando os dados atuais do funcionário
        $currentStmt = $pdo->prepare("SELECT nome, email, imagem FROM funcionarios WHERE id = :id");
        $currentStmt->bindParam(':id', $id, PDO::PARAM_INT);
        $currentStmt->execute();
        $currentData = $currentStmt->fetch(PDO::FETCH_ASSOC);

        $nome = ucwords($data['nome']);
        $email = $data['email'];
        $imagem = isset($data['imagem']) ? $data['imagem'] : null;
        $senha = isset($data['senha']) ? $data['senha'] : null;

        // Verifica se o nome, email ou imagem mudaram
        $nomeMudou = $nome !== $currentData['nome'];
        $emailMudou = $email !== $currentData['email'];
        $imagemMudou = $imagem !== $currentData['imagem'];

        // Inicia a construção da consulta SQL
        $sql = "UPDATE funcionarios SET nome = :nome, email = :email" . 
               ($imagem ? ", imagem = :imagem" : "") . 
               ($senha ? ", senha = :senha" : "") . 
               " WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        if ($imagem) {
            $stmt->bindParam(':imagem', $imagem, PDO::PARAM_STR);
        }
        if ($senha) {
            $stmt->bindParam(':senha', password_hash($senha, PASSWORD_BCRYPT), PDO::PARAM_STR); // Atualiza a senha somente se fornecida
        }
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Binding do ID

        // Execução da consulta
        if ($stmt->execute()) {
            // Verifica se houve alguma alteração
            if ($nomeMudou || $emailMudou || $imagemMudou || $senha) {
                // Matar a sessão se o nome ou email mudaram
                if ($nomeMudou || $emailMudou) {
                    session_destroy();
                    echo json_encode([
                        "status" => "success", 
                        "message" => "Dados atualizados com sucesso! Faça login novamente.", 
                        "redirect" => "index.html"
                    ]);
                } else {
                    echo json_encode(["status" => "success", "message" => "Dados atualizados com sucesso, mas a sessão permanece ativa."]);
                }
            } else {
                echo json_encode(["status" => "success", "message" => "Dados inalterados."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao atualizar os dados."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
