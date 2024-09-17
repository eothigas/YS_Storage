<?php
// Configurações do banco de dados
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

try {
    // Criar uma nova conexão PDO
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar se o formulário foi enviado
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $codigo = $_POST['codigo'];

        // Verificar se o código é válido e não expirou
        $sql = "SELECT email, codigo, validade FROM recuperacao_senha WHERE codigo = :codigo";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':codigo', $codigo);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (new DateTime() < new DateTime($row['validade'])) {
                // Código válido
                header("Location: senhanova.html");
                exit();
            } else {
                // Código expirado
                echo "<p class='message'>Código expirado. Solicite um novo código.</p>";
            }
        } else {
            // Código não encontrado
            echo "<p class='message'>Código inválido. Tente novamente.</p>";
        }
    }
} catch (PDOException $e) {
    echo "<p class='message'>Erro: " . $e->getMessage() . "</p>";
}

// Fechar a conexão
$conn = null;
?>