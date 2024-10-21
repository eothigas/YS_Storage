<?php
session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['id_funcionario'])) {
    header('Location: /funcionario/index.html'); // Redireciona para a página de login
    exit(); // Encerrar o script após o redirecionamento
}

// Armazenamento das mensagens (erro, sucesso e aviso)
$message = isset($_SESSION['message']) ? $_SESSION['message'] : '';
$messageType = isset($_SESSION['messageType']) ? $_SESSION['messageType'] : '';
unset($_SESSION['message'], $_SESSION['messageType']); // Limpa a mensagem após exibi-la
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="./src/images/Logo_reduzido.svg" type="image/png">
    <title>Your Storage - Novo Cadastro</title>
    <link rel="stylesheet" href="./src/css/cadastro.css">
    <link rel="stylesheet" href="./src/css/cadastroresponsive.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script>
        // Quando aparecer a mensagem de aviso e redirecionar pra cá, já preencherá os campos automaticamente (exceto a senha e confirmação de senha)
        document.addEventListener('DOMContentLoaded', () => {
            const messageDiv = document.getElementById('registration-message');
            if (messageDiv.textContent.trim() !== '') {
                messageDiv.style.display = 'block'; // Mostra a mensagem
                setTimeout(() => {
                    messageDiv.style.display = 'none'; // Oculta após 10 segundos
                }, 10000);
            }

            // Recuperar os valores do session storage
            const name = sessionStorage.getItem('name');
            const tipo = sessionStorage.getItem('tipo');
            const email = sessionStorage.getItem('email');
            const plan = sessionStorage.getItem('plan');
            const empresa = sessionStorage.getItem('empresa');

            // Preencher os inputs, se os valores existirem
            if (name) {
                document.getElementById('name').value = name; 
                sessionStorage.removeItem('name'); // Limpar o item do session storage
            }
            if (tipo) {
                document.getElementById('tipo').value = tipo; 
                sessionStorage.removeItem('tipo'); // Limpar o item do session storage
            }
            if (email) {
                document.getElementById('email').value = email; 
                sessionStorage.removeItem('email'); // Limpar o item do session storage
            }
            if (plan) {
                document.querySelector(`input[name="plan"][value="${plan}"]`).checked = true;
                sessionStorage.removeItem('plan'); // Limpar o item do session storage
            }
            if (empresa) {
                document.getElementById('empresa').value = empresa; 
                sessionStorage.removeItem('empresa'); // Limpar o item do session storage
            }
        });
    </script>
    <script src="./src/js/verify_session.js" type="text/javascript" defer></script>
</head>
<body>

    <div class="logo-r">
        <img src="./src/images/Logo_reduzido.svg" alt="Logo Reduzido">
    </div>
    
    <nav class="menu-lateral">

        <div class="btn-expandir">
            <i class="bi bi-list" id="btn-exp"></i>
        </div>

        <ul id="cima">
            <li class="item-menu">
                <a href="./dashboard.html">
                    <span class="icon"><i class="bi bi-house-door"></i></span>
                    <span class="txt-link">Home</span>
                </a>    
            </li>
            <li class="item-menu" id="register">
                <a href="#">
                    <span class="icon"><i class="bi bi-person-add"></i></span>
                    <span class="txt-link">Cadastrar</span>
                </a>
                <ul class="submenu">
                    <li><a href="./cadastro.php">Usuário</a></li><br>
                    <li><a href="./cadastro_storage.php">Storage</a></li>
                </ul>
            </li>
            <li class="item-menu">
                <a href="./consulta.html">
                    <span class="icon"><i class="bi bi-person"></i></span>
                    <span class="txt-link">Consultar Usuário</span>
                </a>
            </li>
            <li class="item-menu">
                <a href="./alterar.html">
                    <span class="icon"><i class="bi bi-person-gear"></i></span>
                    <span class="txt-link">Alterar Usuário</span>
                </a>
            </li>
        </ul>

        <ul id="baixo">
            <hr>
            <li class="item-footer1">
                <a href="./profile.html">
                    <img id="func_perfil" src="" alt="">
                    <span class="txt-link">Perfil</span>
                </a>
            </li>
            <li class="item-footer2">
                <a id='out'>
                    <span class="icon"><i class="bi bi-box-arrow-right" id="logout"></i></span>
                    <span class="txt-link-l">Sair</span>
                </a>
            </li>
        </ul>

    </nav>

    <div class="main-content">
        <!-- Cadastro de Novo Cliente -->
        <div class="client-registration">
            <p class="title">Cadastrar Novo Usuário</p>
            <form id="registration-form" method="post" action="./php/cadastrar_usuario.php">
                 
                <label>
                    <span>Nome</span><br>
                    <input type="text" id="name" name="name" required>
                </label>
                    
                <label>
                    <span>Email</span><br>
                    <input type="email" id="email" name="email" required>
                </label>
                    
                <label>
                    <span>Senha</span><br>
                    <div class="input-container">
                        <input type="password" id="password" name="password" autocomplete="new-password" maxLength='8' required>
                        <i class="bi bi-eye-fill" id="toggle-password-1" style="cursor: pointer;" onclick="togglePasswordVisibility('toggle-password-1', 'password')"></i>
                        <fontsize>*Obrigatório 8 caracteres</fontsize>
                    </div>
                </label>
                <label>
                    <span>Confirme a Senha</span><br>
                    <div class="input-container">
                        <input type="password" id="confirm-password" name="confirm-password" autocomplete="new-password" maxLength='8' required>
                        <i class="bi bi-eye-fill" id="toggle-password-2" style="cursor: pointer;" onclick="togglePasswordVisibility('toggle-password-2', 'confirm-password')"></i>
                        <fontsize>*Obrigatório 8 caracteres</fontsize>
                    </div>
                </label>                
                    
                <span>Plano</span>
                <div id="plan">
                    <input class='select' type="radio" id="basico" name="plano" value="basico" required>
                    <label for="basico">Básico</label>
                </div>
                <div id="plan">
                    <input class='select' type="radio" id="logistico" name="plano" value="logistico" required>
                    <label for="logistico">Logístico</label>
                </div>
                <div id="plan">
                    <input class='select' type="radio" id="premium" name="plano" value="premium" required>
                    <label for="premium">Premium</label>
                </div>

                <label>
                    <span>Tipo de Usuário</span><br>
                    <select id="tipo" name="tipo" required>
                        <option value="administrador">Administrador</option>
                        <option value="estoquista">Estoquista</option>
                    </select>
                </label>

                <label>
                    <span>Empresa</span><br>
                    <input type="text" id="empresa" name="empresa" required>
                </label>

                <button id='cadastro' type="submit">Cadastrar</button>
            </form>

            <div id="registration-message" class="<?php echo $messageType; ?>">
                <?php echo $message; ?>
            </div>  

        </div>
    </div>

    <script src="./src/js/cadastro.js"></script>

</body>
</html>
