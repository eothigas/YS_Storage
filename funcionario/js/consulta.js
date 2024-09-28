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
        const response = await fetch('/funcionario/php/get_profile.php');
        const profileData = await response.json();

        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        // Preenche o elemento de imagem (perfil menu lateral)
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem;
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`;
        
    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

// Função para carregar os usuários com ou sem pesquisa
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;

    function carregarUsuarios(page, query = '') {
        fetch(`/funcionario/php/consulta_usuarios.php?page=${page}&query=${query}`)  // Query na tabela de usuarios
            .then(response => {
                // Verifica se a resposta não é 200 (network error)
                if (!response.ok) {
                    throw new Error('Erro na rede: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const tbody = document.querySelector('#total-usuarios tbody');
                tbody.innerHTML = ''; // Limpar conteúdo anterior

                // Processar e exibir os dados dos usuários
                if (data.usuarios && data.usuarios.length > 0) {
                    data.usuarios.forEach(usuario => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.plano}</td>
                        `;
                        tbody.appendChild(tr);
                    });

                    // Atualizar a informação da página normalmente (páginação)
                    document.getElementById('page-info').textContent = `Página ${data.current_page} de ${data.total_pages}`;
                    
                    // Desabilitar os botões conforme necessário
                    document.getElementById('prev-btn').disabled = (data.current_page === 1);
                    document.getElementById('next-btn').disabled = (data.current_page === data.total_pages);
                } else {
                    // Mostrar mensagem de "Nenhum usuário encontrado"
                    const tr = document.createElement('tr');
                    tr.innerHTML = '<td colspan="3">Nenhum usuário encontrado.</td>';
                    tbody.appendChild(tr);

                    // Exibir 0 de 0 na paginação
                    document.getElementById('page-info').textContent = `Página 1 de 1`;

                    // Desabilitar os botões
                    document.getElementById('prev-btn').disabled = true;
                    document.getElementById('next-btn').disabled = true;
                }
            });
    }

    // Carregar os usuários na página inicial
    carregarUsuarios(currentPage);

    // Adicionar evento ao campo de pesquisa
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim(); // Captura do valor do input
        currentPage = 1; // Reinicia para a primeira página ao pesquisar
        carregarUsuarios(currentPage, query); // Chama a função de carregamento com a query
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
});