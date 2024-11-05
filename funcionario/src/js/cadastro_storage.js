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