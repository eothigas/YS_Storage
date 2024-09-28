function toggleMenu() {
    var menu = document.getElementById("menuLateral");
    var content = document.querySelector(".container");
    var menuIcon = document.querySelector("#btn-menu");
    var closeIcon = document.querySelector("#btn-close");

    // Alterna a classe 'fechado' no menu lateral
    menu.classList.toggle("fechado");
    content.classList.toggle("expanded");

    // Alterna a exibição dos ícones
    menuIcon.style.display = menu.classList.contains("fechado") ? "inline" : "none";
    closeIcon.style.display = menu.classList.contains("fechado") ? "none" : "inline";
}

document.addEventListener("DOMContentLoaded", () => {
    const tabelaProdutos = document.getElementById("tabela-produtos").getElementsByTagName("tbody")[0];
    const modal = document.getElementById("modal-editar-produto");
    const closeModal = document.querySelector(".modal-content .close");
    const formEditarProduto = document.getElementById("form-editar-produto");

    // Função para carregar produtos na tabela
    function carregarProdutos() {
        fetch('../php/consultar_produtos.php') // Faz uma requisição para carregar todos os produtos
            .then(response => response.json())
            .then(produtos => {
                tabelaProdutos.innerHTML = ''; // Limpa a tabela atual
                produtos.forEach(produto => {
                    const novaLinha = tabelaProdutos.insertRow();
                    novaLinha.innerHTML = `
                        <td>${produto.codigo}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.descricao}</td>
                        <td>${produto.quantidade}</td>
                        <td>${produto.tipo}</td>
                        <td><img src="${produto.imagem}" alt="${produto.nome}"></td>
                        <td><button class="editar" data-id="${produto.codigo}">Editar</button></td>
                    `;
                });
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    // Quando clicar no botão "Editar", buscar os dados do produto com base no código
    tabelaProdutos.addEventListener("click", (e) => {
        if (e.target.classList.contains("editar")) {
            const codigoProduto = e.target.getAttribute("data-id");

            // Faz uma requisição POST para pegar os detalhes do produto
            fetch('../php/consultar_produtos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `codigo=${codigoProduto}` // Envia o código do produto via POST
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar produto');
                }
                return response.json();
            })
            .then(produto => {
                if (!produto.error) {
                    document.getElementById("codigo-editar").value = produto.codigo; // Preenche o campo oculto com o código
                    document.getElementById("nome-editar").value = produto.nome;
                    document.getElementById("descricao-editar").value = produto.descricao;
                    document.getElementById("quantidade-editar").value = produto.quantidade; // Deve ser preenchido
                    document.getElementById("tipo-editar").value = produto.tipo;
                    document.getElementById("imagem-preview").src = produto.imagem;

                    modal.style.display = "flex"; // Abre o modal
                } else {
                    console.error(produto.error);
                }
            })
            .catch(error => console.error('Erro ao carregar produto:', error));
        }
    });

    // Fechar o modal
    closeModal.onclick = () => {
        modal.style.display = "none";
    };

    // Salvar alterações
    formEditarProduto.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(formEditarProduto); // Cria um FormData com os dados do formulário

        // Faz uma requisição POST para atualizar os dados do produto
        fetch('../php/atualizar_produto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Produto editado:", data);
            modal.style.display = "none"; // Fechar o modal após salvar
            carregarProdutos(); // Recarrega os produtos
        })
        .catch(error => console.error('Erro ao editar produto:', error));
    };

    // Carregar produtos na tabela ao iniciar a página
    carregarProdutos();
});

// Selecionar o input de arquivo e a imagem de pré-visualização
const inputImagem = document.getElementById("imagem-editar");
const imagemPreview = document.getElementById("imagem-preview");

// Adicionar um listener para o evento de mudança no input de arquivo
inputImagem.addEventListener("change", (event) => {
    const file = event.target.files[0]; // Obtem o primeiro arquivo selecionado
    if (file) {
        const reader = new FileReader(); // Cria um objeto FileReader
        reader.onload = (e) => {
            // Atualiza o src da imagem de pré-visualização
            imagemPreview.src = e.target.result; 
            imagemPreview.style.display = "block"; // Mostra a imagem de pré-visualização
        };
        reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    } else {
        imagemPreview.src = ""; // Limpa a pré-visualização se não houver arquivo
        imagemPreview.style.display = "none"; // Esconde a imagem de pré-visualização
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const modalConfirmacao = document.getElementById("modal-confirmacao");
    const excluirProdutoBtn = document.getElementById("excluir-produto");
    const confirmarExclusaoBtn = document.getElementById("confirmar-exclusao");
    const cancelarExclusaoBtn = document.getElementById("cancelar-exclusao");

    let codigoProdutoExcluir = null; // Variável para armazenar o código do produto a ser excluído

    // Quando clicar no botão "Excluir produto"
    excluirProdutoBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Previne o comportamento padrão
        codigoProdutoExcluir = document.getElementById("codigo-editar").value; // Armazena o código do produto
        modalConfirmacao.style.display = "flex"; // Abre o modal de confirmação
    });

    // Quando clicar em "Sim, prosseguir."
    confirmarExclusaoBtn.addEventListener("click", () => {
        fetch('../php/excluir_produto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `codigo=${codigoProdutoExcluir}` // Envia o código do produto para exclusão
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            modalConfirmacao.style.display = "none"; // Fecha o modal
            location.reload();
        })
        .catch(error => console.error('Erro ao excluir produto:', error));
    });

    // Quando clicar em "Não, retornar."
    cancelarExclusaoBtn.addEventListener("click", () => {
        modalConfirmacao.style.display = "none"; // Fecha o modal
    });
    
    // Fechar o modal ao clicar no "x"
    const closeModalConfirmacao = document.querySelector("#modal-confirmacao");
    closeModalConfirmacao.onclick = () => {
        modalConfirmacao.style.display = "none"; // Fecha o modal
    };
});