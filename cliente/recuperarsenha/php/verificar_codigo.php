<?php
session_start();

// Carrega as configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém o fuso horário a partir das configurações
$timezone = $config['date']['timezone'];

// Configura o fuso horário no PHP
date_default_timezone_set($timezone);

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'] ?? null;
$dbname = $config['database']['dbname'] ?? null;
$user = $config['database']['user'] ?? null;
$password = $config['database']['password'] ?? null;

if (!$host || !$dbname || !$user || !$password) {
    echo json_encode(["error" => "Configurações do banco de dados inválidas"]);
    exit();
}

// Definir o DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

// Função para enviar e-mail
function enviarEmail($mail, $codigo) {
    $de = 'no-reply@yourstorage.x10.mx';
    $assunto = 'Recuperação de Senha - Your Storage';
    $mensagem = "
    <html>
    <head>
        <title>Recuperação de Senha</title>
    </head>
    <body>
        <p>Olá!</p>
        <p>Foi solicitado a alteração de senha da sua conta Your Storage. Insira o código abaixo na página de recuperação para redefinir sua senha.</p>
        <p><strong>Código gerado automaticamente: $codigo</strong></p>
        <p>Se você não solicitou a troca da senha, por favor desconsidere este e-mail.</p>
        <p>Atenciosamente,<br>Grupo Your Storage</p>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: ' . $de . "\r\n";

    mail($mail, $assunto, $mensagem, $headers);
}

try {
    // Criar uma nova conexão PDO
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar se o formulário foi enviado
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Lidar com o reenvio do código
        $email = $_SESSION['email'] ?? null;
        $codigo = $_POST['codigo'] ?? null; // O código pode ser nulo se for um novo pedido

        // Se o código foi enviado
        if ($codigo) {
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

                    // Redirecionar para a página de definição de senha
                    header("Location: ../senhanova.html");
                    exit();
                } else {
                    // Código expirado
                    echo "<p class='message'>Código incorreto. Tente novamente.</p>";
                }
            } else {
                // Código não encontrado
                echo "<p class='message'>Código expirado. Solicite um novo código.</p>";
            }
        } else {
            // Lidar com o pedido de reenvio do código
            $sql = "SELECT tentativas, ultimo_pedido FROM recuperacao_senha WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $tentativas = $row['tentativas'] ?? 0;
            $ultimoPedido = $row['ultimo_pedido'] ?? null;

            // Verifica se o cooldown de 1 minuto deve ser aplicado
            if ($tentativas >= 3) {
                $now = new DateTime();
                $lastRequestTime = new DateTime($ultimoPedido);
                $interval = $now->diff($lastRequestTime);

                // Se menos de 1 minuto passou desde o último pedido
                if ($interval->i < 1) {
                    echo json_encode(['message' => 'Você atingiu o limite de reenvios. Tente novamente em um minuto.']);
                    exit();
                } else {
                    // Reseta tentativas se passou mais de um minuto
                    $tentativas = 0; // Reseta a variável em memória
                    // Atualiza o banco de dados para resetar tentativas
                    $sqlReset = "UPDATE recuperacao_senha SET tentativas = :tentativas WHERE email = :email";
                    $stmtReset = $conn->prepare($sqlReset);
                    $stmtReset->bindParam(':tentativas', $tentativas);
                    $stmtReset->bindParam(':email', $email);
                    $stmtReset->execute();
                }
            }

            // Gerar um novo código de recuperação
            $codigo = bin2hex(random_bytes(4)); // Gera um novo código
            $validade = date('Y-m-d H:i:s', strtotime('+4 hours')); // Define a validade

            // Insere ou atualiza o código na tabela
            $sql = "INSERT INTO recuperacao_senha (email, codigo, validade, tentativas, ultimo_pedido) 
                    VALUES (:email, :codigo, :validade, :tentativas, NOW())
                    ON DUPLICATE KEY UPDATE codigo = :codigo, validade = :validade, 
                    tentativas = tentativas + 1, ultimo_pedido = NOW()";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':codigo', $codigo);
            $stmt->bindParam(':validade', $validade);
            $tentativas++; // Incrementa tentativas
            $stmt->bindParam(':tentativas', $tentativas);
            $stmt->execute();

            // Enviar o novo código por e-mail
            enviarEmail($email, $codigo);

            // Retornar uma resposta de sucesso
            echo json_encode(['message' => 'O código foi reenviado com sucesso.']);
        }
    }

} catch (PDOException $e) {
    echo "<p class='message'>Erro: " . $e->getMessage() . "</p>";
}

// Fechar a conexão
$conn = null;
?>

