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


// Função expandir menu

var btnExp = document.querySelector('#btn-exp')
var menuSide = document.querySelector('.menu-lateral')

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir')
})

// Função para carregar os dados do dashboard
async function loadDashboardData() {
    try {
        // Checa se o funcionário está logado
        const sessionResponse = await fetch('check_session.php');
        const sessionData = await sessionResponse.json();

        // Verifica se o funcionário está logado
        if (sessionData.loggedIn) {
            // Faz uma requisição para buscar o nome e a imagem baseado no email da sessão
            const profileResponse = await fetch('get_profile.php');
            const profileData = await profileResponse.json();

            // Verifica se há algum erro na resposta
            if (profileData.error) {
                console.error(profileData.error);
                return;
            }

            // Atualiza a mensagem de boas-vindas
            document.getElementById('welcome-message').innerText = `Olá ${profileData.nome_funcionario}!`;

            // Atualiza a imagem do funcionário
            const imgElement = document.getElementById('perfil-imagens');
            imgElement.src = profileData.imagem; // Define o caminho da imagem no src
            imgElement.alt = `Imagem de ${profileData.nome_funcionario}`; // Define o texto alternativo
            imgElement.title = `src="${profileData.imagem}"`; // Adiciona um título com o link da imagem

            // Atualiza o nome do funcionário no <h2>
            const nomeElement = document.getElementById('perfil-nome').querySelector('h2');
            nomeElement.innerText = profileData.nome_funcionario;

        } else {
            console.error('Usuário não está autenticado.');
        }

    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

// Chama a função ao carregar o conteúdo da página
document.addEventListener('DOMContentLoaded', loadDashboardData);



document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar dados dos clientes
    function fetchClientes() {
        fetch('get_clients.php') // Substitua 'get_clients.php' pelo nome do seu script PHP
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && Array.isArray(data.data)) {
                    displayClientes(data.data);
                } else {
                    console.log(data.message || 'Nenhum dado retornado.');
                }
            })
            .catch(error => console.error('Erro:', error));
    }

    // Função para exibir clientes na tabela
    function displayClientes(clientes) {
        const tbody = document.querySelector('#total-usuarios tbody');
        tbody.innerHTML = ''; // Limpa o tbody antes de adicionar novos dados

        // Adiciona cada cliente à tabela
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.plano}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Carrega os dados dos clientes ao carregar a página
    fetchClientes();
});

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
    loadDashboardData();
    resetInactivityTimer();
};

document.onmousemove = resetInactivityTimer;
document.onkeypress = resetInactivityTimer;