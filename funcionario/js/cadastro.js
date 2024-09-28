// Função expandir menu e rotacionar botão
document.getElementById('btn-exp').addEventListener('click', function() {
    document.querySelector('.menu-lateral').classList.toggle('expandir'); // Alterna a expansão do menu
    this.classList.toggle('rotacionado'); // Alterna a rotação do botão
});

// Função para carregar os dados na home
async function loadDashboardData() {
    try {
        const response = await fetch('/funcionario/php/get_profile.php');
        const profileData = await response.json();

        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        // Preenche o elemento de imagem (perfil no menu lateral)
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem;
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`;
        
    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

// Função ver senha
function togglePasswordVisibility(toggleId, inputId) {
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