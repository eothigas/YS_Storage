<?php
session_start();
$ini_array = parse_ini_file('../../../PHP/php.ini', true);

if (!isset($ini_array['database'])) {
    echo json_encode(['error' => 'Configurações do banco de dados não encontradas.']);
    exit;
}

$host = $ini_array['database']['host'];
$dbname = $ini_array['database']['dbname'];
$user = $ini_array['database']['user'];
$password = $ini_array['database']['password'];

// Verifica se a sessão tem um plano definido
if (isset($_SESSION['plano'])) {
    $planoAtual = $_SESSION['plano'];

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Consulta o plano correspondente
        $stmt = $pdo->prepare("SELECT restricao1, restricao2, restricao3 FROM planos WHERE nome = :plano");
        $stmt->bindParam(':plano', $planoAtual);
        $stmt->execute();

        $plano = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($plano) {
            echo json_encode([
                'restricao1' => $plano['restricao1'],
                'restricao2' => $plano['restricao2'],
                'restricao3' => $plano['restricao3'],
                'plano' => ucfirst($planoAtual)
            ]);
        } else {
            echo json_encode(['error' => 'Plano não encontrado.']);
        }

    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Nenhum plano definido na sessão.']);
}
?>
