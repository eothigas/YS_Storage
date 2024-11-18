document.addEventListener("DOMContentLoaded", function() {
    let clientes = [];
    let currentPage = 1;
    const rowsPerPage = 5;

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    const searchInput = document.getElementById("search-input");
    const btnCancel = document.querySelector(".btn-cancel");

    // Função para buscar dados dos clientes
    fetch('../php/consulta/cliente.php') // Altere para o caminho correto do seu script PHP
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                clientes = data.data;
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
        const tbody = document.querySelector('#total-clientes tbody');
        tbody.innerHTML = '';

        const filteredData = getFilteredData();
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = filteredData.slice(start, end);

        if (pageData.length === 0) {
            displayNoResultsMessage();
        } else {
            pageData.forEach(cliente => {
                const row = document.createElement('tr');

                const nomeCell = document.createElement('td');
                nomeCell.textContent = cliente.nome; // Nome do cliente
                row.appendChild(nomeCell);

                const identidadeCell = document.createElement('td');
                identidadeCell.textContent = cliente.identidade;
                row.appendChild(identidadeCell);

                const contatoCell = document.createElement('td');
                contatoCell.textContent = cliente.contato;
                row.appendChild(contatoCell);

                const empresaCell = document.createElement('td');
                empresaCell.textContent = cliente.empresa; // Empresa do cliente
                row.appendChild(empresaCell);

                const tipoCell = document.createElement('td');
                tipoCell.textContent = cliente.tipo; // Tipo do cliente
                row.appendChild(tipoCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = cliente.email;
                row.appendChild(emailCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = cliente.status;

                // Adicionar cor condicional ao status
                if (cliente.status === 'Ativo') {
                    statusCell.style.color = 'green';
                    statusCell.style.fontWeight = 'bold';
                } else if (cliente.status === 'Suspenso') {
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
                editButton.onclick = () => abrirModalEdicao(cliente.id);
                acoesCell.appendChild(editButton);

                // Botão de Excluir
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Excluir';
                deleteButton.onclick = () => excluirCliente(cliente.id);
                acoesCell.appendChild(deleteButton);

                row.appendChild(acoesCell);

                tbody.appendChild(row);
            });
        }
    }

    // Função para exibir uma mensagem quando não houver resultados
    function displayNoResultsMessage() {
        const tbody = document.querySelector('#total-clientes tbody');
        tbody.innerHTML = '';
        const noResultRow = document.createElement('tr');
        const noResultCell = document.createElement('td');
        noResultCell.setAttribute('colspan', '8'); // Ajustado para 8 colunas
        noResultCell.textContent = 'Nenhum cliente encontrado';
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
        return clientes.filter(cliente => 
            cliente.nome.toLowerCase().includes(searchValue) ||
            cliente.identidade.toLowerCase().includes(searchValue) ||
            cliente.contato.toLowerCase().includes(searchValue) ||
            cliente.empresa.toLowerCase().includes(searchValue) ||
            cliente.tipo.toLowerCase().includes(searchValue) ||
            cliente.email.toLowerCase().includes(searchValue) ||
            cliente.status.toLowerCase().includes(searchValue)
        );
    }

    // Função para abrir o modal de edição e preencher com os dados do cliente selecionado
    function abrirModalEdicao(id) {
        // Buscar os dados do cliente e as empresas
        Promise.all([
            fetch(`../php/get/cliente.php?id=${id}`), // Requisição para obter os dados do cliente
            fetch('../php/get_empresas_cliente.php') // Requisição para obter as empresas
        ])
        .then(responses => Promise.all(responses.map(response => response.json()))) // Aguardar as duas respostas
        .then(([clientes, empresas]) => {

            if (clientes.error) {
                alert(clientes.error);
            } else {
                // Preencher os dados do cliente no modal
                document.getElementById('register-table').style.display = 'flex';
                document.querySelector('main').style.display = 'none';
                document.querySelector('#navbar').style.display = 'none';

                document.getElementById('cliente-id').value = clientes.id;
                document.querySelector('.nome').value = clientes.nome;
                document.querySelector('.identidade').value = clientes.identidade;
                document.querySelector('.contato').value = clientes.contato;
                document.querySelector('.tipo-select').value = clientes.tipo;
                document.querySelector('#editEmail').value = clientes.email;
                document.querySelector('.status-select').value = clientes.status || '';

                // Preencher o campo de empresas no modal
                const empresaSelect = document.querySelector('.empresa-edit');
                empresaSelect.innerHTML = `<option value="${clientes.empresa}">${clientes.empresa}</option>`; // Adicionando a empresa do cliente

                // Adicionar as outras empresas à lista de opções (sem a razão já atribuída ao cliente)
                if (empresas.status === 'success' && Array.isArray(empresas.data)) {
                    empresas.data.forEach(empresa => {
                        if (empresa.razao !== clientes.empresa) { // Impedir que a empresa já atribuída seja inserida novamente
                            const option = document.createElement('option');
                            option.value = empresa.razao;
                            option.textContent = empresa.razao;

                            empresaSelect.appendChild(option);
                        }
                    });
                } else {
                    console.error('Erro: retorno de empresas não é válido');
                }
            }
        })
        .catch(error => console.error('Erro ao carregar os dados do cliente ou empresas:', error));
    }

    // Função para exibir o modal de confirmação
    function excluirCliente(id) {
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
        excluirClienteDoBanco(id);
        confirmModal.style.display = 'none'; // Fechar o modal após confirmar
    };
    }

    // Função para excluir o funcionário do banco
    function excluirClienteDoBanco(id) {
        fetch('../php/deletar/cliente.php', {
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
            alert('Erro ao excluir o cliente!');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao tentar excluir o cliente!');
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
