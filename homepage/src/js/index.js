document.addEventListener("scroll", () => {
    const btnTopo = document.getElementById("btn-topo");
    const carrosselFlow = document.getElementById("carrossel-flow");
    const footer = document.querySelector("footer");

    const carrosselMetade = carrosselFlow.offsetTop + carrosselFlow.offsetHeight / 2;
    const footerTop = footer.offsetTop;
    const scrollPosition = window.scrollY + window.innerHeight;

    if (window.scrollY >= carrosselMetade && scrollPosition < footerTop) {
        btnTopo.classList.add("show");
    } else {
        btnTopo.classList.remove("show");
    }
});
  
// Função para rolar suavemente ao topo ao clicar no botão
document.getElementById("btn-topo").addEventListener("click", () => {
    const scrollToTop = () => {
        const currentPosition = window.scrollY;
        
        if (currentPosition > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentPosition - currentPosition / 0);
        }
    };

    scrollToTop();
});

// Carrossel de Destaque imagens + texto
document.addEventListener('DOMContentLoaded', () => {
    const highlightImgs = document.querySelectorAll('.highlight-img');
    const highlightText = document.querySelector('.legenda');
    const pagination = document.querySelector('.pagination');
    const intervalTime = 18000; // 18 segundos para cada imagem

    const texts = [
        { 
            title: 'Confiança e Qualidade', 
            paragraph: 'Um bom gerenciamento de estoque é vital para qualquer empresa. A confiabilidade e qualidade nos processos garantem a eficiência e segurança dos serviços prestados.' 
        },
        { 
            title: 'Soluções Assertivas', 
            paragraph: 'O sistema oferece funcionalidades para cadastrar, consultar, alterar e movimentar o estoque, além de gerenciar usuários com facilidade e precisão.' 
        },
        { 
            title: 'Gerenciamento de estoque seguro e organizado', 
            paragraph: 'Controle o estoque de produtos e ativos físicos de sua empresa de maneira segura e organizada, garantindo a disponibilidade e o cuidado com os recursos essenciais para o seu negócio.'
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
            <p>${texts[index].paragraph}</p>`
        ;

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

// Menu Responsivo
const navBtn = document.getElementById('nav-btn-open');
const navBtnClose = document.getElementById('nav-btn-close');
const navList = document.getElementById('lista');


navBtn.addEventListener('click', () => {
    navList.style.display = 'flex';
    navBtn.style.display = 'none';
    navBtnClose.style.display = 'flex';
});

navBtnClose.addEventListener('click', () => {
    navList.style.display = 'none';
    navBtn.style.display = 'flex';
    navBtnClose.style.display = 'none';
});

// Carrossel de Storages
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    grabCursor: true,
    loop: false,
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
});

const view = document.getElementById('view');
const returnBtn = document.getElementById('return-btn');

view.addEventListener('click', () => {
    document.getElementById('view').style.display = "none";
    document.getElementById('left-btn').style.display = "none";
    document.getElementById('right-btn').style.display = "none";
    document.getElementById('info-view').style.display = "flex";
});

returnBtn.addEventListener('click', () => {
    document.getElementById('view').style.display = "flex";
    document.getElementById('left-btn').style.display = "flex";
    document.getElementById('right-btn').style.display = "flex";
    document.getElementById('info-view').style.display = "none";
});

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('link-form');
    const message = document.getElementById('contact-happiness');

    button.addEventListener('mouseover', () => {
        message.style.display = 'flex';
        message.classList.add('party');
    });

    button.addEventListener('mouseout', () => {
        message.style.display = "none"
        message.classList.remove('party');
    });
});

// Cards Feedback Clientes
document.addEventListener('DOMContentLoaded', function() {
    const mySwiper = new Swiper('.mySwiper', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 18,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 18,
        },
        1180: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
});

//Link para a página de planos 
document.getElementById("planos-button").addEventListener("click", () => {
    window.location.href = "https://www.yourstorage.x10.mx/homepage/planos.html"; // Redireciona para a URL
});