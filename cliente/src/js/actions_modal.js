// Função para carregar dados da sessão
function carregarDadosDaSessao() {
    fetch('./php/check_session.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao acessar o servidor');
            }
            return response.json();
        })
        .then(sessao => { // Altere 'data' para 'sessao'
            // Acessa os elementos pelas IDs e define o valor
            if (sessao.loggedIn) { // Verifica se o usuário está logado

                // Atualiza todos os elementos com a ID 'name'
                const idElements = document.querySelectorAll('#id');
                idElements.forEach(element => {
                    element.textContent = id.nome; // Define o nome da sessão
                });

                // Atualiza todos os elementos com a ID 'name'
                const nameElements = document.querySelectorAll('#name');
                nameElements.forEach(element => {
                    element.textContent = sessao.nome; // Define o nome da sessão
                });

                // Atualiza todos os elementos com a ID 'email'
                const emailElements = document.querySelectorAll('#email');
                emailElements.forEach(element => {
                    element.textContent = sessao.email;
                });

                // Atualiza todos os elementos com a ID 'user'
                const userElements = document.querySelectorAll('#user');
                userElements.forEach(element => {
                    element.textContent = sessao.tipo; 
                });

                // Atualiza todos os elementos com a ID 'plano'
                const planoElements = document.querySelectorAll('#plano');
                planoElements.forEach(element => {
                    element.textContent = sessao.plano;
                });

                // Atualiza todos os elementos com a ID 'empresa'
                const empresaElements = document.querySelectorAll('#empresa');
                empresaElements.forEach(element => {
                    element.textContent = sessao.empresa; 
                });
            } else {
                console.error('Usuário não está logado');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

let currentPage = 1; // Página atual
let totalPages = 1; // Total de páginas

// Função para carregar usuários da tabela
function carregarUsuarios() {
    return fetch(`./php/buscar_usuarios.php?page=${currentPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao acessar o servidor');
            }
            return response.json();
        })
        .then(info => { // Altere 'data' para 'info'
            const tbody = document.querySelector('.table-user tbody');
            tbody.innerHTML = ''; // Limpa o conteúdo existente

            // Adiciona cada usuário à tabela
            info.usuarios.forEach(usuario => { // Altere 'data' para 'info'
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="display: none;">${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.tipo}</td>
                    <td>${usuario.email}</td>
                    <td><button id="edt" onclick="abrirModalUsuario('${usuario.email}')" style="padding: 5px 20px; border-radius: 5px;">Editar</button></td>
                `;
                tbody.appendChild(row);
            });

            totalPages = info.totalPages; // Altere 'data' para 'info'
            atualizaPagina();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Função para atualizar a informação da página e habilitar/desabilitar botões
function atualizaPagina() {
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Função para navegar para a página anterior
function paginaAnterior() {
    if (currentPage > 1) {
        currentPage--;
        carregarUsuarios();
    }
}

// Função para navegar para a próxima página
function paginaProxima() {
    if (currentPage < totalPages) {
        currentPage++;
        carregarUsuarios();
    }
}

// Adiciona eventos aos botões de navegação
document.getElementById('prev-btn').addEventListener('click', paginaAnterior);
document.getElementById('next-btn').addEventListener('click', paginaProxima);


// Função para abrir o modal de edição de usuário
function abrirModalUsuario(email) {
    fetch(`./php/edit_users.php?email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(user => { // Aqui você usa 'user'
            if (user.error) {
                console.error('Erro:', user.error);
                return;
            }

            // Preenche os campos do modal com os dados do usuário
            document.getElementById('edit-id').value = user.id; // Alterado para 'user'
            document.getElementById('edit-name').value = user.nome; // Alterado para 'user'
            document.getElementById('tipo').value = user.tipo; // Alterado para 'user'
            document.getElementById('edit-email').value = user.email; // Alterado para 'user'
            document.getElementById('edit-password').value = ''; // Limpa o campo de senha
            document.getElementById('confirm-password').value = ''; // Limpa o campo de confirmação de senha

            // Abre o modal de edição
            document.getElementById('modal-usuarios').style.display = 'grid';

            // Seleciona os campos de senha dentro da div com a classe modal-content-user
            const passwordField = document.querySelector('.modal-content-user #edit-password');
            const passwordConfirmField = document.querySelector('.modal-content-user #confirm-password');
            
            // Redefine os tipos dos campos de senha como 'password'
            if (passwordField) {
                passwordField.type = 'password';
            }
            
            if (passwordConfirmField) {
                passwordConfirmField.type = 'password';
            }

            // Seleciona os ícones de visibilidade
            const passwordIcon = document.querySelector('.modal-content-user #toggle-password-3');
            const confirmIcon = document.querySelector('.modal-content-user #toggle-password-4');

            // Atualiza os ícones para indicar que as senhas estão ocultas
            if (passwordIcon) {
                passwordIcon.classList.remove('bi-eye-fill'); // Remove o ícone de olho preenchido
                passwordIcon.classList.add('bi-eye-slash-fill'); // Adiciona o ícone de olho cortado
            }

            if (confirmIcon) {
                confirmIcon.classList.remove('bi-eye-fill'); // Remove o ícone de olho preenchido
                confirmIcon.classList.add('bi-eye-slash-fill'); // Adiciona o ícone de olho cortado
            }

        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
        });
}

// Função para fechar o modal
function closeModalUser() {
    document.getElementById('modal-usuarios').style.display = 'none';
}

// Função para lidar com o logout
async function handleLogout() {
    await fetch('./php/logout.php', { method: 'POST' }); // Invalida a sessão no servidor
    window.location.href = 'https://www.yourstorage.x10.mx/cliente/login/'; // Redireciona para a página de login
}

// Salvar ou deletar usuários
document.getElementById('edit-users').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar o envio padrão do formulário

    // Identificar qual botão foi clicado
    const clickedButton = event.submitter.id;

    // Função para carregar informações do usuário atual
    function carregarUsuarioAtual() {
        return fetch('./php/check_session.php')
            .then(response => response.json());
    }

    // Função para salvar usuário
    function salvarUsuario() {
        const id = document.getElementById('edit-id').value; // ID do usuário a ser editado
        const nome = document.getElementById('edit-name').value; // Novo nome
        const tipo = document.getElementById('tipo').value; // Novo tipo
        const email = document.getElementById('edit-email').value; // Novo email
        const password = document.getElementById('edit-password').value;

        // Faz uma requisição para obter o ID do usuário na sessão
        fetch('./php/check_session.php')
            .then(response => response.json())
            .then(sessionData => {
                const sessionUserId = sessionData.id; // Supondo que o ID do usuário está na chave 'id'

                // Monta o corpo da requisição
                const bodyData = {
                    'edit-id': id, // ID do usuário que está sendo editado
                    'edit-name': nome,
                    'tipo': tipo,
                    'edit-email': email
                };

                // Se a senha não estiver vazia, adiciona ao corpo da requisição
                if (password) {
                    bodyData['edit-password'] = password;
                }

                // Verifica se não houve alterações
                if (
                    id === sessionUserId && // Comparar se o ID é o mesmo
                    nome === sessionData.nome && // Comparar se o nome é o mesmo
                    tipo === sessionData.tipo && // Comparar se o tipo é o mesmo
                    email === sessionData.email // Comparar se o email é o mesmo
                ) {
                    // Fechar os modais e não fazer nada
                    document.getElementById('confirmation-user').style.display = 'none';
                    document.getElementById('modal-usuarios').style.display = 'none';
                    return; // Sai da função
                }

                // Mostra o modal de confirmação
                const confirmationMessage = document.getElementById('confirmation-message-user');

                // Verifica se o ID do usuário a ser editado é igual ao ID da sessão
                if (id === sessionUserId) {
                    confirmationMessage.innerHTML = "Você está prestes a atualizar o usuário logado. A sessão será encerrada após a atualização. Deseja continuar?";
                } else {
                    confirmationMessage.innerHTML = "Você tem certeza que deseja atualizar este usuário?";
                }

                document.getElementById('confirmation-user').style.display = 'block';

                // Configura os eventos para os botões de confirmação
                document.getElementById('confirm-user').onclick = function() {
                    // Envia os dados para alterar usuário
                    fetch('/cliente/sistema/php/update_user.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(bodyData) // Monta a URL com os parâmetros
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Fechar o modal de confirmação
                        document.getElementById('confirmation-user').style.display = 'none';
                        // Fechar o modal de usuários
                        document.getElementById('modal-usuarios').style.display = 'none';

                        // Se o usuário editado for o logado, execute o logout
                        if (id === sessionUserId) {
                            handleLogout(); // Chama a função de logout
                        } else {
                            // Atualizar a lista de usuários na tabela
                            carregarUsuarios();
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao salvar o usuário:', error);
                        document.getElementById('confirmation-user').style.display = 'none'; // Fecha o modal em caso de erro
                    });
                };

                // Caso clique em "Não, retornar."
                document.getElementById('cancel-user').onclick = function() {
                    document.getElementById('confirmation-user').style.display = 'none'; // Fechar o modal
                };
            });
    }

    // Função para deletar usuário
    function deletarUsuario() {
        const editUserId = document.getElementById('edit-id').value; // ID do usuário a ser deletado
        const email = document.getElementById('edit-email').value; // Email do usuário a ser deletado

        // Faz uma requisição para obter o ID do usuário na sessão
        fetch('./php/check_session.php')
            .then(response => response.json())
            .then(sessionData => {
                const sessionUserId = sessionData.id; // Supondo que o ID do usuário está na chave 'id'

                // Mostra o modal de confirmação
                const confirmationMessage = document.getElementById('confirmation-message');

                // Verifica se o ID do usuário a ser deletado é igual ao ID da sessão
                if (editUserId === sessionUserId) {
                    confirmationMessage.innerHTML = "Você está prestes a excluir o usuário logado. A sessão será encerrada e o usuário excluído. Deseja continuar?";
                } else {
                    confirmationMessage.innerHTML = "Você tem certeza que deseja deletar este usuário?";
                }

                document.getElementById('confirmation-modal').style.display = 'block';

                // Configura os eventos para os botões de confirmação
                document.getElementById('confirm-delete').onclick = function() {
                    // Envia os dados para deletar o usuário
                    fetch('/cliente/sistema/php/deletar_usuario.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            id: editUserId,
                            email: email 
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Fechar o modal de confirmação
                        document.getElementById('confirmation-modal').style.display = 'none';
                        // Fechar o modal de usuários
                        document.getElementById('modal-usuarios').style.display = 'none';

                        // Se o usuário deletado for o logado, execute o logout
                        if (editUserId === sessionUserId) {
                            handleLogout(); // Chama a função de logout
                        } else {
                            // Se não for o usuário logado, apenas atualize a lista de usuários
                            carregarUsuarios();
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao deletar o usuário:', error);
                        document.getElementById('confirmation-modal').style.display = 'none'; // Fecha o modal em caso de erro
                    });
                };

                // Caso clique em "Não, retornar."
                document.getElementById('cancel-delete').onclick = function() {
                    document.getElementById('confirmation-modal').style.display = 'none'; // Fechar o modal
                };
            })
            .catch(error => {
                console.error('Erro ao verificar a sessão:', error);
                // Lógica para lidar com erro na verificação da sessão
            });
    }

    if (clickedButton === 'delete-user') {  // Delete de usuário 
        deletarUsuario(); // Chama a função para deletar o usuário
    } else if (clickedButton === 'save-user') {  // Salvar usuário
        salvarUsuario(); // Chama a função para salvar o usuário
    }
});

// Função para resetar o estado da função registerUser
function resetRegisterUserFunction() {
    const form = document.getElementById('register-users');
    form.reset();

    // Definindo os tipos dos campos de senha como "password"
    const passwordField = document.getElementById('password');
    const passwordConfirmField = document.getElementById('password-confirm');
    
    passwordField.type = 'password';
    passwordConfirmField.type = 'password';

    // Atualiza o ícone para indicar que a senha está oculta
    const passwordIcon = document.getElementById('toggle-password-1');
    const confirmIcon = document.getElementById('toggle-password-2');

    if (passwordIcon) {
        passwordIcon.classList.remove('bi-eye-slash-fill'); // Remove o ícone de olho cortado
        passwordIcon.classList.add('bi-eye-fill'); // Adiciona o ícone de olho preenchido
    }

    if (confirmIcon) {
        confirmIcon.classList.remove('bi-eye-slash-fill'); // Remove o ícone de olho cortado
        confirmIcon.classList.add('bi-eye-fill'); // Adiciona o ícone de olho preenchido
    }
}

// Cadastrar Novo Usuário
document.getElementById('register-users').addEventListener('submit', registerUser);

function registerUser(event) {
    event.preventDefault(); // Evita o envio normal do formulário e o recarregamento da página

    // Coleta os dados do formulário
    const formData = new FormData(document.getElementById('register-users'));

    // Envia a requisição via fetch
    fetch('./php/user-register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        // Exibe a mensagem no div de resposta
        const messageDiv = document.getElementById('message');

        // Limpa as classes de mensagem anterior
        messageDiv.classList.remove('success', 'error');

        if (data.type === 'success') {
            // Limpa o formulário
            document.getElementById('register-users').reset();

            // Atualizar a lista de usuários na tabela
            carregarUsuarios();

            // Reinicia o estado, se houver variáveis a serem redefinidas
            resetRegisterUserFunction();

            // Exibir mensagem
            messageDiv.innerHTML = `${data.message}`;
            messageDiv.classList.add('sucess'); 
            messageDiv.style.display = 'block'; 
        
            // Adiciona um timeout para ocultar a mensagem após 3 segundos
            setTimeout(() => {
             messageDiv.style.display = 'none'; // Oculta a mensagem
            }, 3000); // 3000 milissegundos = 3 segundos
        } else {
            messageDiv.innerHTML = `${data.message}`; // Exibe a mensagem diretamente

            // Adiciona a classe error
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';

            // Adiciona um timeout para ocultar a mensagem após 3 segundos
            setTimeout(() => {
                messageDiv.style.display = 'none'; // Oculta a mensagem
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        document.getElementById('message').innerHTML = 'Ocorreu um erro. Tente novamente mais tarde.';
        
        // Adiciona um timeout para ocultar a mensagem de erro após 3 segundos
        setTimeout(() => {
            document.getElementById('message').style.display = 'none'; // Oculta a mensagem
        }, 3000); // 3000 milissegundos = 3 segundos
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Função para buscar informações do plano
    function carregarPlano() {
        fetch('./php/consultar_plano.php') // Altere para o caminho correto do seu arquivo PHP
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }

                // Preencher a div com as informações do plano
                document.querySelector('.plano').textContent = data.plano; // Nome do plano
                document.getElementById('strt').textContent = data.restricao1; // Restrição 1
                document.getElementById('mid').textContent = data.restricao2; // Restrição 2
                document.getElementById('ult').textContent = data.restricao3; // Restrição 3
            })
            .catch(error => console.error('Erro:', error));
    }

    // Chama a função para carregar o plano ao carregar a página
    carregarPlano();
});

document.getElementById('alt-plan').addEventListener('click', function() {
    // Define a URL que você deseja abrir
    const url = 'https://www.yourstorage.x10.mx/homepage/planos.html';

    // Abre a URL em uma nova guia
    window.open(url, '_blank');
});

document.addEventListener('DOMContentLoaded', function() {
    let cPage = 1; // Página atual
    const limitStorage = 5; // Limite de storages por página

    // Função para buscar os dados de storages
    function fetchStorages(pages) {
        fetch(`./php/get_storages.php?page=${pages}`) // Altere para o caminho correto do seu arquivo PHP
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('.table-storage tbody');
                tbody.innerHTML = ''; // Limpa o corpo da tabela antes de adicionar novos dados

                if (data.error) {
                    console.error(data.error);
                    return;
                }

                // Verifica se há storages e preenche a tabela com os dados
                if (data.storages.length > 0) {
                    data.storages.forEach(storage => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${storage.nome}</td>
                            <td>${storage.endereco}</td>
                            <td>${storage.altura}</td>
                            <td>${storage.largura}</td>
                            <td>${storage.comprimento}</td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    // Caso não haja storages, exibe a mensagem com colspan
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="5" style="text-align: center;">Nenhum Storage Contratado.</td>
                    `;
                    tbody.appendChild(row);
                }

                // Atualiza a informação da página
                document.getElementById('page-inform').innerText = `Página ${data.cPage} de ${data.totalPages}`;

                // Atualiza os botões de paginação
                document.getElementById('previous-btn').disabled = data.cPage === 1;
                document.getElementById('nextpage-btn').disabled = data.storages.length < limitStorage || data.cPage === data.totalPages;
            })
            .catch(error => {
                console.error('Erro ao buscar os dados:', error);
            });
    }

    // Função para mudar a página
    function changePage(delta) {
        cPage += delta;
        fetchStorages(cPage);
    }

    // Adiciona eventos aos botões de paginação
    document.getElementById('previous-btn').addEventListener('click', function() {
        changePage(-1);
    });

    document.getElementById('nextpage-btn').addEventListener('click', function() {
        changePage(1);
    });

    // Chama a função para buscar os dados assim que a página carrega
    fetchStorages(cPage);
});

// Chama a função ao carregar a página

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDaSessao();
    carregarUsuarios();
});

