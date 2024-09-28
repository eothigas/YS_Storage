// Função expandir menu e rotacionar botão
var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');
var logoR = document.querySelector('.logo-r'); // Seleciona o logo

btnExp.addEventListener('click', function() {
    // Alterna a expansão do menu
    menuSide.classList.toggle('expandir');

    // Alterna a rotação do botão
    this.classList.toggle('rotacionado'); 

    // Verifica se a classe expandir está presente e oculta ou mostra o logo
    if (menuSide.classList.contains('expandir')) {
        logoR.style.display = 'none'; // Oculta o logo quando expandido
    } else {
        logoR.style.display = 'grid'; // Mostra o logo quando contraído
    }
});

// Função para carregar os dados na home
async function loadDashboardData() {
    try {
        const response = await fetch('/funcionario/php/get_profile.php'); // Inserção do retorno JSON
        const profileData = await response.json();

        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        // Preenche o elemento de imagem (perfil no menu lateral)
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; 
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`; 
        
    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

// Função para carregar os usuários com ou sem pesquisa
let currentPage = 1;

function carregarUsuarios(page, query = '') {
    fetch(`/funcionario/php/consulta_usuarios.php?page=${page}&query=${query}`) // Pesquisa na tabela usuarios
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#total-usuarios tbody');
            tbody.innerHTML = ''; // Limpa o conteúdo anterior

            // Verifica se há usuários retornados
            if (query === '') {
                // Se a pesquisa estiver vazia, exibe a mensagem inicial
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4">Clique em pesquisar usuário, para alterar o cadastro.</td>';
                tbody.appendChild(tr);

                // Exibir 1 de 1 na paginação
                document.getElementById('page-info').textContent = `Página 1 de 1`;

                // Desabilita os botões (páginas)
                document.getElementById('prev-btn').disabled = true;
                document.getElementById('next-btn').disabled = true;

              // Se a pesquisa for preenchida, traz os dados relacionado ao que for digitado (automaticamente)  (máximo de 10 usuários por página) 
            } else if (data.usuarios && data.usuarios.length > 0) {
                data.usuarios.forEach(usuario => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><button class='edit-btn' onclick="editarUsuario('${usuario.nome}', '${usuario.email}', '${usuario.plano}')"><i class="bi bi-pencil-fill"></i></button></td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.plano}</td>
                    `;
                    tbody.appendChild(tr);
                });

                // Atualiza a informação da página normalmente (conforme o número de usuários que retornar)
                document.getElementById('page-info').textContent = `Página ${data.current_page} de ${data.total_pages}`;
                
                // Desabilita os botões conforme necessário
                document.getElementById('prev-btn').disabled = (data.current_page === 1); // Desabilita o botão "anterior", quando estiver na página 1
                document.getElementById('next-btn').disabled = (data.current_page === data.total_pages); // Desabilita o botão "próxima" quando estiver na última página
            } else {
                // Mostra a mensagem de "Nenhum usuário encontrado"
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4">Nenhum usuário encontrado.</td>'; // Atualiza a linha 
                tbody.appendChild(tr);

                // Exibir 1 de 1 na paginação
                document.getElementById('page-info').textContent = `Página 1 de 1`;

                // Desabilitar os botões
                document.getElementById('prev-btn').disabled = true;
                document.getElementById('next-btn').disabled = true;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });
}

// Carregar usuários na página inicial
carregarUsuarios(currentPage);

// Adicionar evento ao campo de pesquisa
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim(); // Captura do valor do input
    currentPage = 1; // Reiniciar para a primeira página ao pesquisar
    carregarUsuarios(currentPage, query); // Chamar a função de carregamento com a query
});

// Eventos de navegação entre páginas
document.getElementById('prev-btn').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        carregarUsuarios(currentPage, searchInput.value.trim());
    }
});

document.getElementById('next-btn').addEventListener('click', function () {
    currentPage++;
    carregarUsuarios(currentPage, searchInput.value.trim());
});

