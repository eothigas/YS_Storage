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
    const formMovimentacao = document.getElementById("form-movimentacao-produto");
    const mensagem = document.getElementById("mensagem");

    // Função para obter o nome do usuário da sessão
    function obterUsuarioNome() {
        return fetch('./php/check_session.php')
            .then(response => response.json())
            .then(data => {
                return data.nome; // Retorna o nome do usuário
            })
            .catch(error => {
                console.error('Erro ao obter nome do usuário:', error);
                return 'Usuário Desconhecido'; // Valor padrão em caso de erro
            });
    }

    // Carregar nome do usuário no campo de identificação
    obterUsuarioNome().then(nomeUsuario => {
        document.getElementById("responsa").value = nomeUsuario;
    });

    // Carregar produtos da tabela produtos
    function carregarProdutos() {
        fetch('./php/listar_produtos.php')
            .then(response => response.json())
            .then(data => {
                const selectProduto = document.getElementById("produto");
                data.produtos.forEach(produto => {
                    const option = document.createElement("option");
                    option.value = produto.codigo; // Considerando que o código é o identificador do produto
                    option.textContent = produto.nome; // Nome do produto
                    selectProduto.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    // Carregar produtos ao iniciar a página
    carregarProdutos();

});

document.getElementById('form-movimentacao-produto').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(this);

    fetch('./php/registrar_movimentacao.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse a resposta como JSON
    })
    .then(data => {
        const mensagemDiv = document.getElementById('mensagem');
        
        // Limpar classes anteriores
        mensagemDiv.classList.remove('success', 'error');

        // Atribuir classe e mensagem apropriadas
        if (data.mensagem.includes("sucesso")) {
            mensagemDiv.classList.add('success'); // Adiciona classe de sucesso
            // Recarregar a página após 4 segundos
            setTimeout(() => {
                location.reload();
            }, 4000);
        } else {
            mensagemDiv.classList.add('error'); // Adiciona classe de erro
        }

        mensagemDiv.innerText = data.mensagem;

        // Torna a div visível
        mensagemDiv.style.display = 'block';

        // Ocultar a mensagem após 3 segundos
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
        }, 3000);
    })
    .catch(error => {
        console.error('Erro:', error);
        const mensagemDiv = document.getElementById('mensagem');
        
        // Limpar classes anteriores
        mensagemDiv.classList.remove('success', 'error');

        mensagemDiv.classList.add('error'); // Adiciona classe de erro
        mensagemDiv.innerText = "Ocorreu um erro ao processar sua solicitação.";

        // Torna a div visível
        mensagemDiv.style.display = 'block';

        // Ocultar a mensagem após 5 segundos
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
        }, 5000);
    });
});
