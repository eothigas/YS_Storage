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
    const identidade = document.querySelector('.identidade').value;
    const endereco = document.querySelector('.adress-enterprise').value;
    const plano = document.querySelector('.plan-select').value;
    const contato = document.querySelector('.contato').value;
    const email = document.querySelector('.email').value;

    document.getElementById('name-preview').innerText = nome;
    document.getElementById('id-preview').innerText = identidade;
    document.getElementById('adress-preview').innerText = endereco;
    document.getElementById('plan-preview').innerText = plano;
    document.getElementById('contact-preview').innerText = contato;
    document.getElementById('email-preview').innerText = email;
}