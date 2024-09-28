// Função expandir menu
var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');
var logoR = document.querySelector('.logo-r'); // Seleciona o logo

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir'); // Alterna a classe expandir

    // Verifica se a classe expandir está presente e oculta ou mostra o logo
    if (menuSide.classList.contains('expandir')) {
        logoR.style.display = 'none'; // Oculta o logo quando expandido
    } else {
        logoR.style.display = 'grid'; // Mostra o logo quando contraído
    }
});

// Função para carregar os dados do dashboard
async function loadDashboardData() {
    try {
        const response = await fetch('get_profile.php');
        const profileData = await response.json();
        console.log('Dados do perfil:', profileData);

        
        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        // Preenche o segundo elemento de imagem
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; // Aqui você pode usar a mesma imagem ou uma diferente
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`; // Caso deseje manter a mesma informação, ou pode ser diferente
        
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
        fetch(`consulta_usuarios.php?page=${page}&query=${query}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#total-usuarios tbody');
                tbody.innerHTML = ''; // Limpar conteúdo anterior

                // Verifica se há usuários retornados
                if (data.usuarios.length > 0) {
                    data.usuarios.forEach(usuario => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.plano}</td>
                        `;
                        tbody.appendChild(tr);
                    });

                    // Atualizar a informação da página normalmente
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
            })
            .catch(error => {
                console.error('Erro ao carregar os dados:', error);
            });
    }

    // Carregar os usuários na página inicial
    carregarUsuarios(currentPage);

    // Adicionar evento ao campo de pesquisa
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim(); // Capturar o valor do input
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
});