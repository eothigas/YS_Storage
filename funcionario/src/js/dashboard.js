// Seleciona os ícones e o sidebar
const closeSide = document.getElementById('close-side');
const openSide = document.getElementById('open-side');
const sideBar = document.getElementById('sidebar');

// Função para abrir o sidebar
closeSide.onclick = function () {
    sideBar.style.left = '0'; // Mover o sidebar para a posição inicial
    closeSide.style.display = 'none'; // Oculta o ícone de fechar
    openSide.style.display = 'flex'; // Exibe o ícone de abrir
    openSide.style.zIndex = '2'; // Exibe o ícone de abrir
};

// Função para abrir o sidebar
openSide.onclick = function () {
    sideBar.style.left = '-220px'; // Move o sidebar para fora da tela
    closeSide.style.display = 'flex'; // Exibe o ícone de fechar
    openSide.style.display = 'none'; // Oculta o ícone de abrir
    openSide.style.zIndex = '1'; // Oculta o ícone de abrir
};

// Abrir configs de usuário
document.getElementById('arrow').onclick = function(event) {
    const modalUser = document.querySelector('.modal-user');
    modalUser.style.display = modalUser.style.display === "flex" ? "none" : "flex";
    document.getElementById('arrow').classList.toggle('rotate');
    
    // Impede que o evento clique no "arrow" feche o modal imediatamente
    event.stopPropagation(); 
};

// Fecha o modal se clicar fora dele
document.addEventListener('click', function(event) {
    const modalUser = document.querySelector('.modal-user');
    const arrow = document.getElementById('arrow');
    
    if (modalUser.style.display === "flex" && !modalUser.contains(event.target) && event.target !== arrow) {
        modalUser.style.display = "none";
        arrow.classList.remove('rotate');
    }
});

// Seleciona os elementos para os dois submenus
const openSubRegister = document.getElementById("side_submenu");
const openDownRegister = document.getElementById("open-down-register");
const spanSubRegister = document.getElementById("open_sub");
const downIconRegister = spanSubRegister.querySelector(".down"); // Ícone para rotação

const openSubConsult = document.getElementById("side_submenu_");
const openDownConsult = document.getElementById("open-down-consult");
const spanSubConsult = document.getElementById("open_sub_consult");
const downIconConsult = spanSubConsult.querySelector(".down"); // Ícone para rotação

// Função para mostrar o submenu de registro com animação suave
function showRegisterSubMenu() {
    openDownRegister.classList.add("show");
    spanSubRegister.style.backgroundColor = "rgb(226, 226, 182)";
    spanSubRegister.style.color = "rgb(3, 52, 110)";
    downIconRegister.classList.add("rotate"); // Adiciona rotação ao ícone
}

// Função para ocultar o submenu de registro e remover os estilos
function hideRegisterSubMenu() {
    openDownRegister.classList.remove("show");
    spanSubRegister.style.backgroundColor = "";
    spanSubRegister.style.color = "";
    downIconRegister.classList.remove("rotate"); // Remove rotação do ícone
}

// Função para mostrar o submenu de consulta com animação suave
function showConsultSubMenu() {
    openDownConsult.classList.add("show");
    spanSubConsult.style.backgroundColor = "rgb(226, 226, 182)";
    spanSubConsult.style.color = "rgb(3, 52, 110)";
    downIconConsult.classList.add("rotate"); // Adiciona rotação ao ícone
}

// Função para ocultar o submenu de consulta e remover os estilos
function hideConsultSubMenu() {
    openDownConsult.classList.remove("show");
    spanSubConsult.style.backgroundColor = "";
    spanSubConsult.style.color = "";
    downIconConsult.classList.remove("rotate"); // Remove rotação do ícone
}

// Evento de clique para exibir ou ocultar o submenu de registro
openSubRegister.addEventListener("click", (event) => {
    event.stopPropagation();
    if (openDownRegister.classList.contains("show")) {
        hideRegisterSubMenu();
    } else {
        showRegisterSubMenu();
    }
});

// Evento de clique para exibir ou ocultar o submenu de consulta
openSubConsult.addEventListener("click", (event) => {
    event.stopPropagation();
    if (openDownConsult.classList.contains("show")) {
        hideConsultSubMenu();
    } else {
        showConsultSubMenu();
    }
});

// Evento de clique fora dos submenus para escondê-los
document.addEventListener("click", (event) => {
    if (
        !openSubRegister.contains(event.target) &&
        !openDownRegister.contains(event.target) &&
        (spanSubRegister && !spanSubRegister.contains(event.target))
    ) {
        hideRegisterSubMenu();
    }
    if (
        !openSubConsult.contains(event.target) &&
        !openDownConsult.contains(event.target) &&
        (spanSubConsult && !spanSubConsult.contains(event.target))
    ) {
        hideConsultSubMenu();
    }
});