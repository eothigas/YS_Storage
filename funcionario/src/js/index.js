// Carrossel de imagens (automático)
document.addEventListener('DOMContentLoaded', () => {
    const highlightImgs = document.querySelectorAll('.highlight-img');
    let currentIndex = 0;

    function showImage(index) {
        highlightImgs.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % highlightImgs.length;
        showImage(currentIndex);
    }

    // Inicializa o carrossel mostrando a primeira imagem
    showImage(currentIndex);

    // Troca de imagem a cada 20 segundos
    setInterval(nextImage, 20000); // 20000 ms
});

// Ver senha
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Alternar o ícone
    this.classList.toggle('fa-eye'); // Exibe
    this.classList.toggle('fa-eye-slash'); // Oculta
});

// Enviar o formulário de login via AJAX e exibir a mensagem de erro
document.querySelector('.log').addEventListener('submit', function(e) {
    e.preventDefault();  // Evita o comportamento padrão de envio do formulário

    const form = e.target;
    const formData = new FormData(form);

    // Envia os dados do formulário para o PHP usando fetch
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Espera um JSON como resposta
    .then(data => {
        if (data.status === "error") {
            // Exibir a mensagem de erro na div de mensagens
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = data.message;
            messageDiv.style.display = 'block';

            // Ocultar a mensagem após 8 segundos
            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 8000);
        } else if (data.status === "success") {
            // Se for sucesso, o PHP irá redirecionar automaticamente
            window.location.href = data.redirect_url; // Redirecionar para a página desejada
        }
    })
    .catch(error => console.error('Erro na requisição:', error));
});