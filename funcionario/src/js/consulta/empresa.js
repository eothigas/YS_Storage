document.addEventListener("DOMContentLoaded", function() {
    let empresas = [];
    let currentPage = 1;
    const rowsPerPage = 5;

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    const searchInput = document.getElementById("search-input");

    // Função para buscar dados das empresas
    fetch('../php/consulta/empresa.php') // Altere para o caminho correto do seu script PHP
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                empresas = data.data;
                displayTable();
                updatePaginationInfo();
            } else {
                console.error('Erro ao carregar dados:', data.message);
                displayNoResultsMessage(); // Exibe mensagem caso não haja dados no PHP
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
            pageData.forEach(empresa => {
                const row = document.createElement('tr');

                const fotoCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = empresa.logo; // Usando logo da empresa
                img.alt = 'Logo da Empresa';
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.borderRadius = '50%';
                fotoCell.appendChild(img);
                row.appendChild(fotoCell);

                const nomeCell = document.createElement('td');
                nomeCell.textContent = empresa.razao; // Razão social da empresa
                row.appendChild(nomeCell);

                const identidadeCell = document.createElement('td');
                identidadeCell.textContent = empresa.identidade;
                row.appendChild(identidadeCell);

                const enderecoCell = document.createElement('td');
                enderecoCell.textContent = empresa.endereco;
                row.appendChild(enderecoCell);

                const planoCell = document.createElement('td');
                planoCell.textContent = empresa.plano;
                row.appendChild(planoCell);

                const contatoCell = document.createElement('td');
                contatoCell.textContent = empresa.contato;
                row.appendChild(contatoCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = empresa.email;
                row.appendChild(emailCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = empresa.status;

                // Adicionar cor condicional ao status
                if (empresa.status === 'Ativo') {
                    statusCell.style.color = 'green';
                    statusCell.style.fontWeight = 'bold';
                } else if (empresa.status === 'Suspenso') {
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
                editButton.onclick = () => editarEmpresa(empresa.id);
                acoesCell.appendChild(editButton);

                // Botão de Excluir
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Excluir';
                deleteButton.onclick = () => excluirEmpresa(empresa.id);
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
        noResultCell.setAttribute('colspan', '9'); // Atualizado para 9 colunas
        noResultCell.textContent = 'Nenhuma empresa encontrada';
        noResultCell.style.textAlign = 'center';
        noResultRow.appendChild(noResultCell);
        tbody.appendChild(noResultRow);
    }

    // Função para atualizar a info de paginação e estado dos botões
    function updatePaginationInfo() {
        const filteredData = getFilteredData();
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);

        // Se não houver dados, configure a paginação para "Página 1 de 1"
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
        return empresas.filter(empresa => 
            empresa.razao.toLowerCase().includes(searchValue) ||
            empresa.identidade.toLowerCase().includes(searchValue) ||
            empresa.contato.toLowerCase().includes(searchValue) ||
            empresa.email.toLowerCase().includes(searchValue) ||
            empresa.status.toLowerCase().includes(searchValue)
        );
    }

    // Evento de input para o campo de pesquisa
    searchInput.addEventListener("input", () => {
        currentPage = 1; // Reinicia para a primeira página após a pesquisa
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
});
