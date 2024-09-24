document.addEventListener('DOMContentLoaded', () => {

    loadDashboardData();
    fetchClientes();

});

// Função expandir menu
document.getElementById('btn-exp').addEventListener('click', () => {
    document.querySelector('.menu-lateral').classList.toggle('expandir');
});

// Função para carregar os dados do dashboard
async function loadDashboardData() {
    try {
        const response = await fetch('get_profile.php');
        const profileData = await response.json();
        
        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        document.getElementById('welcome-message').innerText = `Olá ${profileData.nome_funcionario}!`;
        const imgElement = document.getElementById('perfil-imagens');
        imgElement.src = profileData.imagem; 
        imgElement.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement.title = `src="${profileData.imagem}"`; 
        document.getElementById('perfil-nome').querySelector('h2').innerText = profileData.nome_funcionario;

        // Preenche o segundo elemento de imagem
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; // Aqui você pode usar a mesma imagem ou uma diferente
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Func Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`; // Caso deseje manter a mesma informação, ou pode ser diferente
        
    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

// Função para buscar dados dos clientes
async function fetchClientes() {
    try {
        const response = await fetch('get_clients.php');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
            displayClientes(data.data);
        } else {
            console.log(data.message || 'Nenhum dado retornado.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para exibir clientes na tabela
function displayClientes(clientes) {
    const tbody = document.querySelector('#total-usuarios tbody');
    tbody.innerHTML = ''; // Limpa o tbody antes de adicionar novos dados

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
