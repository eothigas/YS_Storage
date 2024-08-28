// Menu Responsivo
const navIcon = document.querySelector('.nav-icon');
const navMenu = document.querySelector('.nav-menu');

navIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Botão Voltar ao Topo
const btnTopo = document.getElementById('btn-topo');
const carouselSection = document.getElementById('carousel');

window.addEventListener('scroll', () => {
    const carouselPosition = carouselSection.getBoundingClientRect().top;
    if (carouselPosition <= window.innerWidth) {
        btnTopo.style.display = 'block';
    } else {
        btnTopo.style.display = 'none';
    }
});

btnTopo.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Evento de clique nas imagens do carrossel
const carouselItems = document.querySelectorAll('.carousel-item');

carouselItems.forEach(item => {
    item.addEventListener('click', () => {
        // Aqui você pode adicionar o código para exibir os dados adicionais da imagem
        alert('Dados da imagem serão exibidos aqui.');
    });
});

const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
const carouselContainer = document.querySelector('.carousel-container');
const items = document.querySelectorAll('.carousel-item');

let currentIndex = 0;

function updateCarousel() {
    items.forEach((item, index) => {
        item.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
    leftBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    rightBtn.style.display = currentIndex < items.length - 1 ? 'block' : 'none';
}

rightBtn.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
        currentIndex++;
        updateCarousel();
    }
});

leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

updateCarousel(); // Inicializa o estado do carrossel
