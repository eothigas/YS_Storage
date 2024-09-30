<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json'); // Retorno JSON

// Verifica se o cliente está logado e se o email está na sessão
if (isset($_SESSION['email'])) {  
    echo json_encode([
        'loggedIn' => true,
        'nome' => $_SESSION['nome'],
        'tipo' => $_SESSION['tipo'],
        'email' => $_SESSION['email'],  // Aqui está o email do cliente
        'plano' => $_SESSION['plano'],  // Inclui o plano do cliente
        'empresa' => $_SESSION['empresa']  // Inclui a empresa do cliente
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
