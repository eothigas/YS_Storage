// Verificação de sessão
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});

// Checagem de sessão (usuário logado?)
async function checkSession() {
    try {
        const response = await fetch('/funcionario/php/check_session.php'); // Script PHP para verificar e criar sessão
        if (!response.ok) {
            throw new Error('Erro ao verificar a sessão');
        }
        const data = await response.json();
        
        if (!data.loggedIn) { 
            window.location.href = '/funcionario/index.html'; // Redireciona se não estiver logado
        } else {
            resetInactivityTimer(); // Reseta o temporizador de inatividade se estiver logado
        }
    } catch (error) {
        console.error('Erro na verificação da sessão:', error);
    }
}

// Função para lidar com o logout
async function handleLogout() {
    await fetch('/funcionario/php/logout.php', { method: 'POST' }); // Invalida a sessão no servidor
    window.location.href = '/funcionario/index.html'; // Redireciona para a página de login
}

// Configura o cronômetro de inatividade
let inactivityTimer;
const inactivityTime = 40 * 60 * 1000; // 2.400.000 = 40 minutos em milissegundos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('Você foi desconectado por inatividade.'); // Mensagem direta do navegador
        window.location.href = '/funcionario/index.html'; // Ao clicar em OK, redireciona
        handleLogout(); // Destrói a sessão
    }, inactivityTime);
}

// Adiciona ouvintes de eventos para detectar atividade do usuário
document.addEventListener('mousemove', resetInactivityTimer); // Se mover o mouse (estando com a guia selecionada)
document.addEventListener('keypress', resetInactivityTimer); // Se teclar any tecla (estando com a guia selecionada)

// Adiciona ouvintes de eventos para o botão de logout (botão de sair no menu-lateral)
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout); // Chama a função handleLogout
}