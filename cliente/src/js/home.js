function toggleMenu() {
    var menu = document.getElementById("menuLateral");
    var content = document.querySelector(".section-top");
    var menuIcon = document.querySelector("#btn-menu");
    var closeIcon = document.querySelector("#btn-close");

    // Alterna a classe 'fechado' no menu lateral
    menu.classList.toggle("fechado");
    content.classList.toggle("expanded");

    // Alterna a exibição dos ícones
    menuIcon.style.display = menu.classList.contains("fechado") ? "inline" : "none";
    closeIcon.style.display = menu.classList.contains("fechado") ? "none" : "inline";
}

let currentIndex = 0;
let storages = [];

// Função para buscar dados dos storages
function fetchStorages() {
    fetch('../php/consulta_storages.php')
        .then(response => response.json())
        .then(data => {
            storages = data;
            if (storages.length > 0) {
                updateStorageInfo();
                setInterval(updateStorageInfo, 10000);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Função para atualizar as informações dos storages
function updateStorageInfo() {
    const textBlock = document.querySelector('.text-block');
    // Faz a transição para invisível
    textBlock.style.opacity = '0';

    setTimeout(() => {
        const storage = storages[currentIndex];
        document.querySelector('.slider-image').src = storage.imagem;
        document.getElementById('title').textContent = storage.nome; // Nome no h2
        document.getElementById('p1').querySelector('.text-content').textContent = storage.endereco; // Endereço no p1
        document.getElementById('p2').querySelector('.text-content').textContent = storage.altura; // Altura no p2
        document.getElementById('p3').querySelector('.text-content').textContent = storage.largura; // Largura no p3
        document.getElementById('p4').querySelector('.text-content').textContent = storage.comprimento; // Comprimento no p4

    textBlock.style.opacity = '1';

     // Atualiza o índice para o próximo storage
        currentIndex = (currentIndex + 1) % storages.length;
    }, 500); // Aguarda o tempo da transição para atualizar os dados
}

// Iniciar a busca de dados ao carregar a página
window.onload = fetchStorages;
