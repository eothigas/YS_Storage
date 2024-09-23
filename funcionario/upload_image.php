<?php

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

try {
    // Conectar ao banco de dados
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nomeFuncionario = $_POST['nome']; // Captura o nome do funcionário

        if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
            // Ler o conteúdo do arquivo de imagem
            $imagem = file_get_contents($_FILES['imagem']['tmp_name']);
            
            // Preparar a consulta SQL para atualizar a imagem
            $sql = "UPDATE funcionarios SET imagem = :imagem WHERE nome = :nome";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':imagem', $imagem, PDO::PARAM_LOB);
            $stmt->bindParam(':nome', $nomeFuncionario, PDO::PARAM_STR);

            // Executar a consulta
            if ($stmt->execute()) {
                echo "Imagem atualizada com sucesso!";
            } else {
                echo "Erro ao atualizar a imagem.";
            }
        } else {
            echo "Nenhuma imagem foi enviada ou houve um erro no upload.";
        }
    }
} catch (PDOException $e) {
    echo "Erro na conexão: " . $e->getMessage();
}
?>
