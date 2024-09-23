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

// Função esconder logo

document.addEventListener('DOMContentLoaded', () => {
    const btnExpandir = document.querySelector('.btn-expandir');
    const menuLateral = document.querySelector('nav.menu-lateral');
    const logoR = document.querySelector('.logo-r');

    btnExpandir.addEventListener('click', () => {
        menuLateral.classList.toggle('expandir'); // Alterna a classe expandir
        if (menuLateral.classList.contains('expandir')) {
            logoR.style.display = 'none'; // Oculta o logo quando expandido
        } else {
            logoR.style.display = 'grid'; // Mostra o logo quando contraído
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;

    // Função para carregar os usuários da página atual
    function carregarUsuarios(page) {
        fetch(`consulta_usuarios.php?page=${page}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#total-usuarios tbody');
                tbody.innerHTML = ''; // Limpar conteúdo anterior

                // Verifica se há usuários retornados
                if (data.usuarios.length > 0) {
                    data.usuarios.forEach(usuario => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.plano}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement('tr');
                    tr.innerHTML = '<td colspan="3">Nenhum usuário encontrado.</td>';
                    tbody.appendChild(tr);
                }

                // Atualizar os botões de navegação
                document.getElementById('page-info').textContent = `Página ${data.current_page} de ${data.total_pages}`;

                // Desativar botões se necessário
                document.getElementById('prev-btn').disabled = (data.current_page === 1);
                document.getElementById('next-btn').disabled = (data.current_page === data.total_pages);
            })
            .catch(error => {
                console.error('Erro ao carregar os dados:', error);
            });
    }

    // Funções de navegação
    document.getElementById('prev-btn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            carregarUsuarios(currentPage);
        }
    });

    document.getElementById('next-btn').addEventListener('click', function() {
        currentPage++;
        carregarUsuarios(currentPage);
    });

    // Carregar a primeira página ao iniciar
    carregarUsuarios(currentPage);
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