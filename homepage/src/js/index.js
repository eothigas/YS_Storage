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
    setInterval(nextImage, 20000); // 20000 ms = 20 segundos
});


// Função que obtém os parâmetros da URL
function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function() {
    var errorMessage = document.getElementById('error-message');
    var errorParam = getQueryParam('error'); // Busca o parâmetro 'error'

    // Define as mensagens de erro
    var errorMessages = {
        'Senha incorreta': 'Senha incorreta. Por favor, tente novamente.',
        'Email não encontrado': 'Email não encontrado. Tente novamente.'
    };

    // Exibe a mensagem apenas se o parâmetro 'error' estiver presente
    if (errorParam && errorMessages[errorParam]) {
        errorMessage.textContent = errorMessages[errorParam]; // Exibe a mensagem de erro da URL
        errorMessage.style.display = 'block';  // Torna a mensagem visível

        // Oculta a mensagem após 8 segundos
        setTimeout(function() {
            errorMessage.style.display = 'none';
        }, 8000); // 8 segundos
    }
}

// Ver senha
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Alternar o ícone
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});
