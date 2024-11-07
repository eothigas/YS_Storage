// Java Void
document.getElementById('back').addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do link
    window.history.back(); // Retorna à página anterior
});

// Clique na página de plano (retorna o valor do select)
document.addEventListener("DOMContentLoaded", function() {
    // Obtém o plano selecionado do localStorage
    const planoSelecionado = localStorage.getItem("planoSelecionado");

    if (planoSelecionado) {
        // Define o valor do <select> de acordo com o plano armazenado
        const selectPlano = document.getElementById("question");
        selectPlano.value = planoSelecionado;

        // Limpa o localStorage para evitar seleção persistente em visitas futuras
        localStorage.removeItem("planoSelecionado");
    }
});


document.getElementById('mensagem').addEventListener('input', function () {
    const maxLength = this.getAttribute('maxlength');
    const currentLength = this.value.length;
    const charRemaining = maxLength - currentLength;
    
    document.getElementById('charCount').textContent = `${charRemaining} caracteres restantes`;
});

const selectElement = document.getElementById('question');
const inputMessage = document.getElementById('input-message');
const containerForm = document.getElementById('container');
const boxLat = document.getElementById('caixa-esquerda');
const inputGroup = document.querySelector('.input-group');
const originalHeight = window.getComputedStyle(containerForm).height;
const originalHeightLat = window.getComputedStyle(boxLat).height;

// Função para atualizar a altura com base na largura da tela
function updateContainerHeight() {
    const isSmallScreen = window.matchMedia("(max-width: 940px)").matches;
    
    // Se for uma tela pequena, aplica '75%' como altura, caso contrário, retorna a altura original
    return isSmallScreen ? '95vh' : originalHeight;
}

// Atualizar a propriedade overflow-y da .input-group
function updateOverflowY(selectedValue) {
    const isSmallScreen = window.matchMedia("(max-width: 940px)").matches;
    
    // Aplica overflow-y: scroll se for uma das opções específicas, caso contrário, overflow-y: hidden
    if (selectedValue === 'duvidas_planos' || 
        selectedValue === 'duvidas_sistemas' || 
        selectedValue === 'outros_assuntos') {
        
        inputGroup.style.overflowY = 'scroll'; // Mostra a scrollbar quando for necessário
    } else {
        inputGroup.style.overflowY = 'hidden'; // Oculta a scrollbar caso contrário
    }
}

// Evento de mudança no select
selectElement.addEventListener('change', function() {
    const isSmallScreen = window.matchMedia("(max-width: 940px)").matches;

    if (this.value === 'duvidas_planos' || this.value === 'duvidas_sistemas' || this.value === 'outros_assuntos') {
        inputMessage.style.display = 'flex';
        containerForm.style.height = isSmallScreen ? '95vh' : originalHeight;
        boxLat.style.height = '100dvh';
    } else {
        inputMessage.style.display = 'none';
        containerForm.style.height = updateContainerHeight();
        boxLat.style.height = originalHeightLat;
    }
    
    // Atualiza a propriedade overflow-y da .input-group com base na seleção
    updateOverflowY(this.value);
});

// Atualiza a altura e o overflow-y ao redimensionar a janela
window.addEventListener('resize', function() {
    containerForm.style.height = updateContainerHeight();
    
    // Atualiza o overflow-y da .input-group ao redimensionar (baseado na seleção atual)
    updateOverflowY(selectElement.value);
});

// Chamada inicial para configurar o overflow-y corretamente com base na seleção atual
updateOverflowY(selectElement.value);

function formatPhone(input) {
    // Remove tudo que não é número
    const cleaned = ('' + input.value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    
    if (match) {
        input.value = `(${match[1]}) ${match[2]}-${match[3]}`;
    } else {
        input.value = cleaned; // Mantém o valor limpo se não corresponder ao padrão
    }
}

function isValidCPF(cpf) {
    // Remove tudo que não é número
    const cleaned = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleaned.charAt(i - 1)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9))) return false;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleaned.charAt(i - 1)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(10))) return false;

    return true; // CPF válido
}

function isValidCNPJ(cnpj) {
    // Remove tudo que não é número
    const cleaned = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (cleaned.length !== 14) return false;

    // Validação dos dígitos verificadores
    let size = cleaned.length - 2;
    let digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += cleaned.charAt(size - i) * (pos--);
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size += 1;
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += cleaned.charAt(size - i) * (pos--);
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true; // CNPJ válido
}

async function formatCNPJCPF(input) {
    // Remove tudo que não é número
    const cleaned = ('' + input.value).replace(/\D/g, '');

    // Se não houver nenhum número, limpa o valor
    if (cleaned.length === 0) {
        input.value = '';
        return; // Sai da função
    }

    let formatted = '';

    if (cleaned.length <= 11) {
        // Formatação para CPF
        formatted += cleaned.slice(0, 3); // Primeiro bloco
        if (cleaned.length > 3) {
            formatted += '.' + cleaned.slice(3, 6); // Segundo bloco
        }
        if (cleaned.length > 6) {
            formatted += '.' + cleaned.slice(6, 9); // Terceiro bloco
        }
        if (cleaned.length > 9) {
            formatted += '-' + cleaned.slice(9, 11); // Dígitos verificadores
        }
    } else {
        // Formatação para CNPJ
        formatted += cleaned.slice(0, 2); // Primeiro bloco
        formatted += '.' + cleaned.slice(2, 5); // Segundo bloco
        formatted += '.' + cleaned.slice(5, 8); // Terceiro bloco
        formatted += '/' + cleaned.slice(8, 12); // Quarto bloco
        if (cleaned.length > 12) {
            formatted += '-' + cleaned.slice(12, 14); // Dígitos verificadores
        }
    }

    // Atualiza o valor do input com a formatação correta
    input.value = formatted;
}

// Função de validação que deve ser chamada ao perder o foco
async function validateCNPJCPF(input) {
    const cleaned = ('' + input.value).replace(/\D/g, '');

    // Se não houver nenhum número, limpa o valor
    if (cleaned.length === 0) {
        input.value = '';
        return; // Sai da função
    }

    // Verifica e valida CPF
    if (cleaned.length <= 11) {
        if (!isValidCPF(cleaned)) {
            alert('CPF inválido');
            input.value = ''; // Limpa o campo se o CPF for inválido
            return;
        }
    } 
    // Verifica e valida CNPJ
    else {
        if (!isValidCNPJ(cleaned)) {
            alert('CNPJ inválido');
            input.value = ''; // Limpa o campo se o CNPJ for inválido
            return;
        }
    }
}