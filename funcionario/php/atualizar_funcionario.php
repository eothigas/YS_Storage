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
        
        $nome = $data['nome'];
        $email = $data['email'];
        $imagem = isset($data['imagem']) ? $data['imagem'] : null;

        // Preparação de consulta SQL para atualização
        $sql = "UPDATE funcionarios SET email = :email" . 
               ($imagem ? ", imagem = :imagem" : "") .
               " WHERE nome = :nome";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        if ($imagem) {
            $stmt->bindParam(':imagem', $imagem, PDO::PARAM_STR);
        }
        $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);

        // Execução da consulta
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Dados atualizados com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao atualizar os dados."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
