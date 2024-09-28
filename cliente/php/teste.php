<?php
// Carregar configurações do php.ini da raiz
$config = parse_ini_file('../../PHP/php.ini', true);

// Verificar se o arquivo foi carregado corretamente
if (!$config) {
    die("Erro ao carregar o arquivo php.ini.");
}

// Acessar o Client ID do Imgur
$client_id = $config['imgur']['client_id'];

// Exemplo de uso: Exibir o Client ID
echo "Client ID do Imgur: " . $client_id;
?>
