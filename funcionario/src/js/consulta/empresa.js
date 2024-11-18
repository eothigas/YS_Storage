document.addEventListener("DOMContentLoaded", function() {
    let empresas = [];
    let currentPage = 1;
    const rowsPerPage = 5;

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    const searchInput = document.getElementById("search-input");
    const btnCancel = document.querySelector(".btn-cancel");  // Referência para o botão de cancelar

    // Função para buscar dados das empresas
    fetch('../php/consulta/empresa.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                empresas = data.data;
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
        const tbody = document.querySelector('#total-empresas tbody');
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

                const logoCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = empresa.logo;
                img.alt = '';
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.borderRadius = '50%';
                logoCell.appendChild(img);
                row.appendChild(logoCell);

                const razaoCell = document.createElement('td');
                razaoCell.textContent = empresa.razao;
                row.appendChild(razaoCell);

                const identidadeCell = document.createElement('td');
                identidadeCell.textContent = empresa.identidade;
                row.appendChild(identidadeCell);

                const enderecoCell = document.createElement('td');
                enderecoCell.textContent = empresa.endereco;
                row.appendChild(enderecoCell);

                const planoCell = document.createElement('td');
                planoCell.textContent = empresa.plano || '';
                row.appendChild(planoCell);

                const contatoCell = document.createElement('td');
                contatoCell.textContent = empresa.contato;
                row.appendChild(contatoCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = empresa.email;
                row.appendChild(emailCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = empresa.status;
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
                editButton.onclick = () => abrirModalEdicao(empresa.id);
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
        const tbody = document.querySelector('#total-empresas tbody');
        tbody.innerHTML = '';
        const noResultRow = document.createElement('tr');
        const noResultCell = document.createElement('td');
        noResultCell.setAttribute('colspan', '9');  // Ajustado para incluir a coluna do plano
        noResultCell.textContent = 'Nenhuma empresa encontrada';
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
        return empresas.filter(empresa => 
            empresa.razao.toLowerCase().includes(searchValue) ||
            empresa.identidade.toLowerCase().includes(searchValue) ||
            empresa.endereco.toLowerCase().includes(searchValue) ||
            empresa.contato.toLowerCase().includes(searchValue) ||
            empresa.email.toLowerCase().includes(searchValue) ||
            empresa.status.toLowerCase().includes(searchValue) ||
            (empresa.plano && empresa.plano.toLowerCase().includes(searchValue))
        );
    }

    // Função para abrir o modal de edição e preencher com os dados da empresa selecionada
    function abrirModalEdicao(id) {
        fetch(`../php/get/empresa.php?id=${id}`)
            .then(response => response.json())
            .then(empresa => {
                if (empresa.error) {
                    alert(empresa.error);
                } else {
                    document.getElementById('register-table').style.display = 'flex';
                    document.querySelector('main').style.display = 'none';
                    document.querySelector('#navbar').style.display = 'none';

                    document.getElementById('empresa-id').value = empresa.id;
                    document.querySelector('.razao').value = empresa.razao;
                    document.querySelector('.identidade').value = empresa.identidade;
                    document.querySelector('#endereco-input').value = empresa.endereco;
                    document.querySelector('.contato').value = empresa.contato;
                    document.querySelector('.status-select').value = empresa.status;
                    document.querySelector('#email-input').value = empresa.email;
                    document.querySelector('.plano-select').value = empresa.plano || '';
                }
            })
            .catch(error => console.error('Erro ao carregar os dados da empresa:', error));
    }

    // Função para exibir o modal de confirmação
    function excluirEmpresa(id) {
    // Exibir o modal de confirmação
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.style.display = 'flex';

    // Evento para cancelar a exclusão
    document.getElementById('cancel-delete').onclick = () => {
        confirmModal.style.display = 'none';
    };

    // Evento para confirmar a exclusão
    document.getElementById('confirm-delete').onclick = () => {
        // Chamar a função de exclusão no PHP (via AJAX ou Fetch)
        excluirEmpresaDoBanco(id);
        confirmModal.style.display = 'none'; // Fechar o modal após confirmar
    };
    }

    // Função para excluir o funcionário do banco
    function excluirEmpresaDoBanco(id) {
        fetch('../php/deletar/empresa.php', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
            location.reload();;
            // Atualizar a lista ou remover o item da interface
            } else {
            alert('Erro ao excluir a empresa!');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao tentar excluir a empresa!');
        });
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
