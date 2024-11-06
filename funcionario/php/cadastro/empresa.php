<?php
session_start();
$config = parse_ini_file('../../../PHP/php.ini', true);
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

header('Content-Type: application/json');

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $logo = trim($_POST['logo']);
        $razao = trim($_POST['razao']);
        $fantasia = trim($_POST['fantasia']);
        $identidade = trim($_POST['identidade']);
        $endereco = trim($_POST['endereco']);
        $plano = trim($_POST['plano']);
        $contato = trim($_POST['contato']);
        $email = trim($_POST['email']);

        // Verifica se a identidade é única
        $stmt = $pdo->prepare("SELECT id FROM empresa WHERE identidade = :identidade");
        $stmt->bindParam(':identidade', $identidade);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Identidade já cadastrada."]);
            exit();
        }

        // Insere os dados no banco de dados
        $stmt = $pdo->prepare("INSERT INTO empresa (logo, razao, fantasia, identidade, endereco, plano, contato, emaill, data_criacao, data_atualizacao) VALUES (:logo, :razao, :fantasia, :identidade, :endereco, :plano, :contato, :emaill, NOW(), NOW())");
        $stmt->bindParam(':logo', $logo);
        $stmt->bindParam(':razao', $razao);
        $stmt->bindParam(':fantasia', $fantasia);
        $stmt->bindParam(':identidade', $identidade);
        $stmt->bindParam(':endereco', $endereco);
        $stmt->bindParam(':plano', $plano);
        $stmt->bindParam(':contato', $contato);
        $stmt->bindParam(':emaill', $email);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Empresa cadastrada com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao cadastrar empresa."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro na conexão: " . $e->getMessage()]);
}
?>
