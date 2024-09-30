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
const tbody = document.getElementById('produtos-destaque');

// Função para buscar dados dos storages
function fetchStorages() {
    fetch('./php/consulta_storages.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
            } else if (data.length > 0) {
                storages = data;
                document.getElementById("info").style.display = "none";
                document.querySelector(".image-slider").style.display = "grid";
                document.querySelector(".text-block").style.display = "grid";
                updateStorageInfo();
                setInterval(updateStorageInfo, 30000);
            } else {
                console.log('Nenhum storage encontrado.');
                // Mantém o estado padrão, onde "info" aparece e o restante fica oculto
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
    const textBlock = document.querySelector('.text-block');
    textBlock.style.opacity = '0'; // Faz a transição para invisível

    setTimeout(() => {
        const storage = storages[currentIndex];
        document.querySelector('.slider-image').src = storage.imagem;
        document.getElementById('title').textContent = storage.nome;
        document.getElementById('p1').querySelector('.text-content').textContent = storage.endereco;
        document.getElementById('p2').querySelector('.text-content').textContent = storage.altura;
        document.getElementById('p3').querySelector('.text-content').textContent = storage.largura;
        document.getElementById('p4').querySelector('.text-content').textContent = storage.comprimento;

        textBlock.style.opacity = '1'; // Faz a transição para visível novamente

        // Atualiza o índice para o próximo storage
        currentIndex = (currentIndex + 1) % storages.length;
    }, 500); // Aguarda o tempo da transição para atualizar os dados
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
                exibirProduto(data[currentIndex]);

                // Se houver mais de um produto, alternar entre eles
                if (data.length > 1) {
                    setInterval(() => {
                        fadeOut(() => {
                            currentIndex = (currentIndex + 1) % data.length; // Atualiza o índice
                            exibirProduto(data[currentIndex]); // Exibe o próximo produto
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
            <td><img src="${produto.imagem}" alt="${produto.nome}" width="50"></td>
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