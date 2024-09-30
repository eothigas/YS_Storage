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

// Fechar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
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