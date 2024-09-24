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