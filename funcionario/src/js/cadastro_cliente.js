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