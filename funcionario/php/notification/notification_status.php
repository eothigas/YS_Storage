<?php
session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION['id_funcionario'])) {
    // Se não estiver autenticado, redireciona para a página de erro 403
    header('Location: https://www.yourstorage.x10.mx/errors/html/error403_prohibed.html');
    exit;  // Impede que o código continue executando
}

// Carregar configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);

// Configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

header('Content-Type: application/json'); // Define o cabeçalho para JSON

$userId = $_SESSION['id_funcionario']; // ID do funcionário da sessão

try {
    // Conexão com o banco de dados MySQL
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se o método HTTP é GET (para verificar o status) ou POST (para atualizar o status)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Buscar notificações com status "nao_lido" para o funcionário logado
        $query = "SELECT id, id_notification, status FROM notificacoes WHERE status = 'nao_lido' AND id_funcionario = ? ORDER BY id DESC LIMIT 5";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$userId]);
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verifica se encontrou notificações
        if ($notifications) {
            echo json_encode(['status' => 'unread', 'notifications' => $notifications]); // Notificações não lidas encontradas
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Nenhuma notificação não lida encontrada']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Receber os dados JSON da requisição
        $data = json_decode(file_get_contents('php://input'), true);

        // Verificar se o ID da notificação foi passado
        if (isset($data['notification_id'])) {
            // Atualizar uma notificação específica
            $notificationId = $data['notification_id'];

            // Atualizar o status para "lido" na tabela notificacoes para o funcionário logado
            $query = "UPDATE notificacoes SET status = 'lido' WHERE id_notification = ? AND id_funcionario = ? AND status = 'nao_lido'";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$notificationId, $userId]);

            echo json_encode(['status' => 'success', 'message' => 'Notificação marcada como lida']);
        } elseif (isset($data['mark_all']) && $data['mark_all'] === true) {
            // Marcar todas as notificações como lidas
            $query = "UPDATE notificacoes SET status = 'lido' WHERE id_funcionario = ? AND status = 'nao_lido'";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$userId]);

            echo json_encode(['status' => 'success', 'message' => 'Todas as notificações foram marcadas como lidas']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ID da notificação ou parâmetros inválidos']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Método inválido']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar ou atualizar notificações: ' . $e->getMessage()]);
}
?>
