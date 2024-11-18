<?php
// Exibe erros para depuração
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Inicia a sessão
session_start();

// Verifica se o usuário está autenticado
if (!isset($_SESSION['id_funcionario'])) {
    header('Location: https://www.yourstorage.x10.mx/errors/html/error403_prohibed.html');
    exit;
}

// Carregar configurações do php.ini
$config = parse_ini_file('../../../PHP/php.ini', true);
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Conecta ao banco de dados
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

header('Content-Type: application/json'); // Define o cabeçalho para JSON

// Obtém o id_funcionario da sessão
$id_funcionario = $_SESSION['id_funcionario'];

// Prepara a consulta SQL para buscar as notificações relacionadas ao funcionário
$sql = "SELECT id_notification, status
        FROM notificacoes
        WHERE id_funcionario = ? AND status = 'nao_lido'";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_funcionario);
$stmt->execute();
$result = $stmt->get_result();

// Prepara a resposta
$response = [];
while ($row = $result->fetch_assoc()) {
    $notification = [
        'id_notification' => $row['id_notification'],
        'status' => $row['status']
    ];

    // Consulta na tabela notification_status para obter o tipo, nome e id_orcamento
    $id_notification = $row['id_notification'];
    $status_query = "SELECT tipo, nome, id_orcamento FROM notification_status WHERE id = ?";
    $status_stmt = $conn->prepare($status_query);
    $status_stmt->bind_param('i', $id_notification);
    $status_stmt->execute();
    $status_result = $status_stmt->get_result();
    
    if ($status_row = $status_result->fetch_assoc()) {
        // Definindo os dados da notificação
        $notification['type'] = $status_row['tipo'];
        $notification['nome'] = $status_row['nome'];
        $notification['id_orcamento'] = $status_row['id_orcamento']; // Garantindo que o id_orcamento seja retornado corretamente
    } else {
        // Se não encontrar o tipo, define um valor padrão
        $notification['type'] = 'Desconhecido';
        $notification['nome'] = 'Desconhecido';
        $notification['id_orcamento'] = null; // Valor nulo caso não haja id_orcamento
    }

    // Montar título e descrição com base no tipo
    switch ($notification['type']) {
        case 'formulario':
            // Título e descrição ajustados para incluir id_orcamento diretamente na frase de "ver dados"
            $notification['title'] = $notification['nome'] . " - Formulário Enviado";
            $notification['description'] = "Ver dados do formulário " . ($notification['id_orcamento'] ? "#{$notification['id_orcamento']}" : "não está disponível.");
            break;
        
        case 'funcionario_cadastro':
        case 'empresa_cadastro':
        case 'cliente_cadastro':
        case 'storage_cadastro':
            $notification['title'] = $notification['nome'] . " cadastrado";
            $notification['description'] = $notification['nome'] . " cadastrado com sucesso.";
            break;
        
        case 'funcionario_alteracao':
        case 'empresa_alteracao':
        case 'cliente_alteracao':
        case 'storage_alteracao':
            $notification['title'] = $notification['nome'] . " alterado";
            $notification['description'] = "Dados de " . $notification['nome'] . " alterados com sucesso.";
            break;
        
        case 'funcionario_exclusao':
        case 'empresa_exclusao':
        case 'cliente_exclusao':
        case 'storage_exclusao':
            $notification['title'] = $notification['nome'] . " excluído";
            $notification['description'] = $notification['nome'] . " excluído com sucesso.";
            break;
        
        default:
            $notification['title'] = "Notificação Desconhecida";
            $notification['description'] = "Ação não reconhecida.";
    }

    // Inclui o ID do orçamento separadamente na resposta, garantindo que o id_orcamento seja nulo ou válido
    $response[] = $notification;
}

// Retorna as notificações em formato JSON
echo json_encode(['status' => 'success', 'notifications' => $response]);

// Fecha a conexão
$conn->close();

?>
