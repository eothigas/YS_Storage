<?php
// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Configurações do banco de dados
    $host = 'localhost';
    $dbname = 'tqvguepm_orcamento';
    $user = 'tqvguepm_orcamento';
    $password = 'yourstorage';

    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

    try {
        // Cria uma nova instância de PDO
        $pdo = new PDO($dsn, $user, $password);
        // Define o modo de erro para exceções
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Recebe os dados do formulário
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $telefone = $_POST['telefone'];
        $mensagem = $_POST['mensagem'];

        // Prepara a consulta SQL
        $sql = "INSERT INTO cliente (nome, email, telefone, mensagem) VALUES (:nome, :email, :telefone, :mensagem)";
        $stmt = $pdo->prepare($sql);

        // Vincula os parâmetros
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telefone', $telefone);
        $stmt->bindParam(':mensagem', $mensagem);

        // Executa a consulta
        $stmt->execute();

        // Configurações do e-mail
        $to = $email;
        $subject = "Confirmação de Orçamento";
        $message = "Olá $nome,\n\nAgradecemos pelo envio das suas informações! Gostaríamos de informar que recebemos e salvamos os seus dados com sucesso.\n\n ";
        $headers .= "Reply-To: contato@suempresa.com\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Envia o e-mail
        if (mail($to, $subject, $message, $headers)) {
            // Redireciona para a página de confirmação após o e-mail ser enviado com sucesso
            header("Location: orcamentopendente.html");
            exit();
        } else {
            // Se o e-mail não foi enviado, você pode redirecionar para uma página de erro ou mostrar uma mensagem de erro
            echo "Email não enviado";
            exit();
        }
    } catch (PDOException $e) {
        // Redireciona para a página de erro se necessário
        // header("Location: erro.html"); // Opcional: Página de erro genérica
        exit();
    }
}
?>