// Função para editar usuário
window.editarUsuario = function(nome, email, plano) {
    // Preencher os campos do modal com os dados do usuário
    document.getElementById('edit-name').value = nome;
    document.getElementById('edit-email').value = email;
    document.querySelector(`input[name="plan"][value="${plano}"]`).checked = true; // Marcar o plano correto
    
    // Mostrar o modal
    document.getElementById('edit-modal').style.display = 'grid'; // Exibir o modal
    document.getElementById('first').classList.add('open');
};

// Função para fechar o modal
window.closeModal = function() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none'; // Ocultar o modal
    
    // Recarregar a página após fechar o modal
    window.location.reload();
};

document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar o envio padrão do formulário

    // Identificar qual botão foi clicado
    const clickedButton = event.submitter.id;

    if (clickedButton === 'save-changes') {
        // Coletar os dados do formulário
        const nome = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        const plano = document.querySelector('input[name="plan"]:checked').value;

        // Enviar os dados para o servidor
        fetch('/funcionario/php/alterar_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                name: nome,
                email: email,
                plan: plano
            })
        })
        .then(response => response.json())
        .then(data => {
            const messageContainer = document.getElementById('message-container');
            const messageElement = document.getElementById('message');

            // Verificação no caso do retorno incluir um redirecionamento (aviso)
            if (data.redirect) {
                messageContainer.classList.add('warning'); // Adiciona a classe para amarelo
                messageContainer.innerHTML = 'Usuário não existe. Redirecionando para cadastro.';
                messageContainer.classList.remove('success', 'error'); // Remove outras classes
                messageContainer.style.display = 'block'; // Mostra o container

                // Armazena os valores no session storage
                sessionStorage.setItem('name', data.name);
                sessionStorage.setItem('email', data.email);
                sessionStorage.setItem('plan', data.plan);

                // Redirecionar após 5 segundos
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 5000);
            }

            // Mostrar mensagem de sucesso
            if (data.success) {
                messageElement.textContent = data.success; 
                messageContainer.classList.add('success'); 
                messageContainer.classList.remove('error'); 
                messageContainer.style.display = 'block';

                // Recarga da página após a exibição da mensagem de sucesso
                setTimeout(() => {
                    location.reload();
                }, 5100);
            } else {
                // Mostrar mensagem de erro
                messageElement.textContent = data.error; 
                messageContainer.classList.add('error');  
                messageContainer.classList.remove('success'); 
                messageContainer.style.display = 'block'; 
            }
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            console.error('Erro ao atualizar os dados:', error);
        });

    } else if (clickedButton === 'delete-user') {  // Delete de usuário 
        // Mostra o modal de confirmação
        document.getElementById('confirmation-modal').style.display = 'block';

        // Configura os eventos para os botões de confirmação
        document.getElementById('confirm-delete').onclick = function() {
            const email = document.getElementById('edit-email').value;

        // Envia os dados para deletar o usuário
        fetch('/funcionario/php/deletar_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            const messageContainer = document.getElementById('message-container');
            const messageElement = document.getElementById('message');

            // Mostrar mensagem de sucesso ou erro ao deletar
            if (data.success) {
                messageElement.textContent = data.success;
                messageContainer.classList.add('success');
                messageContainer.classList.remove('error');
            } else {
                messageElement.textContent = data.error;
                messageContainer.classList.add('error');
                messageContainer.classList.remove('success');
            }
            // Tempo de exibição da mensagem de sucesso ou erro
            messageContainer.style.display = 'block';
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);    

            // Tempo para fechar o modal automaticamente
            document.getElementById('confirmation-modal').style.display = 'none';

            setTimeout(() => {
                    location.reload();
                }, 5100)
        })
        .catch(error => {
            console.error('Erro ao deletar o usuário:', error);
        });
    };
        // Caso clique em "Não, retornar."
        document.getElementById('cancel-delete').onclick = function() {
                document.getElementById('confirmation-modal').style.display = 'none'; // Fechar o modal
                console.log('Ação de deletar cancelada pelo usuário.');
        };
    }
});

// Carregar dados do dashboard após o DOM ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});
