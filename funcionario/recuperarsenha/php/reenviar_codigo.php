<?php
session_start();

header('Content-Type: application/json');

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
    $de = 'noreply@yourstorage.x10.mx';
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

    // Recuperar e-mail da sessão
    $email = $_SESSION['email'] ?? null;
    if (!$email) {
        echo json_encode(['status' => 'error', 'message' => 'Email não encontrado na sessão.']);
        exit();
    }

    // Verificar se já existe um registro para o email
    $sqlCheck = "SELECT * FROM recuperacao_senha_funcionario WHERE email = :email";
    $stmtCheck = $conn->prepare($sqlCheck);
    $stmtCheck->bindParam(':email', $email);
    $stmtCheck->execute();

    if ($stmtCheck->rowCount() > 0) {
        // Se já existe um registro, lidar com reenvio
        $row = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        $tentativas = $row['tentativas'] ?? 0;
        $ultimoPedido = $row['ultimo_pedido'] ?? null;

        // Verifica se o cooldown de 1 minuto deve ser aplicado
        if ($tentativas >= 3) {
            $now = new DateTime();
            $lastRequestTime = new DateTime($ultimoPedido);
            $interval = $now->diff($lastRequestTime);

            // Se menos de 1 minuto passou desde o último pedido
            if ($interval->i <= 1) {
                echo json_encode(['status' => 'error', 'message' => 'Você atingiu o limite de reenvios!<br>Tente novamente em um minuto.']);
                exit();
            } else {
                // Reseta tentativas se passou mais de um minuto
                $tentativas = 0; // Reseta a variável em memória
                // Atualiza o banco de dados para resetar tentativas
                $sqlReset = "UPDATE recuperacao_senha_funcionario SET tentativas = :tentativas WHERE email = :email";
                $stmtReset = $conn->prepare($sqlReset);
                $stmtReset->bindParam(':tentativas', $tentativas);
                $stmtReset->bindParam(':email', $email);
                $stmtReset->execute();
            }
        }

        // Atualiza o código e validade
        $codigo = bin2hex(random_bytes(3)); // Gera um novo código
        $validade = date('Y-m-d H:i:s', strtotime('+5 minutes')); // Define a validade

        // Incrementa tentativas
        $tentativas++;

        $sqlUpdate = "UPDATE recuperacao_senha_funcionario SET codigo = :codigo, validade = :validade, tentativas = :tentativas, ultimo_pedido = CONVERT_TZ(NOW(), '+00:00', '+02:00') WHERE email = :email";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bindParam(':codigo', $codigo);
        $stmtUpdate->bindParam(':validade', $validade);
        $stmtUpdate->bindParam(':tentativas', $tentativas);
        $stmtUpdate->bindParam(':email', $email);
        $stmtUpdate->execute();
    } else {
        // Insere um novo registro se o email não estiver na tabela
        $codigo = bin2hex(random_bytes(3)); // Gera um novo código
        $validade = date('Y-m-d H:i:s', strtotime('+5 minutes')); // Define a validade

        // Inicializa tentativas como 1
        $tentativas = 1;

        $sqlInsert = "INSERT INTO recuperacao_senha_funcionario (email, codigo, validade, tentativas, ultimo_pedido) VALUES (:email, :codigo, :validade, :tentativas, CONVERT_TZ(NOW(), '+00:00', '+02:00'))";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bindParam(':email', $email);
        $stmtInsert->bindParam(':codigo', $codigo);
        $stmtInsert->bindParam(':validade', $validade);
        $stmtInsert->bindParam(':tentativas', $tentativas);
        $stmtInsert->execute();
    }

    // Enviar o e-mail com o código
    enviarEmail($email, $codigo);

    echo json_encode(["message" => "Código reenviado!"]);
    exit();

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro: " . $e->getMessage()]);
    exit();
}
?>
