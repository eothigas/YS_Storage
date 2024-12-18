function smoothScrollTo(top, duration) {
    const start = window.scrollY;
    const startTime = performance.now();
    
    function scrollStep(timestamp) {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        window.scrollTo(0, start + (top - start) * easeInOutQuad(progress));
        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }
    
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    requestAnimationFrame(scrollStep);
}

// Menu Responsivo
const navIcon = document.querySelector('.nav-icon');
const navMenu = document.querySelector('.nav-menu');

navIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navIcon.classList.toggle('rotated'); // Adiciona/Remove a classe de rotação
});

document.addEventListener('DOMContentLoaded', () => {
    const highlightImgs = document.querySelectorAll('.highlight-img');
    const highlightText = document.querySelector('.highlight-text');
    const pagination = document.querySelector('.pagination');
    const intervalTime = 18000; // 18 segundos para cada imagem

    const texts = [
        { 
            title: 'Gerenciamento de estoque seguro e organizado', 
            paragraph: 'Controle o estoque de produtos e ativos físicos de sua empresa de maneira segura e organizada, garantindo a disponibilidade e o cuidado com os recursos essenciais para o seu negócio.' 
        },
        { 
            title: 'Soluções Assertivas', 
            paragraph: 'O sistema oferece funcionalidades para cadastrar, consultar, alterar e movimentar o estoque, além de gerenciar usuários com facilidade e precisão.' 
        },
        { 
            title: 'Confiança e Qualidade', 
            paragraph: 'Um bom gerenciamento de estoque é vital para qualquer empresa. A confiabilidade e qualidade nos processos garantem a eficiência e segurança dos serviços prestados.' 
        }
    ];

    let currentIndex = 0;
    let interval;

    function createPaginationDots() {
        texts.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => showImage(index));
            pagination.appendChild(dot);
        });
    }

    function resetDotAnimation() {
        document.querySelectorAll('.pagination-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
            // Remova a animação anterior e a animação de preenchimento
            dot.style.animation = 'none'; // Remove a animação anterior
            dot.offsetHeight; // Força o reflow para reiniciar a animação
        });
    }

    function showImage(index) {
        highlightImgs.forEach((img, i) => {
            img.style.opacity = i === index ? '1' : '0';
        });

        highlightText.innerHTML = `
            <h1>${texts[index].title}</h1>
            <p>${texts[index].paragraph}</p>
        `;

        currentIndex = index;
        resetDotAnimation();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % highlightImgs.length;
        showImage(currentIndex);
    }

    // Inicializa o carrossel e cria a paginação
    showImage(currentIndex);
    createPaginationDots();

    // Define o intervalo para troca automática das imagens e pontos
    interval = setInterval(nextImage, intervalTime);
});

// Botão voltar ao Topo

const btnTopo = document.getElementById('btn-topo');
const btnShow = document.getElementById('btnShow');
const footer = document.getElementById('footer-page');

window.addEventListener('scroll', () => {
    const sectionBottom = btnShow.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;
    
    // Verifica se o usuário passou do final do client
    if (sectionBottom <= 0 && footerTop > window.innerHeight) {
        btnTopo.classList.add('show'); // Adiciona a classe para exibir o botão com animação
    } else {
        btnTopo.classList.remove('show'); // Remove a classe para ocultar o botão com animação
    }
});

btnTopo.addEventListener('click', () => {
    smoothScrollTo(0, 1000); // Rolagem para o topo em 1 segundo
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

overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        const infoId = overlay.parentElement.dataset.info;
        const infoBox = document.getElementById(infoId);
        infoBox.style.display = 'flex';
        overlay.style.display = 'none';
        document.querySelector('.left-btn').style.display = 'none';
        document.querySelector('.right-btn').style.display = 'none';
    });
});

document.querySelectorAll('.close-info').forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.parentElement.style.display = 'none';
        document.querySelector(`.carousel-item[data-info="${button.parentElement.parentElement.id}"] .overlay`).style.display = 'flex';
        document.querySelector('.left-btn').style.display = currentIndex === 0 ? 'none' : 'block';
        document.querySelector('.right-btn').style.display = currentIndex === carouselImg.length - 1 ? 'none' : 'block';
    });
});

// Carrossel Clientes
document.addEventListener('DOMContentLoaded', () => {
    const navIt = document.querySelectorAll('.nav-itens');
    const carouselImages = document.querySelector('.carousel-images-inner');
    let imageWidth = document.querySelector('.carousel-images-inner img').clientWidth;
    let index = 0;
    let autoSlideInterval = null;

    function updateImageWidth() {
        imageWidth = document.querySelector('.carousel-images-inner img').clientWidth;
    }

    function updateCarousel(newIndex) {
        index = newIndex;
        updateImageWidth();
        carouselImages.style.transform = `translateX(${-index * imageWidth}px)`;
        navIt.forEach(item => item.classList.remove('active'));
        navIt[index].classList.add('active');
    }

    navIt.forEach(item => {
        item.addEventListener('click', () => {
            const newIndex = parseInt(item.getAttribute('data-index'));
            updateCarousel(newIndex);
        });
    });

    updateCarousel(0);

    function startAutoSlide() {
        if (autoSlideInterval === null) {
            autoSlideInterval = setInterval(() => {
                index = (index + 1) % navIt.length;
                updateCarousel(index);
            }, 5000);
        }
    }

    function stopAutoSlide() {
        if (autoSlideInterval !== null) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function updateCarouselBehavior() {
        if (window.innerWidth > 400) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }
    }

    updateCarouselBehavior();

    window.addEventListener('resize', () => {
        updateImageWidth();
        updateCarousel(index);
        updateCarouselBehavior();
    });
});