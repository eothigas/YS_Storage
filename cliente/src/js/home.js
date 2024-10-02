// Variáveis de controle de índices
let currentStorageIndex = 0;
let currentProductIndex = 0;

// Armazenamento de dados
let storages = [];
const tbody = document.getElementById('produtos-destaque');

// Intervalos para atualizações
let storageInterval;
let productInterval;

// Função para alternar o menu lateral
function toggleMenu() {
    const menu = document.getElementById("menuLateral");
    const content = document.querySelector(".section-top");
    const menuIcon = document.querySelector("#btn-menu");
    const closeIcon = document.querySelector("#btn-close");

    // Alterna a classe 'fechado' no menu lateral
    menu.classList.toggle("fechado");
    content.classList.toggle("expanded");

    // Alterna a exibição dos ícones
    menuIcon.style.display = menu.classList.contains("fechado") ? "inline" : "none";
    closeIcon.style.display = menu.classList.contains("fechado") ? "none" : "inline";
}

// Função para buscar dados dos storages
function fetchStorages() {
    fetch('./php/consulta_storages.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
            } else if (data.length > 0) {
                storages = data;
                currentStorageIndex = 0; // Reinicia o índice
                console.log('Storages carregados:', storages.length);
                updateStorageInfo(); // Atualiza pela primeira vez

                // Exibe o slider e oculta a mensagem de "info"
                document.getElementById("info").style.display = "none";
                document.querySelector(".image-slider").style.display = "grid";
                document.querySelector(".text-block").style.display = "grid";

                // Limpa intervalo anterior e define um novo
                clearInterval(storageInterval);
                storageInterval = setInterval(updateStorageInfo, 15000);
            } else {
                console.log('Nenhum storage encontrado.');
                document.getElementById("info").style.display = "block";
                document.querySelector(".image-slider").style.display = "none";
                document.querySelector(".text-block").style.display = "none";
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Função para atualizar as informações dos storages
function updateStorageInfo() {
    // Verifica se há storages disponíveis
    if (storages.length === 0) {
        console.error('Nenhum storage disponível.');
        return; // Saia da função se não houver storages
    }

    // Acesso seguro ao armazenamento
    const storage = storages[currentStorageIndex];

    // Se o storage não for encontrado, exibe um erro
    if (!storage) {
        console.error('Storage não encontrado para o índice atual:', currentStorageIndex);
        return; // Saia da função se o storage não for encontrado
    }

    // Exibição dos dados do storage
    const textBlock = document.querySelector('.text-block');
    textBlock.style.opacity = '0'; // Faz a transição para invisível

    setTimeout(() => {
        console.log('Exibindo storage no índice:', currentStorageIndex, storage);

        // Atualiza a imagem e os textos
        document.querySelector('.slider-image').src = storage.imagem || 'default-image.jpg'; // Imagem padrão caso falhe
        document.getElementById('title').textContent = storage.nome || 'Nome não disponível';
        document.getElementById('p1').querySelector('.text-content').textContent = storage.endereco || 'Endereço não disponível';
        document.getElementById('p2').querySelector('.text-content').textContent = storage.altura || 'Altura não disponível';
        document.getElementById('p3').querySelector('.text-content').textContent = storage.largura || 'Largura não disponível';
        document.getElementById('p4').querySelector('.text-content').textContent = storage.comprimento || 'Comprimento não disponível';

        // Faz a transição para visível novamente
        textBlock.style.opacity = '1';

        // Atualiza o índice para o próximo storage, garantindo que fique dentro do limite
        currentStorageIndex = (currentStorageIndex + 1) % storages.length; // Garante que o índice permaneça no limite
        console.log('Próximo índice será:', currentStorageIndex);
    }, 500); // Tempo ajustado para a transição
}

// Função para buscar produtos em destaque
function buscarProdutoDestaque() {
    fetch('./php/produtos_destaque.php')
        .then(response => response.json())
        .then(data => {
            tbody.innerHTML = ''; // Limpa o conteúdo atual

            if (data.message) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">${data.message}</td></tr>`;
            } else if (data.error) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">${data.error}</td></tr>`;
            } else {
                // Exibe o primeiro produto
                exibirProduto(data[currentProductIndex]);

                // Se houver mais de um produto, alternar entre eles
                if (data.length > 1) {
                    clearInterval(productInterval); // Limpa intervalo anterior
                    productInterval = setInterval(() => {
                        fadeOut(() => {
                            currentProductIndex = (currentProductIndex + 1) % data.length; // Atualiza o índice
                            exibirProduto(data[currentProductIndex]); // Exibe o próximo produto
                        });
                    }, 15000); // Tempo de 15 segundos para alternar
                }
            }
        })
        .catch(error => {
            console.error('Erro ao buscar produto em destaque:', error);
        });
}

// Função para exibir o produto atual
function exibirProduto(produto) {
    tbody.innerHTML = ` 
        <tr>
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>${produto.quantidade}</td>
            <td><img src="${produto.imagem || 'default-product-image.jpg'}" alt="${produto.nome}" width="50"></td>
        </tr>
    `;
    // Adiciona a classe fade-in após a nova exibição
    tbody.classList.add('fade-in');
}

// Função para fazer fade out
function fadeOut(callback) {
    tbody.classList.remove('fade-in'); // Remove a classe de fade-in
    tbody.classList.add('fade-out'); // Adiciona a classe de fade-out

    // Espera a transição terminar
    setTimeout(() => {
        tbody.classList.remove('fade-out'); // Remove a classe de fade-out para que a opacidade volte ao normal
        callback(); // Chama o callback
    }, 500); // Tempo igual à duração da transição
}

// Chama ambas as funções ao carregar a página
window.onload = function() {
    fetchStorages();
    buscarProdutoDestaque();
};