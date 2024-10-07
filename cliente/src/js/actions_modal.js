// Função para carregar dados da sessão
function carregarDadosDaSessao() {
    fetch('./php/check_session.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao acessar o servidor');
            }
            return response.json();
        })
        .then(data => {
            // Acessa os elementos pelas IDs e define o valor
            if (data.loggedIn) { // Verifica se o usuário está logado
                // Atualiza todos os elementos com a ID 'name'
                const nameElements = document.querySelectorAll('#name');
                nameElements.forEach(element => {
                    element.textContent = data.nome; // Define o nome da sessão
                });

                // Atualiza todos os elementos com a ID 'email'
                const emailElements = document.querySelectorAll('#email');
                emailElements.forEach(element => {
                    element.textContent = data.email; // Define o email da sessão
                });

                // Atualiza todos os elementos com a ID 'user'
                const userElements = document.querySelectorAll('#user');
                userElements.forEach(element => {
                    element.textContent = data.tipo; // Define o email da sessão
                });

                // Atualiza todos os elementos com a ID 'plano'
                const planoElements = document.querySelectorAll('#plano');
                planoElements.forEach(element => {
                    element.textContent = data.plano; // Define o email da sessão
                });

                // Atualiza todos os elementos com a ID 'empresa'
                const empresaElements = document.querySelectorAll('#empresa');
                empresaElements.forEach(element => {
                    element.textContent = data.empresa; // Define o email da sessão
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
    fetch(`./php/buscar_usuarios.php?page=${currentPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao acessar o servidor');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('.table-user tbody');
            tbody.innerHTML = ''; // Limpa o conteúdo existente

            // Adiciona cada usuário à tabela
            data.usuarios.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.tipo}</td>
                    <td>${usuario.email}</td>
                    <td><button id="edt" onclick="abrirModalUsuario('${usuario.email}')" style="padding: 5px 20px; border-radius: 5px;">Editar</button></td>
                `;
                tbody.appendChild(row);
            });

            totalPages = data.totalPages;
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
        .then(data => {
            if (data.error) {
                console.error('Erro:', data.error);
                return;
            }

            // Preenche os campos do modal com os dados do usuário
            document.getElementById('edit-name').value = data.nome;
            document.getElementById('tipo').value = data.tipo;
            document.getElementById('edit-email').value = data.email;
            document.getElementById('edit-password').value = ''; // limpa o campo de senha
            document.getElementById('confirm-password').value = ''; // limpa o campo de confirmação de senha

            // Abre o modal de edição
            document.getElementById('modal-usuarios').style.display = 'grid';
        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
        });
}

// Função para fechar o modal
function closeModalUser() {
    document.getElementById('modal-usuarios').style.display = 'none';
}

// Função para salvar alterações do usuário
function salvarAlteracoesUsuario(event) {
    // Previne o comportamento padrão do botão
    event.preventDefault();

    const nome = document.getElementById('edit-name').value;
    const tipo = document.getElementById('tipo').value;
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    // Verifica se a senha tem até 8 caracteres
    if (password.length > 8) {
        alert('A senha deve ter até 8 caracteres.');
        return;
    }

    // Envia os dados para o servidor
    fetch('./php/update_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'edit-name': nome,
            'tipo': tipo,
            'edit-email': email,
            'edit-password': password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.success);
            closeModalUser(); // Fecha o modal após salvar
            carregarUsuarios(); // Recarrega a lista de usuários
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar usuário:', error);
    });
}

// Adiciona evento ao botão de salvar
document.getElementById('save-changes').addEventListener('click', salvarAlteracoesUsuario);

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
    let currentPage = 1; // Página atual
    const limit = 5; // Limite de storages por página

    // Função para buscar os dados de storages
    function fetchStorages(page) {
        fetch(`./php/get_storages.php?page=${page}`) // Altere para o caminho correto do seu arquivo PHP
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
                document.getElementById('page-info').innerText = `Página ${data.currentPage} de ${data.totalPages}`;
                
                // Atualiza os botões de paginação
                document.getElementById('prev-btn').disabled = data.currentPage === 1;
                document.getElementById('next-btn').disabled = data.currentPage === data.totalPages;
            })
            .catch(error => {
                console.error('Erro ao buscar os dados:', error);
            });
    }

    // Função para mudar a página
    function changePage(delta) {
        currentPage += delta;
        fetchStorages(currentPage);
    }

    // Adiciona eventos aos botões de paginação
    document.getElementById('prev-btn').addEventListener('click', function() {
        changePage(-1);
    });

    document.getElementById('next-btn').addEventListener('click', function() {
        changePage(1);
    });

    // Chama a função para buscar os dados assim que a página carrega
    fetchStorages(currentPage);
});

// Chama a função ao carregar a página

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDaSessao();
    carregarUsuarios();
});

