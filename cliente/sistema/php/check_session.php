<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

header('Content-Type: application/json; charset=utf-8');

// Verifica se o cliente está logado e se o email está na sessão
if (isset($_SESSION['email'])) {  
    echo json_encode([
        'loggedIn' => true,
        'id' => $_SESSION['id'],
        'nome' => $_SESSION['nome'],
        'tipo' => $_SESSION['tipo'],
        'email' => $_SESSION['email'],
        'plano' => $_SESSION['plano'],
        'empresa' => $_SESSION['empresa'],
        'logo' => $_SESSION['logo']
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
