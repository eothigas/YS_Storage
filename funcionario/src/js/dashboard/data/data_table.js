function populateTable(tableId, tableData, columns) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = ''; // Limpa o conteúdo da tabela

    tableData.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            
            // Verifica se o campo é 'foto' e insere a tag <img>
            if (column === 'imagem') {
                const img = document.createElement('img');
                img.src = row[column];
                img.alt = ' ';
                img.style.width = '70px';  // Ajusta o tamanho da imagem
                img.style.height = '50px';
                td.appendChild(img);
            } else {
                td.textContent = row[column] ?? '-'; // Usa o valor do campo ou vazio

                // Aplica estilo condicional para "Ativo" e "Suspenso"
                if (td.textContent === 'Ativo') {
                    td.style.color = 'green';
                    td.style.fontWeight = 'bold';
                } else if (td.textContent === 'Suspenso') {
                    td.style.color = 'red';
                    td.style.fontWeight = 'bold';
                }
            }
            
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

async function fetchAndDisplayData() {
    try {
        const response = await fetch('../funcionario/php/dashboard/data/data_table.php');
        const tableData = await response.json();

        if (tableData.error) {
            console.error('Erro ao buscar os dados:', tableData.error);
        } else {
            populateTable('dash-table-empresas', tableData.empresa, ['razao', 'plano', 'clientes', 'storages', 'status']);
            populateTable('dash-table-clientes', tableData.clientes, ['nome', 'email', 'empresa', 'tipo', 'status']);
            populateTable('dash-table-storages', tableData.storage, ['nome', 'endereco', 'empresa', 'imagem', 'status']);
        }
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayData);