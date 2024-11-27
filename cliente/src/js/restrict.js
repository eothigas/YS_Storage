// Função para verificar o plano do usuário
function verificarPlano() {
    fetch('./php/check_session.php')
        .then(response => response.json())
        .then(data => {
            const plano = data.plano;
            const empresa = data.empresa;
            aplicarRestricoes(plano, empresa);
        })
        .catch(error => console.error('Erro ao verificar o plano:', error));
}

// Função para verificar a contagem de produtos cadastrados
function verificarProdutosCadastrados() {
    return fetch('./php/consultaprod.php') // Endpoint que retorna os produtos da empresa
        .then(response => response.json())
        .then(produtos => {
            return produtos.length; // Retorna a contagem de produtos
        })
        .catch(error => {
            console.error('Erro ao verificar produtos:', error);
            return 0; // Retorna 0 se houver erro
        });
}

// Função para verificar a contagem de usuários cadastrados
function verificarUsuariosCadastrados() {
    return fetch(`./php/get_usuarios.php`) // Endpoint que retorna a contagem total de usuários
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return 0; // Retorna 0 se houver erro
            }
            return data.totalUsers; // Retorna a contagem total de usuários
        })
        .catch(error => {
            console.error('Erro ao verificar usuários:', error);
            return 0; // Retorna 0 se houver erro
        });
}

// Função para aplicar as restrições com base no plano
function aplicarRestricoes(plano, empresa) {
    let maxUsuarios, maxProdutos;

    switch (plano) {
        case 'Básico':
        maxUsuarios = 5;
        maxProdutos = 250; // Ajustado para o número correto

        // Verifica a contagem de produtos cadastrados
        verificarProdutosCadastrados().then(produtosCadastrados => {
            const messageElement = document.getElementById('mensagem-aviso');
            const registerProd = document.getElementById('form-cadastro-produto');

            const inputProd = registerProd.querySelectorAll('.restrict-input');
            const selectProd = registerProd.querySelectorAll('select');
            const btnProd = registerProd.querySelectorAll('button');

            if (produtosCadastrados >= maxProdutos) {
                messageElement.innerHTML = `Você atingiu o limite de ${maxProdutos} produtos cadastrados.`;
                messageElement.style.display = 'block'; // Torna o elemento visível

                // Desabilita os inputs de produto
                inputProd.forEach(input => {
                    input.readOnly = true;
                    input.style.cursor = 'not-allowed';
                });

                // Desabilita os selects de produto
                selectProd.forEach(select => {
                    select.disabled = true;
                    select.style.cursor = 'not-allowed';
                });

                // Desabilita os botões de produto
                btnProd.forEach(button => {
                    button.disabled = true;
                    button.style.cursor = 'not-allowed';
                });
                
                
            }
        });

        // Verifica a contagem de usuários cadastrados
        verificarUsuariosCadastrados().then(usuariosCadastrados => {
            const messageElement = document.getElementById('mensagem-aviso'); // Certifique-se de que não esteja sobrescrevendo a mensagem anterior
            const registerUser = document.getElementById('client-registration');

            // Seleciona os elementos do form
            const inputs = registerUser.querySelectorAll('input');
            const selects = registerUser.querySelectorAll('select');
            const btns = registerUser.querySelectorAll('button');

            if (usuariosCadastrados >= maxUsuarios) {
                // Exibe mensagem sobre limite de usuários
                messageElement.innerHTML = `Você atingiu o limite de ${maxUsuarios} usuários cadastrados.`;
                messageElement.style.display = 'block'; // Torna o elemento visível

                // Desabilita os inputs de usuário
                inputs.forEach(input => {
                    input.readOnly = true;
                    input.style.cursor = 'not-allowed';
                });

                // Desabilita os selects de usuário
                selects.forEach(select => {
                    select.disabled = true;
                    select.style.cursor = 'not-allowed';
                });

                // Desabilita os botões de usuário
                btns.forEach(button => {
                    button.disabled = true;
                    button.style.cursor = 'not-allowed';
                });
            }
        });

        break;

        case 'Logístico':
            maxUsuarios = 10;
            maxProdutos = 700;

        // Verifica a contagem de produtos cadastrados
        verificarProdutosCadastrados().then(produtosCadastrados => {
            const messageElement = document.getElementById('mensagem-aviso');
            const registerProd = document.getElementById('form-cadastro-produto');

            const inputProd = registerProd.querySelectorAll('input');
            const areaProd = registerProd.querySelectorAll('textarea');
            const selectProd = registerProd.querySelectorAll('select');
            const checkboxes = registerProd.querySelectorAll('input[type="checkbox"]');
            const fileInputs = registerProd.querySelectorAll('input[type="file"]');
            const btnProd = registerProd.querySelectorAll('button');

            if (produtosCadastrados >= maxProdutos) {
                messageElement.innerHTML = messageElement.innerHTML = `Você atingiu o limite de ${maxProdutos} produtos cadastrados.`;
                messageElement.style.display = 'block'; // Torna o elemento visível

                // Desabilita os inputs de produto
                inputProd.forEach(input => {
                    input.readOnly = true;
                    input.style.cursor = 'not-allowed';
                });

                // Desabilita as textareas de produto
                areaProd.forEach(textArea => {
                    textArea.readOnly = true;
                    textArea.style.cursor = 'not-allowed';
                });

                // Desabilita os selects de produto
                selectProd.forEach(select => {
                    select.disabled = true;
                    select.style.cursor = 'not-allowed';
                });

                // Desabilita os checkboxes de produto
                checkboxes.forEach(checkbox => {
                    checkbox.disabled = true; 
                    checkbox.style.cursor = 'not-allowed'; 
                });

                // Desabilita os inputs de file
                fileInputs.forEach(fileInput => {
                    fileInput.disabled = true;
                    fileInput.style.cursor = 'not-allowed'; 
                });

                // Desabilita os botões de produto
                btnProd.forEach(button => {
                    button.disabled = true;
                    button.style.cursor = 'not-allowed';
                });
            }
        });

        // Verifica a contagem de usuários cadastrados
        verificarUsuariosCadastrados().then(usuariosCadastrados => {
            const messageElement = document.getElementById('mensagem-aviso');
            const registerUser = document.getElementById('client-registration');

            // Seleciona os elementos do form
            const inputs = registerUser.querySelectorAll('input');
            const selects = registerUser.querySelectorAll('select');
            const btns = registerUser.querySelectorAll('button');

            if (usuariosCadastrados >= maxUsuarios) {
                // Exibe mensagem sobre limite de usuários
                messageElement.innerHTML = `Você atingiu o limite de ${maxUsuarios} usuários cadastrados.`;
                messageElement.style.display = 'block'; // Torna o elemento visível

                // Desabilita os inputs de usuário
                inputs.forEach(input => {
                    input.readOnly = true;
                    input.style.cursor = 'not-allowed';
                });

                // Desabilita os selects de usuário
                selects.forEach(select => {
                    select.disabled = true;
                    select.style.cursor = 'not-allowed';
                });

                // Desabilita os botões de usuário
                btns.forEach(button => {
                    button.disabled = true;
                    button.style.cursor = 'not-allowed';
                });
            }
        });

        break;

        case 'Premium':
            maxUsuarios = Infinity; // Ilimitado
            maxProdutos = Infinity; // Ilimitado
            break;

        default:
            console.warn('Plano desconhecido:', plano);
            return;
    }
}

