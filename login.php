<?php
// Inicie a sessão
session_start();

// Conecte-se ao banco de dados usando PDO
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'PK7hdr7c9&L8SK#J';

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

try {
    // Criar uma nova conexão PDO
    $conn = new PDO($dsn, $user, $password);
    
    // Definir o modo de erro do PDO para exceções
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Mostrar mensagem de erro em caso de falha de conexão
    die("Falha na conexão: " . $e->getMessage());
}

// Verifique se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prepare uma consulta SQL para verificar o email e a senha
    $sql = "SELECT email, senha, plano FROM usuarios WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    // Verifique se o usuário foi encontrado
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verifique se a senha está correta (assumindo que a senha foi criptografada com password_hash)
        if (password_verify($password, $row['senha'])) {
            // Armazene o email do usuário na sessão
            $_SESSION['email'] = $row['email'];

            // Redirecione o usuário com base no plano
            switch ($row['plano']) {
                case 'basico':
                    header("Location: index.html");
                    break;
                case 'logistico':
                    header("Location: planos.html");
                    break;
                case 'premium':
                    header("Location: premium.html");
                    break;
                default:
                    echo "Plano inválido.";
                    break;
            }
            exit();
        } else {
            // Senha incorreta
            echo "Senha incorreta.";
        }
    } else {
        // Email não encontrado
        echo "Email não encontrado.";
    }
}

// Fechar a conexão (opcional, pois o PDO faz isso automaticamente no fim do script)
$conn = null;
?>