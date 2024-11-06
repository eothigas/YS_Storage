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

function updatePreview() {
    // Nome e Sobrenome
    const nome = document.querySelector('.nome').value;
    const sobrenome = document.querySelector('.sobrenome').value;
    document.getElementById('name-preview').textContent = nome + ' ' + sobrenome;

    // Identidade
    const identidade = document.querySelector('.identidade').value;
    document.getElementById('id-preview').textContent = identidade;

    // Contato
    const contato = document.querySelector('.contato').value;
    document.getElementById('contact-preview').textContent = contato;

    // Empresa
    const enterprise = document.querySelector('.empresa').value;
    document.getElementById('enterprise-preview').innerText = enterprise;

    // Tipo
    const tipo = document.querySelector('.enterprise-select').value;
    document.getElementById('type-preview').textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);

    // Email
    const email = document.querySelector('.email').value;
    document.getElementById('email-preview').textContent = email;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.novo-cliente');

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