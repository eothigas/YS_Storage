<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="./src/images/Logo_reduzido.svg" type="image/png">
    <title>Your Storage - Novo Cadastro Storage</title>
    <link rel="stylesheet" href="./src/css/cadastro.css">
    <link rel="stylesheet" href="./src/css/cadastroresponsive.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
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

    <!-- Cadastro de Novo Storage -->
    <div class="modal-content" id="first">
        <p class="register">Cadastrar Novo Storage</p>
        <form id="edit-form" method="post" action="/funcionario/php/cadastrar_storage.php" enctype="multipart/form-data">
            <label>
                <span>Imagem</span><br>
                <img id="imagem-preview" style="max-width: 100%; margin-top: 0px; border-radius: 0; border: none; padding: 5px;" alt="Sua imagem aparecerá aqui!">
                <input type="file" id="imagemp" name="imagem" accept="image/*" required>
            </label>
            
            <label>
                <span>Nome</span><br>
                <input type="text" id="edit-name" name="name" required>
            </label>

            <label>
                <span>Endereço</span><br>
                <input type="text" id="edit-adress" name="adress" required>
            </label>
            
            <div id='tamanho'>
                <label>
                    <span>Altura</span><br>
                    <input type="number" id="edit-alt" name="altura" required>
                </label>

                <label>
                    <span>Largura</span><br>
                    <input type="number" id="edit-lar" name="largura" required>
                </label>
                
                <label>
                    <span>Comprimento</span><br>
                    <input type="number" id="edit-comp" name="comprimento" required>
                </label>

                <fontsize>Medidas em Metros*</fontsize>
            </div>

            <label>
                <span>Empresa</span><br>
                <input type="text" id="edit-work" name="work" required>
            </label>

            <div id="btn">
                <button type="submit" id='save-changes'>Cadastrar</button>
            </div>
        </form>
    </div>

    <div id="message-container"></div>

    <script src="./src/js/cadastro_storage.js"></script>

</body>
</html>
