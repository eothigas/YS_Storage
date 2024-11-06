<?php

// Carrega as configurações do php.ini
$config = parse_ini_file('../../PHP/php.ini', true);

// Verifica se as configurações foram carregadas corretamente
if (!$config) {
    echo json_encode(["error" => "Erro ao carregar as configurações do php.ini"]);
    exit();
}

// Obtém as configurações do banco de dados a partir do php.ini
$host = $config['database']['host'];
$dbname = $config['database']['dbname'];
$user = $config['database']['user'];
$password = $config['database']['password'];

// Tente se conectar ao banco de dados e buscar as empresas
try {
    // Conexão com o banco de dados usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query para buscar as empresas
    $stmt = $pdo->query("SELECT id, razao FROM empresa ORDER BY razao");

    // Gerar as opções no formato de HTML
    $empresas = [];
    
    // Adiciona a primeira opção "Selecione uma empresa"
    $empresas[] = "<option value=''>Selecione uma empresa</option>";

    // Preenche as opções com as empresas no banco de dados
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $empresas[] = "<option value='" . $row['razao'] . "'>" . htmlspecialchars($row['razao']) . "</option>";
    }

    // Se não houver empresas, exibe uma opção vazia
    if (empty($empresas)) {
        echo "<option value=''>Nenhuma empresa encontrada</option>";
    } else {
        // Junta todas as opções em uma string e envia a resposta
        echo implode("\n", $empresas);
    }

} catch (PDOException $e) {
    // Se ocorrer um erro na conexão ou consulta
    echo "<option value=''>Erro ao carregar empresas: " . htmlspecialchars($e->getMessage()) . "</option>";
}
?>
