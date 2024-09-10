<?php
// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Configurações do banco de dados
    $host = 'localhost';
    $dbname = 'pgudxdii_yourstorage';
    $user = 'pgudxdii__jC6639eHtW8oWN3WcFLoKVfzDG1JKEwu';
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
        $sql = "INSERT INTO orcamento (nome, email, telefone, mensagem) VALUES (:nome, :email, :telefone, :mensagem)";
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
        $subject = "Recebimento de Formulário - Your Storage";
        $message = "
        <html>
        <head>
            <meta charset='UTF-8'>
        </head>
        <body>
            <p>Olá $nome,</p>
            <p>Agradecemos pelo envio das suas informações! Gostaríamos de informar que recebemos e salvamos os dados em nosso banco de dados com sucesso.</p>
            <p>Um de nossos agentes comerciais entrará em contato com você dentro de <b>1 a 2 dias úteis</b> para discutir mais detalhes e esclarecer quaisquer dúvidas que você possa ter. O contato poderá ser realizado através do <b>e-mail</b> ou <b>telefone</b> fornecidos no formulário.</p>
            <p>Agradecemos por escolher nossa empresa e pelo tempo dedicado para preencher o formulário. Valorizamos cada dado recebido e faremos uma análise cuidadosa para garantir que possamos oferecer o melhor atendimento possível.</p>
            <p>Se precisar de mais informações ou tiver alguma dúvida imediata, não hesite em nos contatar.</p>
            <hr>
            <p>Atenciosamente,<br>Thiago Freitas / Your Storage</p>
        </body>
        </html>";

        $headers .= "Content-type: text/html; charset=UTF-8\r\n";

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
        header("Location: index.html"); // Opcional: Página de erro genérica
        exit();
    }
}
?>
