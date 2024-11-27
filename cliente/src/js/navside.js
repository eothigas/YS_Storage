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
    sideBar.style.left = '-242px'; // Move o sidebar para fora da tela
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