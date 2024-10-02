document.addEventListener('DOMContentLoaded', function () {
    const produtosContainer = document.querySelector('#tabela-produtos tbody');
    const searchInput = document.getElementById('search-input');
    const paginaAtual = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const modalEditar = document.getElementById('modal-editar-produto');
    const closeModalBtn = document.querySelector('.close');
    const mensagemDiv = document.getElementById('mensagem'); // Div para mensagens

    let pagina = 1;
    let totalPaginas = 1;

    // Função para listar produtos
    function listarProdutos() {
        const searchTerm = searchInput.value;

        // Faz a requisição AJAX
        fetch(`./php/listar_produtos.php?pagina=${pagina}&search=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    produtosContainer.innerHTML = '';

                    if (data.produtos.length > 0) {
                        data.produtos.forEach(produto => {
                            const produtoRow = document.createElement('tr');

                            produtoRow.innerHTML = `
                                <td>${produto.codigo}</td>
                                <td>${produto.nome}</td>
                                <td>${produto.descricao}</td>
                                <td>${produto.quantidade}</td>
                                <td>${produto.tipo}</td>
                                <td><img src="${produto.imagem}" alt="Imagem do Produto" style="max-width: 40px; max-height: 40px;"></td>
                                <td style="display: none;">
                                <input type="checkbox" id="destaque-${produto.codigo}" value="1" ${produto.destaque == 1 ? 'checked' : ''} disabled>
                                </td>
                                <td>
                                    <button onclick="editarProduto('${produto.codigo}', '${produto.nome}', '${produto.descricao}', ${produto.quantidade}, '${produto.tipo}', '${produto.imagem}', ${produto.destaque})">Editar</button>
                                </td>
                            `;

                            produtosContainer.appendChild(produtoRow);
                        });
                    } else {
                        produtosContainer.innerHTML = `<tr><td colspan="7">Nenhum produto cadastrado</td></tr>`;
                    }

                    totalPaginas = data.totalPaginas;
                    paginaAtual.textContent = `Página ${pagina} de ${totalPaginas}`;
                    prevBtn.disabled = (pagina === 1);
                    nextBtn.disabled = (pagina === totalPaginas);
                } else {
                    mostrarMensagem("Você precisa estar logado para acessar esta página.", "error");
                    window.location.href = './login.html';
                }
            })
            .catch(error => console.error('Erro:', error));
    }

    // Função para mudar de página
    function mudarPagina(novaPagina) {
        if (novaPagina > 0 && novaPagina <= totalPaginas) {
            pagina = novaPagina;
            listarProdutos();
        }
    }

    // Variável para o timer do debounce
    let debounceTimer;

    // Adiciona o evento de pesquisa com debounce
    searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer); // Limpa o timer anterior
        debounceTimer = setTimeout(() => {
            pagina = 1; // Reseta a página para 1 ao buscar
            listarProdutos(); // Chama a função para listar produtos
        }, 300); // Aguarda 300ms antes de executar a função
    });

    // Inicializa a listagem de produtos
    listarProdutos();

    // Funções para navegação de páginas
    prevBtn.addEventListener('click', function () {
        mudarPagina(pagina - 1);
    });

    nextBtn.addEventListener('click', function () {
        mudarPagina(pagina + 1);
    });

    // Função global para editar produto
    window.editarProduto = function(codigo, nome, descricao, quantidade, tipo, imagem, destaque) {
        // Preenche os campos do modal com os dados do produto
        document.getElementById('codigo-editar').value = codigo;
        document.getElementById('nome-editar').value = nome;
        document.getElementById('descricao-editar').value = descricao;
        document.getElementById('quantidade-editar').value = quantidade;
        document.getElementById('tipo-editar').value = tipo;

        // Pré-visualização da imagem
        const imagemPreview = document.getElementById('imagem-preview');
        imagemPreview.src = imagem;
        imagemPreview.style.display = 'block';

        // Define o estado da checkbox de destaque
        document.getElementById('destaque-editar').checked = (destaque == 1); // Marcar se destaque for 1

        // Exibir o modal
        modalEditar.style.display = 'grid';

        // Evento de clique para o botão de salvar
        const saveBtn = document.getElementById('save');
        saveBtn.onclick = function () {
            const formData = new FormData();
            formData.append('codigo-editar', codigo); // Mudei para 'codigo-editar'
            formData.append('nome-editar', document.getElementById('nome-editar').value);
            formData.append('descricao-editar', document.getElementById('descricao-editar').value);
            formData.append('quantidade-editar', document.getElementById('quantidade-editar').value);
            formData.append('tipo-editar', document.getElementById('tipo-editar').value);
            formData.append('destaque-editar', document.getElementById('destaque-editar').checked ? 1 : 0);

            // Adiciona a nova imagem se selecionada
            const imagemInput = document.getElementById('imagem-editar');
            if (imagemInput && imagemInput.files.length > 0) {
                formData.append('imagem-editar', imagemInput.files[0]);
            }

            // Envio dos dados via fetch
            fetch('./php/atualizar_produto.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede ao enviar os dados.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarMensagem(data.success, "success"); // Mensagem de sucesso
                    modalEditar.style.display = 'none'; // Fecha o modal
                    listarProdutos(); // Atualiza a lista de produtos

                    // Recarrega a página após 3 segundos (3000 milissegundos)
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                } else {
                    mostrarMensagem(data.error || 'Erro ao atualizar o produto.', "error"); // Mensagem de erro
                }
            })
            .catch(error => {
                mostrarMensagem('Erro: ' + error.message, "error"); // Mensagem de erro na captura
                console.error('Erro:', error);
            });
        };

        // Evento para pré-visualizar a nova imagem
        const imagemInput = document.getElementById('imagem-editar');
        if (imagemInput) {
            imagemInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagemPreview.src = e.target.result; // Atualiza a pré-visualização
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Evento para o botão de excluir produto
        const excluirBtn = document.getElementById('excluir-produto');
        excluirBtn.onclick = function (event) {
            event.preventDefault();
            abrirModalConfirmacao(codigo); // Abre modal de confirmação
        };
    };

    // Função para abrir o modal de confirmação
    function abrirModalConfirmacao(codigo) {
        const modalConfirmacao = document.getElementById('modal-confirmacao');
        const confirmarBtn = document.getElementById('confirmar-exclusao');
        const cancelarBtn = document.getElementById('cancelar-exclusao');

        modalConfirmacao.style.display = 'block';

        confirmarBtn.onclick = function () {
            fetch('./php/excluir_produto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `codigo=${codigo}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    listarProdutos();
                    modalConfirmacao.style.display = 'none';
                    mostrarMensagem("Produto excluído com sucesso!", "success"); // Mensagem de sucesso
                    // Recarrega a página após 1 segundos (1000 milissegundos)
                    setTimeout(function() {
                        location.reload();
                    }, 500);
                } else {
                    mostrarMensagem(data.error, "error"); // Mensagem de erro
                }
            })
            .catch(error => console.error('Erro:', error));
        };

        cancelarBtn.onclick = function () {
            modalConfirmacao.style.display = 'none';
        };
    }

    // Define o comportamento do botão de fechar o modal
    closeModalBtn.onclick = function () {
        modalEditar.style.display = 'none';
    };

    // Função para mostrar mensagens na div
    function mostrarMensagem(mensagem, tipo) {
        mensagemDiv.textContent = mensagem;
        mensagemDiv.className = tipo; // Define a classe para estilização (success ou error)
        mensagemDiv.style.display = 'block'; // Mostra a div
        setTimeout(() => {
            mensagemDiv.style.display = 'none'; // Oculta a div após 3 segundos
        }, 3000);
    }
});
