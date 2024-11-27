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
  
// Função para rolar diretamente ao topo ao clicar no botão
document.getElementById("btn-topo").addEventListener("click", () => {
    window.scrollTo(0, 0); // Rola instantaneamente para o topo
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
    // Parametros opcionais
    direction: 'horizontal',
    grabCursor: true,
    loop: false,
  
    // Navegação
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
});

// Informações específicas de cada slide
const slideInfo = [
    {
        title: "Storage Ondev 1",
        height: "Altura: 10m",
        width: "Largura: 10m",
        length: "Comprimento: 20m"
    },
    {
        title: "Storage Ondev 2",
        height: "Altura: 15m",
        width: "Largura: 12m",
        length: "Comprimento: 25m"
    },
    {
        title: "Storage Ondev 3",
        height: "Altura: 12m",
        width: "Largura: 15m",
        length: "Comprimento: 30m"
    }
];

const view = document.getElementById('view');
const returnBtn = document.getElementById('return-btn');
const infoView = document.getElementById('info-view');
const infoTitle = document.getElementById('info-title');
const infoHeight = document.getElementById('info-height');
const infoWidth = document.getElementById('info-width');
const infoLength = document.getElementById('info-length');

view.addEventListener('click', () => {
    // Obter o índice do slide ativo
    const currentSlideIndex = swiper.realIndex; // Índice do slide ativo
    const currentInfo = slideInfo[currentSlideIndex]; // Informações do slide atual

    // Atualizar a "info view" com as informações do slide ativo
    infoTitle.innerText = currentInfo.title;
    infoHeight.innerText = currentInfo.height;
    infoWidth.innerText = currentInfo.width;
    infoLength.innerText = currentInfo.length;

    // Exibir a "info view" e esconder os botões de navegação
    view.style.display = "none";
    document.getElementById('left-btn').style.display = "none";
    document.getElementById('right-btn').style.display = "none";
    infoView.style.display = "flex";
});

returnBtn.addEventListener('click', () => {
    // Mostrar novamente os botões e esconder a "info view"
    view.style.display = "flex";
    document.getElementById('left-btn').style.display = "flex";
    document.getElementById('right-btn').style.display = "flex";
    infoView.style.display = "none";
});


// Efeito botão preencher formulário
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