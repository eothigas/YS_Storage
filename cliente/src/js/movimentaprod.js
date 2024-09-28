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
    const formMovimentacao = document.getElementById("form-movimentacao");
    const mensagem = document.getElementById("mensagem");
    
    // Exemplo de produtos (substitua pela sua lógica de carregamento)
    const produtos = [
        { id: 1, nome: "Produto A" },
        { id: 2, nome: "Produto B" }
        // Adicione mais produtos conforme necessário
    ];

    // Função para carregar produtos no select
    function carregarProdutos() {
        const selectProduto = document.getElementById("produto");
        produtos.forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.textContent = produto.nome;
            selectProduto.appendChild(option);
        });
    }

    // Registrar movimentação
    formMovimentacao.onsubmit = (e) => {
        e.preventDefault();
        const produtoId = document.getElementById("produto").value;
        const tipoMovimentacao = document.getElementById("tipo-movimentacao").value;
        const quantidade = document.getElementById("quantidade").value;

        // Implemente a lógica para registrar a movimentação
        console.log(`Movimentação registrada: ${tipoMovimentacao} de ${quantidade} unidades do produto ID ${produtoId}`);
        
        // Exibir mensagem de sucesso
        mensagem.textContent = `Movimentação de ${quantidade} unidades registrada com sucesso!`;
        mensagem.className = "message success";
        mensagem.style.display = "block";

        // Limpar o formulário após o envio
        formMovimentacao.reset();
    };

    // Carregar produtos ao iniciar a página
    carregarProdutos();
});
