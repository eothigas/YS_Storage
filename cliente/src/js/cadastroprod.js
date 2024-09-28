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


document.getElementById('imagem').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtém o arquivo de imagem selecionado
    const imgPreview = document.getElementById('imagem-preview'); // Elemento img para pré-visualização

    if (file) {
        const reader = new FileReader(); // Cria um FileReader para ler o arquivo

        reader.onload = function(e) {
            imgPreview.src = e.target.result; // Define o src da imagem como o resultado da leitura do arquivo
            imgPreview.style.display = 'block'; // Exibe a imagem
        }

        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    } else {
        imgPreview.style.display = 'none'; // Esconde a imagem se nenhum arquivo for selecionado
    }
});

// Envio do formulário via fetch API
document.getElementById('form-cadastro-produto').addEventListener('submit', function(e) {
    e.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const quantidade = document.getElementById('quantidade').value;
    const tipo = document.getElementById('tipo').value;
    const imagem = document.getElementById('imagem').files[0];

    // Cria um FormData para enviar os dados
    const formData = new FormData();
    formData.append('codigo', codigo);
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('quantidade', quantidade);
    formData.append('tipo', tipo);
    formData.append('imagem', imagem);

    // Envia os dados via AJAX usando fetch
    fetch('../php/cadastro_produto.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const successElement = document.getElementById('mensagem-sucess');
            successElement.innerText = data.success;
            successElement.style.display = 'flex'; // Exibe a mensagem de sucesso

            // Após 5 segundos, recarrega a página
            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            // Exibe a mensagem de erro
            const errorElement = document.getElementById('mensagem-error');
            errorElement.innerText = data.error;
            errorElement.style.display = 'flex'; // Exibe a mensagem de erro

            // Esconde a mensagem após 3 segundos
            setTimeout(() => {
                errorElement.style.display = 'none'; // Esconde a mensagem de erro
            }, 3000);
        }
    })
    .catch(error => {
            // Exibe a mensagem de erro caso ocorra algum erro inesperado
            const errorElement = document.getElementById('mensagem-error');
            errorElement.style.display = 'flex'; // Exibe a mensagem de erro
            errorElement.innerText = 'Ocorreu um erro ao cadastrar o produto.';

            // Esconde a mensagem após 3 segundos
            setTimeout(() => {
                errorElement.style.display = 'none'; // Esconde a mensagem de erro
            }, 3000);
    });
});