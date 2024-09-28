<?php
session_start();
header('Content-Type: application/json'); //Retorno JSON

// Verifica se o funcionário está logado e se o email está na sessão
if (isset($_SESSION['id_funcionario']) && isset($_SESSION['email_funcionario'])) {
    echo json_encode([
        'loggedIn' => true,
        'email' => $_SESSION['email_funcionario']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
