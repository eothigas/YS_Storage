// Menu Responsivo
const navIcon = document.querySelector('.nav-icon');
const navMenu = document.querySelector('.nav-menu');

navIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navIcon.classList.toggle('rotated'); // Adiciona/Remove a classe de rotação
});

// Vídeos em Destaque
const highlightVideo = document.getElementById('highlight-video');
const highlightOverlay = document.querySelector('.highlight-overlay');

// Função para mostrar o overlay ao passar o mouse sobre o vídeo
function showOverlay() {
    highlightOverlay.style.display = 'block';
}

// Função para ocultar o overlay ao sair o mouse do vídeo
function hideOverlay() {
    highlightOverlay.style.display = 'none';
}

// Adiciona eventos de mouseover e mouseout ao vídeo
highlightVideo.addEventListener('mouseover', showOverlay);
highlightVideo.addEventListener('mouseout', hideOverlay);

// Adiciona eventos de mouseover e mouseout ao overlay para manter a visibilidade
highlightOverlay.addEventListener('mouseover', showOverlay);
highlightOverlay.addEventListener('mouseout', hideOverlay);

// Botão voltar ao Topo

const btnTopo = document.getElementById('btn-topo');
const carousel = document.getElementById('carousel');

window.addEventListener('scroll', () => {
    const sectionBottom = carousel.getBoundingClientRect().bottom;
    
    // Verifica se o usuário passou do final do carousel
    if (sectionBottom <= 0) {
        btnTopo.classList.add('show'); // Adiciona a classe para exibir o botão com animação
    } else {
        btnTopo.classList.remove('show'); // Remove a classe para ocultar o botão com animação
    }
});

btnTopo.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Funções Carrossel

const carouselImg = document.querySelectorAll('.carousel-item');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
let currentIndex = 0;

function updateCarousel() {
    const transformValue = -currentIndex * 100;
    carouselImg.forEach((item) => {
        item.style.transform = `translateX(${transformValue}%)`;
    });

    // Controle da visibilidade dos botões
    leftBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    rightBtn.style.display = currentIndex === carouselImg.length - 1 ? 'none' : 'block';
}

leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex -= 1;
        updateCarousel();
    }
});

rightBtn.addEventListener('click', () => {
    if (currentIndex < carouselImg.length - 1) {
        currentIndex += 1;
        updateCarousel();
    }
});

updateCarousel();

// Seleciona todos os overlays e infoboxes
const overlays = document.querySelectorAll('.overlay');
const infoBoxes = document.querySelectorAll('.info-box');

// Adiciona um evento de clique a cada overlay
overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        const infoId = overlay.parentElement.dataset.info; // Obtém o ID da info correspondente
        const infoBox = document.getElementById(infoId);
        infoBox.style.display = 'flex'; // Exibe a infobox
        overlay.style.display = 'none'; // Oculta o overlay
        document.querySelector('.left-btn').style.display = 'none'; // Oculta botões de navegação
        document.querySelector('.right-btn').style.display = 'none'; // Oculta botões de navegação
    });
});

// Adiciona um evento de clique a cada botão de fechar na infobox
document.querySelectorAll('.close-info').forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.parentElement.style.display = 'none'; // Oculta a infobox
        document.querySelector(`.carousel-item[data-info="${button.parentElement.parentElement.id}"] .overlay`).style.display = 'flex'; // Exibe o overlay correspondente
        document.querySelector('.left-btn').style.display = currentIndex === 0 ? 'none' : 'block';
        document.querySelector('.right-btn').style.display = currentIndex === carouselImg.length - 1 ? 'none' : 'block';
    });
});

// Carrossel imagens clientes

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da barra de navegação e imagens do carrossel
    const navIt = document.querySelectorAll('.nav-itens');
    const carouselImages = document.querySelector('.carousel-images-inner');
    const imageWidth = document.querySelector('.carousel-images-inner img').clientWidth;
    let index = 0;

    // Atualiza a visualização do carrossel com base no índice
    function updateCarousel(newIndex) {
        index = newIndex;
        carouselImages.style.transform = `translateX(${-index * imageWidth}px)`;
        navIt.forEach(item => item.classList.remove('active'));
        navIt[index].classList.add('active');
    }

    // Adiciona eventos de clique para cada item da barra de navegação
    navIt.forEach(item => {
        item.addEventListener('click', () => {
            const newIndex = parseInt(item.getAttribute('data-index'));
            updateCarousel(newIndex);
        });
    });

    // Inicializa o carrossel com o primeiro item ativo
    updateCarousel(0);

    // Adiciona um intervalo automático para mudar as imagens a cada 5 segundos
    setInterval(() => {
        index = (index + 1) % navIt.length;
        updateCarousel(index);
    }, 5000);
});

