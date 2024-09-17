<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualizar Senha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        h2 {
            margin-top: 0;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background-color: #28a745;
            color: #fff;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #218838;
        }
        .message {
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Atualizar Senha</h2>
        <form action="formulario_atualizar_senha.php" method="post">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="text" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Nova Senha:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Atualizar Senha</button>
        </form>

        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Configurações do banco de dados
            $host = 'localhost';
            $dbname = 'pgudxdii_yourstorage';
            $user = 'pgudxdii_yourstorage';
            $password = 'PK7hdr7c9&L8SK#J';

            // Obter os valores do formulário
            $email = $_POST['email'];
            $novaSenha = $_POST['password'];

            // Definir o DSN (Data Source Name)
            $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

            try {
                // Criar uma nova conexão PDO
                $conn = new PDO($dsn, $user, $password);
                
                // Definir o modo de erro do PDO para exceções
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                // Gerar o hash da nova senha
                $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);

                // Preparar e executar a consulta para atualizar a senha
                $sql = "UPDATE usuarios SET senha = :senhaHash WHERE email = :email";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':senhaHash', $senhaHash);
                $stmt->bindParam(':email', $email);
                $stmt->execute();

                echo "<p class='message'>Senha atualizada com sucesso.</p>";
            } catch (PDOException $e) {
                // Mostrar mensagem de erro em caso de falha de conexão ou execução de consulta
                echo "<p class='message'>Erro: " . $e->getMessage() . "</p>";
            }

            // Fechar a conexão
            $conn = null;
        }
        ?>
    </div>
</body>
</html>
