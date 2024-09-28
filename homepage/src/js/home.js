// Home Logado

// Carrossel destaque

let currentIndex = 0;
const images = document.querySelectorAll('.image-container img');
const descriptions = document.querySelectorAll('.desc h2, .desc p');

// Função para alternar as imagens e descrições
function showNextSlide() {
    // Oculta a imagem e descrição atuais
    images[currentIndex].classList.remove('active');
    descriptions[currentIndex * 2].classList.remove('active'); // h2
    descriptions[currentIndex * 2 + 1].classList.remove('active'); // p

    // Atualiza o índice para a próxima imagem/descrição
    currentIndex = (currentIndex + 1) % images.length;

    // Exibe a nova imagem e descrição
    images[currentIndex].classList.add('active');
    descriptions[currentIndex * 2].classList.add('active'); // h2
    descriptions[currentIndex * 2 + 1].classList.add('active'); // p
}

// Inicializa a primeira imagem e descrição como ativas
images[currentIndex].classList.add('active');
descriptions[currentIndex * 2].classList.add('active'); // h2
descriptions[currentIndex * 2 + 1].classList.add('active'); // p

// Troca a cada 10 segundos (10000 milissegundos)
setInterval(showNextSlide, 10000);
