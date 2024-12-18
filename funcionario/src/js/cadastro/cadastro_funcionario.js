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

//  Funções ver senha

document.getElementById('view').addEventListener('click', function() {
    const passwordInput = document.querySelector('.senha');
    const viewIcon = this;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        viewIcon.classList.remove('bi-eye-slash-fill');
        viewIcon.classList.add('bi-eye-fill');
    } else {
        passwordInput.type = 'password';
        viewIcon.classList.remove('bi-eye-fill');
        viewIcon.classList.add('bi-eye-slash-fill');
    }
});

document.getElementById('confirm').addEventListener('click', function() {
    const confirmPasswordInput = document.querySelector('.confirme-senha');
    const confirmIcon = this;

    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        confirmIcon.classList.remove('bi-eye-slash-fill');
        confirmIcon.classList.add('bi-eye-fill');
    } else {
        confirmPasswordInput.type = 'password';
        confirmIcon.classList.remove('bi-eye-fill');
        confirmIcon.classList.add('bi-eye-slash-fill');
    }
});

// Ver integridade da senha 

document.getElementById('passwordInput').addEventListener('input', function() {
    const password = this.value;
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');
    strengthBar.innerHTML = ''; // Clear previous strength
    strengthText.textContent = ''; // Clear previous text

    let strength = document.createElement('span');
    let strengthPercentage = (password.length / 8) * 100; // Calcula a porcentagem da força

    if (password.length > 0) {
        strength.style.width = strengthPercentage + '%';

        if (password.length < 4) {
            strength.classList.add('strength-weak');
            strengthText.textContent = 'Fraca';
        } else if (password.length >= 4 && password.length < 8) {
            strength.classList.add('strength-good');
            strengthText.textContent = 'Boa';
        } else if (password.length === 8) {
            strength.classList.add('strength-strong');
            strengthText.textContent = 'Ótima';
        }

        strengthBar.appendChild(strength);
    }
});

// Mostrar Preview de Imagem, e Prencher a prévia 

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
    const sobrenome = document.querySelector('.sobrenome').value;
    const identidade = document.querySelector('.identidade').value;
    const contato = document.querySelector('.contato').value;
    const email = document.querySelector('.email').value;

    document.getElementById('name-preview').innerText = `${nome} ${sobrenome}`;
    document.getElementById('id-preview').innerText = identidade;
    document.getElementById('contact-preview').innerText = contato;
    document.getElementById('email-preview').innerText = email;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.novo-funcionario');

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
