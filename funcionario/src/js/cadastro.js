// Verificação de sessão

document.addEventListener('DOMContentLoaded', () => {
    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'index.html'; // Redireciona se não estiver logado
            }
        });
});

document.addEventListener('DOMContentLoaded', () => {
    // Verificação de sessão
    checkSession();
    loadDashboardData();

    // Configura o cronômetro de inatividade
    resetInactivityTimer();
});

// Função expandir menu

var btnExp = document.querySelector('#btn-exp')
var menuSide = document.querySelector('.menu-lateral')

btnExp.addEventListener('click', function() {
menuSide.classList.toggle('expandir')
})

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

// Função para lidar com o logout
async function handleLogout() {
    await invalidateSession(); // Invalida a sessão no servidor
    window.location.href = 'index.html'; // Redireciona para a página de login
}

//Função logout

    const logoutButton = document.getElementById('logout');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            fetch('logout.php', {
                method: 'POST'
            }).then(response => {
                if (response.ok) {
                    window.location.href = 'index.html'; // Redireciona após o logout
                }
            });
        });
    };


// Configura o cronômetro de inatividade
let inactivityTimer;
const inactivityTime = 40 * 60 * 1000; // 40 minutos em milissegundos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('Você foi desconectado por inatividade.');
        handleLogout(); // Desconecta o usuário e redireciona
    }, inactivityTime);
}

window.onload = function() {
    resetInactivityTimer();
};

document.onmousemove = resetInactivityTimer;
document.onkeypress = resetInactivityTimer;