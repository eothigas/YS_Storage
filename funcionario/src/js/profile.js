// Função expandir menu
var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');
var logoR = document.querySelector('.logo-r'); // Seleciona o logo

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir'); // Alterna a classe expandir

    // Verifica se a classe expandir está presente e oculta ou mostra o logo
    if (menuSide.classList.contains('expandir')) {
        logoR.style.display = 'none'; // Oculta o logo quando expandido
    } else {
        logoR.style.display = 'grid'; // Mostra o logo quando contraído
    }
});

// Função para carregar os dados do dashboard
async function loadDashboardData() {
    try {
        const response = await fetch('get_profile.php');
        const profileData = await response.json();
        console.log('Dados do perfil:', profileData);

        
        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        // Preenche o segundo elemento de imagem
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; // Aqui você pode usar a mesma imagem ou uma diferente
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`; // Caso deseje manter a mesma informação, ou pode ser diferente
        
        // Preenche os dados do perfil
        const imgElement3 = document.getElementById('perfil-imagem');
        imgElement3.src = profileData.imagem; // Aqui você pode usar a mesma imagem ou uma diferente
        imgElement3.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement3.title = `src="${profileData.imagem}"`; // Caso deseje manter a mesma informação, ou pode ser diferente
        document.getElementById('nome').querySelector('p').innerText = profileData.nome_funcionario;
        document.getElementById('email').innerText = profileData.email;

    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});