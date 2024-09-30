function toggleMenu() {
    var menu = document.getElementById("menuLateral");
    var content = document.querySelector(".config-container");
    var menuIcon = document.querySelector("#btn-menu");
    var closeIcon = document.querySelector("#btn-close");

    // Alterna a classe 'fechado' no menu lateral
    menu.classList.toggle("fechado");
    content.classList.toggle("expanded");

    // Alterna a exibição dos ícones
    menuIcon.style.display = menu.classList.contains("fechado") ? "inline" : "none";
    closeIcon.style.display = menu.classList.contains("fechado") ? "none" : "inline";
}

// Abrir modal
function openModal() {
    document.getElementById('modal').style.display = 'flex';
    openTab({ currentTarget: document.getElementById('dados-inicio') }, 'dados');
}

function openModalUser() {
    document.getElementById('modal-usuarios').style.display = 'flex';
}

// Fechar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function closeModalUser() {
    document.getElementById('modal-usuarios').style.display = 'none';
}

// Sistema de abas
function openTab(evt, tabName) {
    // Esconde todas as tabs
    let tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    // Remove a classe 'active' de todos os botões
    let tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    // Mostra a aba clicada e adiciona a classe 'active' no botão correspondente
    document.getElementById(tabName).style.display = 'grid';
    evt.currentTarget.className += ' active';
}

// Requisitos senha
function showFontsizeText() {
    document.querySelector('.fontsize-text').style.display = 'inline-block';
}

function showFontsizeTextConfirm() {
    document.querySelector('.fontsize-text-confirm').style.display = 'inline-block';
}

function hideFontsizeText() {
    document.querySelector('.fontsize-text').style.display = 'none';
}

function hideFontsizeTextConfirm() {
    document.querySelector('.fontsize-text-confirm').style.display = 'none';
}

function togglePasswordVisibility(toggleId, inputId) {
    console.log(`Toggling visibility for: ${inputId}`); // Para verificar se a função está sendo chamada
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Muda para texto
        toggleIcon.classList.remove('bi-eye-fill');
        toggleIcon.classList.add('bi-eye-slash-fill'); // Troca o ícone para "ocultar"
    } else {
        passwordInput.type = "password"; // Muda para senha
        toggleIcon.classList.remove('bi-eye-slash-fill');
        toggleIcon.classList.add('bi-eye-fill'); // Troca o ícone para "mostrar"
    }
}
