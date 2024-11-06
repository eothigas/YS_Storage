// Carregar arquivo de imagem e exibir

document.getElementById('upload-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const fileInfoText = document.getElementById('file-info-text');
    const imagePreview = document.getElementById('image-preview');

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Mostra a prévia da imagem
        };

        reader.readAsDataURL(file);
        fileInfoText.textContent = file.name; // Atualiza o texto para mostrar o nome do arquivo
    } else {
        fileInfoText.textContent = 'Nenhuma imagem selecionada';
        imagePreview.style.display = 'none'; // Esconde a prévia se não houver imagem
    }
});


function previewImage(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('image-preview');
    const avatarPreview = document.getElementById('avatar-preview');
    const iconImage = document.getElementById('icon-image');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            avatarPreview.src = e.target.result;
            avatarPreview.style.display = 'block';
            iconImage.style.display = 'none';
        };
        reader.readAsDataURL(file);
        document.getElementById('file-info-text').innerText = file.name;
    } else {
        imagePreview.style.display = 'none';
        avatarPreview.style.display = 'none';
        iconImage.style.display = 'block';
        document.getElementById('file-info-text').innerText = 'Nenhuma imagem selecionada';
    }
}

function updatePreview() {
    const nome = document.querySelector('.nome').value;
    const endereco = document.querySelector('.adress-storage').value;
    const altura = document.querySelector('.altura').value;
    const largura = document.querySelector('.largura').value;
    const comprimento = document.querySelector('.comprimento').value;

    document.getElementById('name-preview').innerText = nome || 'Nome do Storage';
    document.getElementById('adress-preview').innerText = endereco || 'Endereço do Storage';
    document.getElementById('height-preview').innerText = altura ? `${altura} Metros` : 'Altura do Storage';
    document.getElementById('width-preview').innerText = largura ? `${largura} Metros` : 'Largura do Storage';
    document.getElementById('length-preview').innerText = comprimento ? `${comprimento} Metros` : 'Comprimento do Storage';
}

function updateEmpresaPreview() {
    const empresa = document.querySelector('.storage-enterprise').value;
    document.getElementById('storage-preview').innerText = empresa || 'Empresa';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.novo-storage');

    // Adiciona um evento de submit ao formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        // Cria um objeto FormData para coletar os dados do formulário
        const formData = new FormData(form);

        // Envia os dados para o PHP
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        // Coleta o retorno do PHP
        const retornoPHP = await response.json();

        // Exibe a notificação com base na resposta do PHP
        exibirNotificacao(retornoPHP);
    });
});

// Função para exibir notificação com base nos dados retornados pelo PHP
function exibirNotificacao(retornoPHP) {
    const notification = document.querySelector('.notification');
    const notificationBody = document.querySelector('.notification_body');

    // Remove todas as classes de notificação anteriores
    notification.classList.remove('notification--alert', 'notification--error', 'notification--success');

    // Define o ícone e a classe com base no tipo da notificação
    let icone = '';
    let recarregar = false; // Variável para controlar se a página deve ser recarregada

    switch (retornoPHP.status) {
        case 'error':
            icone = "<i class='bi bi-x-circle'></i> ";
            notification.classList.add('notification--error');
            break;
        case 'success':
            icone = "<i class='bi bi-check-circle'></i> ";
            notification.classList.add('notification--success');
            recarregar = true; // Marca para recarregar a página
            break;
        case 'alert':
            icone = "<i class='bi bi-exclamation-circle'></i> ";
            notification.classList.add('notification--alert');
            break;
        default:
            return; // Tipo desconhecido, não exibir nada
    }

    // Define a mensagem com o ícone na notificação
    notificationBody.innerHTML = `${icone}${retornoPHP.message}`;

    // Exibe a notificação
    notification.style.display = 'flex';

    // Oculta a notificação após 5 segundos
    setTimeout(() => {
        notification.style.display = 'none';
        if (recarregar) {
            location.reload(); // Recarrega a página apenas se for sucesso
        }
    }, 5300);
}

document.addEventListener("DOMContentLoaded", function() {
    // Função para buscar as empresas do PHP e preencher o select
    function carregarEmpresas() {
        // Usando o fetch para fazer uma requisição para o arquivo PHP
        fetch('../php/get_empresas.php')
            .then(response => response.text()) // Recebe a resposta como texto (HTML)
            .then(data => {
                // Seleciona o elemento <select> para as empresas
                const selectEmpresa = document.querySelector('select[name="empresa"]');
                
                // Adiciona as opções no select
                selectEmpresa.innerHTML = data; // A resposta do PHP é já o HTML das opções

                // Após carregar as opções, selecionar a primeira opção automaticamente
                selectEmpresa.value = ""; // A primeira opção será "Selecione uma empresa"
            })
            .catch(error => {
                console.error('Erro ao carregar empresas:', error);
            });
    }

    // Chama a função para carregar as empresas assim que o DOM estiver pronto
    carregarEmpresas();
});