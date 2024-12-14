<?php
session_start(); // Retoma a sessão (já iniciada)
session_unset(); // Limpeza de variáveis que possam ter ficado (como dados de cadastro, etc...)
session_destroy(); // Destrói a sessão atual
header('Content-Type: application/json'); // Retorno JSON
echo json_encode(['status' => 'success']); // Mensagem positiva
?>
