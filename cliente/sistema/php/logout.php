<?php
session_start(); // Inicia a sessão

// Limpa todas as variáveis de sessão
$_SESSION = [];

// Destrói a sessão
session_destroy();

// Redireciona para a página de login ou homepage
header("Location: ../../login/"); // Altere para a página desejada
exit();
?>
