// Função expandir menu e rotacionar botão
document.getElementById('btn-exp').addEventListener('click', function() {
    document.querySelector('.menu-lateral').classList.toggle('expandir'); // Alterna a expansão do menu
    this.classList.toggle('rotacionado'); // Alterna a rotação do botão
});

// Div mensagens sucesso/erro
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = ''; // Limpa mensagens anteriores

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // Adiciona a classe de acordo com o tipo
    if (type === 'success') {
        messageDiv.classList.add('success'); // Adiciona a classe 'success'
    } else if (type === 'error') {
        messageDiv.classList.add('error'); // Adiciona a classe 'error'
    }

    messageContainer.appendChild(messageDiv);

    // Mensagem desaparece depois dos segundos definidos
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 5000); // Remove após 5 segundos
}


// Função para carregar os dados na home
async function loadDashboardData() {
    try {
        const response = await fetch('/funcionario/php/get_profile.php');
        const profileData = await response.json();

        if (profileData.error) {
            console.error(profileData.error);
            showMessage(profileData.error, 'error'); // Mostra mensagem de erro
            return;
        }

        // Preenche a imagem do perfil (campo da direita, nos dados do funcionario)
        const imgElement = document.getElementById('perfil-imagem');
        imgElement.src = profileData.imagem; 
        imgElement.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement.title = profileData.imagem; 

        // Preenche o segundo elemento de imagem (perfil menu-lateral)
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; 
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = profileData.imagem; 

        // Atualiza nome e email nos elementos do perfil
        document.getElementById('nam').innerText = profileData.nome_funcionario; 
        document.getElementById('eml').innerText = profileData.email; 

        // Atualiza nome e email nos inputs do formulário (quando abre o modal de edição)
        document.getElementById('name').value = profileData.nome_funcionario; 
        document.getElementById('e-mail').value = profileData.email; 

    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
        showMessage('Erro ao carregar os dados do funcionário: ' + error.message, 'error'); 
    }
}

// Chama a função para carregar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', loadDashboardData);

// Função para abrir o modal
document.getElementById('open-modal-btn').addEventListener('click', function() {
    document.getElementById('alterar-dados-modal').style.display = 'block';
});

// Função para fechar o modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('alterar-dados-modal').style.display = 'none';
});

// Exibe a pré-visualização da imagem escolhida
document.getElementById('imagemp').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtém o arquivo de imagem selecionado
    const imgPreview = document.getElementById('imagem-preview'); // Obtém o elemento img para pré-visualização

    if (file) {
        const reader = new FileReader(); // Cria um FileReader para ler o arquivo

        reader.onload = function(e) {
            imgPreview.src = e.target.result; // Define o src da imagem como o resultado da leitura do arquivo
            imgPreview.style.display = 'block'; // Exibe a imagem no modal
        }

        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    } else {
        imgPreview.style.display = 'none'; // Esconde a imagem se nenhum arquivo for selecionado
    }
});

// Editar dados de perfil
document.getElementById('edit-profile-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    const fileInput = document.getElementById('imagemp'); // Input da imagem
    const file = fileInput.files[0]; // Obtém o arquivo da imagem selecionada
    const nome = document.getElementById('name').value; // Captura o nome
    const email = document.getElementById('e-mail').value; // Captura o email
    const novaSenha = document.getElementById('password').value; // Captura a nova senha, se fornecida
    let imageUrl = null; // Inicializa a variável para armazenar a URL da imagem

    // Verifica se o nome e email não estão vazios
    if (!nome || !email) {
        showMessage('Por favor, preencha o nome e o email.', 'error');
        return; // Não prossegue se os campos obrigatórios não forem preenchidos
    }

    // Se um arquivo de imagem foi selecionado, faz o upload para o servidor
    if (file) {
        const formData = new FormData();
        formData.append('imagem', file); // Adiciona o arquivo de imagem

        try {
            const response = await fetch('/funcionario/php/upload_img.php', { // Script PHP para upload de imagem em uma hospedagem de imagens (no caso, IMGUR)
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status === 'success') {
                imageUrl = data.data.link; // Armazena o link da imagem
            } else {
                console.error('Erro ao fazer upload:', data.message);
                showMessage('Erro ao fazer upload. Anexe somente arquivos JPG ou PNG', 'error'); // Mensagem de erro (upload de imagem)
                return; // Para a execução se o upload falhar
            }
        } catch (error) {
            console.error('Erro ao fazer o upload:', error);
            showMessage('Erro ao fazer o upload: ' + error.message, 'error');
            return;
        }
    }

    // Faz uma requisição PHP para atualizar os dados na tabela
    try {
        const updateResponse = await fetch('/funcionario/php/atualizar_funcionario.php', { // Script PHP de atualização
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email, 
                senha: novaSenha, // Envia nova senha (se for definida) ao PHP
                imagem: imageUrl // Envia a URL da imagem para o PHP
            })
        });

        const updateData = await updateResponse.json();

        // Se sucesso na atualização
        if (updateData.status === 'success') {
            showMessage('Dados atualizados com sucesso!', 'success');

            // Reinicia a página após 3 segundos
            setTimeout(function() {
                location.reload(); // Recarrega a página
            }, 5000); // 5000 = 5s

          // Se falha  
        } else {
            showMessage('Erro ao atualizar os dados: ' + updateData.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        showMessage('Erro ao enviar os dados: ' + error.message, 'error');
    }
});


// Função para mostrar/ocultar a senha
function togglePasswordVisibility(toggleId, inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Muda para text
        toggleIcon.classList.remove('bi-eye-fill');
        toggleIcon.classList.add('bi-eye-slash-fill'); // Troca o ícone para "ocultar"
    } else {
        passwordInput.type = "password"; // Muda para password
        toggleIcon.classList.remove('bi-eye-slash-fill');
        toggleIcon.classList.add('bi-eye-fill'); // Troca o ícone para "mostrar"
    }
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