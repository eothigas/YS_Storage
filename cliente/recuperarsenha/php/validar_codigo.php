<?php
session_start();

header('Content-Type: application/json');

// Habilitar exibição de erros
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Carrega as configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["status" => "error", "message" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'] ?? null;
$dbname = $config['database']['dbname'] ?? null;
$user = $config['database']['user'] ?? null;
$password = $config['database']['password'] ?? null;

if (!$host || !$dbname || !$user || !$password) {
    echo json_encode(["status" => "error", "message" => "Configurações do banco de dados inválidas"]);
    exit();
}

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

try {
    // Criar uma nova conexão PDO
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar se o formulário foi enviado
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST['codigo'])) {
            $codigo = $_POST['codigo'];
            $email = $_SESSION['email'] ?? null;

            // Verificar se o código é válido e não expirou
            $sql = "SELECT email, codigo, validade FROM recuperacao_senha WHERE codigo = :codigo";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':codigo', $codigo);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                if (new DateTime() < new DateTime($row['validade'])) {
                    // Código válido - Deletar o código de recuperação após uso
                    $sqlDelete = "DELETE FROM recuperacao_senha WHERE codigo = :codigo";
                    $stmtDelete = $conn->prepare($sqlDelete);
                    $stmtDelete->bindParam(':codigo', $codigo);
                    $stmtDelete->execute();

                    // Responder com sucesso
                    echo json_encode(['status' => 'success', 'message' => 'Código válido!', 'redirect' => './senhanova.html']);
                    exit();
                } else {
                    // Código expirado
                    echo json_encode(['status' => 'error', 'message' => 'Código expirado. Solicite um novo código.']);
                    exit(); // Encerra o script após enviar a resposta
                }
            } else {
                // Código não encontrado
                echo json_encode(['status' => 'error', 'message' => 'Código incorreto ou expirado. Solicite um novo código']);
                exit(); // Encerra o script após enviar a resposta
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Código não foi enviado ao email.']);
            exit();
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro: " . $e->getMessage()]);
    exit();
}
?>
