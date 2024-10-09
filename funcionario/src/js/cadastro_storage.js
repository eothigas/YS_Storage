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

// Atualiza o preview da imagem quando um arquivo é selecionado
document.getElementById('imagemp').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagem-preview');

    if (file) {
        const reader = new FileReader();
        
        // Quando a leitura do arquivo for concluída, atualiza o src da imagem
        reader.onload = function(e) {
            preview.src = e.target.result;
        }

        // Lê o arquivo como uma URL de dados
        reader.readAsDataURL(file);
    } else {
        // Se nenhum arquivo for selecionado, define a imagem de preview como vazia
        preview.src = '';
    }
});

// Nomenclatura dos ID's
const navMenu = document.querySelector('nav.menu-lateral');
const register = document.getElementById('register');
const submenu = register.querySelector('.submenu');
const liConsulta = document.getElementById('li-consulta');
const btnExp = document.getElementById('btn-exp');
const modify = document.getElementById('modify'); // Seleciona o elemento modify

// Abre o submenu ao passar o mouse sobre o item `register`
register.addEventListener('mouseover', function(event) {
    event.stopPropagation(); // Impede que o hover afete outros elementos

    // Expande o menu lateral e ativa .rotacionado no botão
    navMenu.classList.add('expandir');
    submenu.style.display = 'flex';
    btnExp.classList.add('rotacionado'); // Ativa a classe rotacionado no btn-exp
    liConsulta.style.opacity = '0'; // Define a opacidade do li-consulta para 0

    // Verifica se modify existe antes de aplicar o estilo
    if (modify) {
        modify.style.backgroundColor = 'transparent'; // Torna o fundo do modify transparente
    }
});

// Fecha o submenu quando o mouse sai de `register`
register.addEventListener('mouseout', function(event) {
    submenu.style.display = 'none';
    liConsulta.style.opacity = '1'; // Restaura a opacidade de li-consulta

    // Verifica se modify existe antes de aplicar o estilo
    if (modify) {
        modify.style.backgroundColor = ''; // Restaura a cor de fundo padrão de modify
    }
});

// Fecha o submenu se o menu lateral não tiver a classe .expandir
document.addEventListener('click', function(event) {
    if (!navMenu.classList.contains('expandir')) {
        submenu.style.display = 'none';
        btnExp.classList.remove('rotacionado'); // Remove a classe rotacionado do btn-exp
        liConsulta.style.opacity = '1'; // Restaura a opacidade de li-consulta

        // Verifica se modify existe antes de aplicar o estilo
        if (modify) {
            modify.style.backgroundColor = ''; // Restaura a cor de fundo padrão de modify
        }
    }
});

// Mostrar mensagem
document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(this);

    fetch('/funcionario/php/cadastrar_storage.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = data.message; // Atualiza a div com a mensagem recebida
        messageContainer.style.display = 'block'; // Mostra a div se estiver oculta

        // Remove classes anteriores
        messageContainer.classList.remove('success', 'error');

        // Adiciona a classe correspondente ao status
        if (data.status === 'success') {
            messageContainer.classList.add('success');
        } else {
            messageContainer.classList.add('error');
        }

        // Limpa o formulário após o sucesso
        if (data.status === 'success') {
            document.getElementById('edit-form').reset(); // Limpa o formulário
            document.getElementById('imagem-preview').src = ''; // Limpa a imagem de pré-visualização
        }

        // Timeout para esconder a mensagem após 5 segundos
        setTimeout(() => {
            messageContainer.style.display = 'none'; // Esconde a mensagem
        }, 5000); // 5000 milissegundos = 5 segundos
    })
    .catch(error => {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = 'Erro ao processar a solicitação.';
        messageContainer.style.display = 'block';
        messageContainer.classList.add('error'); // Adiciona a classe de erro

        // Timeout para esconder a mensagem após 5 segundos
        setTimeout(() => {
            messageContainer.style.display = 'none'; // Esconde a mensagem
        }, 5000); // 5000 milissegundos = 5 segundos
    });
});