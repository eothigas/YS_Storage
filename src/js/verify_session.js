// Verificação de sessão
document.addEventListener('DOMContentLoaded', () => {
    checkSession(); // Chama a função para verificar a sessão
});

// Função para verificar se o usuário está logado
async function checkSession() {
    const response = await fetch('check_session.php');
    const data = await response.json();
    
    if (!data.loggedIn) {
        window.location.href = 'index.html'; // Redireciona se não estiver logado
    } else {
        resetInactivityTimer(); // Reseta o temporizador de inatividade se estiver logado
    }
}

// Função para lidar com o logout
async function handleLogout() {
    await fetch('logout.php', { method: 'POST' }); // Invalida a sessão no servidor
    window.location.href = 'index.html'; // Redireciona para a página de login
}

// Configura o cronômetro de inatividade
let inactivityTimer;
const inactivityTime = 40 * 60 * 1000; // 40 minutos em milissegundos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('Você foi desconectado por inatividade.');
        window.location.href = 'index.html';
        handleLogout(); // Desconecta o usuário e redireciona
    }, inactivityTime);
}

// Adiciona ouvintes de eventos para detectar atividade do usuário
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);

// Adiciona ouvintes de eventos para o botão de logout
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout); // Chama a função handleLogout
}