// Chame a função para verificar o plano assim que a página carregar
document.addEventListener('DOMContentLoaded', verificarPlano);


// Função para verificar o tipo de usuário
function verificarTipoUsuario() {
    fetch('./php/check_session.php')
        .then(response => response.json())
        .then(data => {
            const usuario = data.tipo; // Obtém o tipo de usuário da sessão
            const empresa = data.empresa; // Obtém a empresa da sessão
            aplicarRestricoesUsuario(usuario, empresa);
        })
        .catch(error => console.error('Erro ao verificar o tipo do usuário:', error));
}

// Função para aplicar as restrições com base no tipo de usuário
function aplicarRestricoesUsuario(usuario, empresa) {
    switch (usuario) { // Use 'usuario' aqui para garantir que está pegando o tipo correto
        case 'Administrador':
            console.log('Acesso total para Administrador.');
            // Aqui você pode habilitar todas as funcionalidades
            break;

        case 'Estoquista':
            console.log('Restrição de acesso para Estoquista.');

            const dadosFr = document.getElementById('dados-one');            
            const dadosTw = document.getElementById('dados-two');
            const dadosTh = document.getElementById('dados-three');

            if (dadosFr) dadosFr.style.display = 'none';
            if (dadosTw) dadosTw.style.display = 'none';
            if (dadosTh) dadosTh.style.display = 'none';

            break;

        default:
            console.warn('Tipo de usuário desconhecido:', usuario);
            return;
    }
}

// Chama a função para verificar o tipo de usuário assim que a página carregar
document.addEventListener('DOMContentLoaded', verificarTipoUsuario);
