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