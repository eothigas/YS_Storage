document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData(); //  Carregar dados na home
    fetchClientes(); // Buscar 5 usuários na tabela usuários e exibir 
});

// Função expandir menu e rotacionar botão
document.getElementById('btn-exp').addEventListener('click', function() {
    document.querySelector('.menu-lateral').classList.toggle('expandir'); // Alterna a expansão do menu
    this.classList.toggle('rotacionado'); // Alterna a rotação do botão
});

// Função para carregar os dados na home
async function loadDashboardData() {
    try {
        const response = await fetch('/funcionario/php/get_profile.php');
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            console.error('Erro ao acessar o PHP:', response.statusText);
            return; // Retorna aqui para evitar continuar a execução
        }

        // Lê a resposta como JSON apenas uma vez
        const profileData = await response.json();

        // Verifica se houve erro nos dados recebidos
        if (profileData.error) {
            console.error(profileData.error);
            return;
        }

        // Atualiza a interface com os dados do funcionário
        document.getElementById('welcome-message').innerText = `Olá ${profileData.nome_funcionario}!`;
        
        const imgElement = document.getElementById('perfil-imagens');
        imgElement.src = profileData.imagem; 
        imgElement.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement.title = profileData.imagem; 
        
        document.getElementById('perfil-nome').querySelector('h2').innerText = profileData.nome_funcionario;

        // Preenche o segundo elemento de imagem (perfil menu-lateral)
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; // Pode usar a mesma imagem ou uma diferente
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Func Perfil`; 
        imgElement2.title = profileData.imagem; // Caso deseje manter a mesma informação
        
    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

// Função para buscar dados dos clientes
async function fetchClientes() {
    try {
        const response = await fetch('/funcionario/php//get_clients.php');
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

// Função para exibir clientes na tabela (máximo 5)
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

// Abrir menu de cadastramento
const navMenu = document.querySelector('nav.menu-lateral');
const register = document.getElementById('register');
const submenu = register.querySelector('.submenu');
const btnExp = document.getElementById('btn-exp');
const liConsulta = document.getElementById('li-consulta');

// Abre o submenu ao passar o mouse sobre o item `register`
register.addEventListener('mouseover', function(event) {
    event.stopPropagation(); // Impede que o hover afete outros elementos

    // Expande o menu lateral e ativa .rotacionado no botão
    navMenu.classList.add('expandir');
    submenu.style.display = 'flex';
    btnExp.classList.add('rotacionado'); // Ativa a classe rotacionado no btn-exp
    liConsulta.style.opacity = '0'; // Define a opacidade do li-consulta para 0
});

// Fecha o submenu quando o mouse sai de `register`
register.addEventListener('mouseout', function(event) {
    submenu.style.display = 'none';
    liConsulta.style.opacity = '1'; // Restaura a opacidade de li-consulta
});

// Fecha o submenu se o menu lateral não tiver a classe .expandir
document.addEventListener('click', function(event) {
    if (!navMenu.classList.contains('expandir')) {
        submenu.style.display = 'none';
        btnExp.classList.remove('rotacionado'); // Remove a classe rotacionado do btn-exp
        liConsulta.style.opacity = '1'; // Restaura a opacidade de li-consulta
    }
});
