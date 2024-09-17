<?php
// Inicie a sessão
session_start();

// Conecte-se ao banco de dados (substitua os valores pelas suas credenciais)
$host = 'localhost';
$dbname = 'pgudxdii_yourstorage';
$user = 'pgudxdii_yourstorage';
$password = 'EFMjb!8EN';

$conn = new mysqli($host, $username, $password, $dbname);

// Verifique se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Verifique se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prepare uma consulta SQL para verificar o email e a senha
    $sql = "SELECT email, senha, plano FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verifique se o usuário foi encontrado
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

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

$conn->close();
?>
