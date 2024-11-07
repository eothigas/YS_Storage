document.addEventListener("DOMContentLoaded", function() {
    let funcionarios = [];
    let currentPage = 1;
    const rowsPerPage = 5;

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    const searchInput = document.getElementById("search-input");
    const btnCancel = document.querySelector(".btn-cancel");  // Referência para o botão de cancelar

    // Função para buscar dados dos funcionários
    fetch('../php/consulta/funcionario.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                funcionarios = data.data;
                displayTable();
                updatePaginationInfo();
            } else {
                console.error('Erro ao carregar dados:', data.message);
                displayNoResultsMessage();
            }
        })
        .catch(error => console.error('Erro na requisição:', error));

    // Função para atualizar a tabela com os dados da página atual
    function displayTable() {
        const tbody = document.querySelector('#total-usuarios tbody');
        tbody.innerHTML = '';

        const filteredData = getFilteredData();
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = filteredData.slice(start, end);

        if (pageData.length === 0) {
            displayNoResultsMessage();
        } else {
            pageData.forEach(funcionario => {
                const row = document.createElement('tr');

                const fotoCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = funcionario.imagem || 'default.jpg';
                img.alt = 'Foto do Funcionário';
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.borderRadius = '50%';
                fotoCell.appendChild(img);
                row.appendChild(fotoCell);

                const nomeCell = document.createElement('td');
                nomeCell.textContent = funcionario.nome;
                row.appendChild(nomeCell);

                const identidadeCell = document.createElement('td');
                identidadeCell.textContent = funcionario.identidade;
                row.appendChild(identidadeCell);

                const contatoCell = document.createElement('td');
                contatoCell.textContent = funcionario.contato;
                row.appendChild(contatoCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = funcionario.email;
                row.appendChild(emailCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = funcionario.status;
                if (funcionario.status === 'Ativo') {
                    statusCell.style.color = 'green';
                    statusCell.style.fontWeight = 'bold';
                } else if (funcionario.status === 'Suspenso') {
                    statusCell.style.color = 'red';
                    statusCell.style.fontWeight = 'bold';
                }
                row.appendChild(statusCell);

                const acoesCell = document.createElement('td');
                acoesCell.classList.add('acoes-cell');

                // Botão de Editar
                const editButton = document.createElement('button');
                editButton.classList.add('btn', 'btn-primary', 'btn-sm');
                editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
                editButton.onclick = () => abrirModalEdicao(funcionario.id);
                acoesCell.appendChild(editButton);

                // Botão de Excluir
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Excluir';
                deleteButton.onclick = () => excluirFuncionario(funcionario.id);
                acoesCell.appendChild(deleteButton);

                row.appendChild(acoesCell);
                tbody.appendChild(row);
            });
        }
    }

    // Função para exibir uma mensagem quando não houver resultados
    function displayNoResultsMessage() {
        const tbody = document.querySelector('#total-usuarios tbody');
        tbody.innerHTML = '';
        const noResultRow = document.createElement('tr');
        const noResultCell = document.createElement('td');
        noResultCell.setAttribute('colspan', '7');
        noResultCell.textContent = 'Nenhum funcionário encontrado';
        noResultCell.style.textAlign = 'center';
        noResultRow.appendChild(noResultCell);
        tbody.appendChild(noResultRow);
    }

    // Função para atualizar a info de paginação e estado dos botões
    function updatePaginationInfo() {
        const filteredData = getFilteredData();
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        
        if (filteredData.length === 0) {
            pageInfo.textContent = "Página 1 de 1";
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        } else {
            pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
        }
    }

    // Função para buscar dados filtrados
    function getFilteredData() {
        const searchValue = searchInput.value.toLowerCase();
        return funcionarios.filter(funcionario => 
            funcionario.nome.toLowerCase().includes(searchValue) ||
            funcionario.identidade.toLowerCase().includes(searchValue) ||
            funcionario.contato.toLowerCase().includes(searchValue) ||
            funcionario.email.toLowerCase().includes(searchValue) ||
            funcionario.status.toLowerCase().includes(searchValue)
        );
    }

    // Função para abrir o modal de edição e preencher com os dados do funcionário selecionado
    function abrirModalEdicao(id) {
        fetch(`../php/get/funcionario.php?id=${id}`)
            .then(response => response.json())
            .then(funcionario => {
                if (funcionario.error) {
                    alert(funcionario.error);
                } else {
                    document.getElementById('register-table').style.display = 'flex';
                    document.querySelector('main').style.display = 'none';
                    document.querySelector('#navbar').style.display = 'none';

                    document.querySelector('.nome').value = funcionario.nome;
                    document.querySelector('.identidade').value = funcionario.identidade;
                    document.querySelector('.contato').value = funcionario.contato;
                    document.querySelector('.status-select').value = funcionario.status;
                    document.querySelector('.email').value = funcionario.email;

                    const imagePreview = document.getElementById('image-preview');
                    if (funcionario.foto) {
                        imagePreview.src = funcionario.foto;
                        imagePreview.style.display = 'block';
                        document.getElementById('file-info-text').style.display = 'none';
                    } else {
                        imagePreview.style.display = 'none';
                        document.getElementById('file-info-text').style.display = 'block';
                    }
                }
            })
            .catch(error => console.error('Erro ao carregar os dados do funcionário:', error));
    }

    // Evento de input para o campo de pesquisa
    searchInput.addEventListener("input", () => {
        currentPage = 1;
        displayTable();
        updatePaginationInfo();
    });

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
            updatePaginationInfo();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
            updatePaginationInfo();
        }
    });

    // Evento para o botão de cancelamento (recarregar a página)
    btnCancel.addEventListener("click", () => {
        location.reload();
    });
});
