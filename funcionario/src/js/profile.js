// Função expandir menu
var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');
var logoR = document.querySelector('.logo-r'); // Seleciona o logo

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir'); // Alterna a classe expandir

    // Verifica se a classe expandir está presente e oculta ou mostra o logo
    if (menuSide.classList.contains('expandir')) {
        logoR.style.display = 'none'; // Oculta o logo quando expandido
    } else {
        logoR.style.display = 'grid'; // Mostra o logo quando contraído
    }
});

// Função para mostrar mensagens
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerText = message; // Define o texto da mensagem
    messageContainer.className = type; // Adiciona a classe de sucesso ou erro
    messageContainer.style.display = 'block'; // Mostra a mensagem

    // Oculta a mensagem após 3 segundos
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}

// Função para carregar os dados do dashboard
async function loadDashboardData() {
    try {
        const response = await fetch('get_profile.php');
        const profileData = await response.json();
        console.log('Dados do perfil:', profileData);

        if (profileData.error) {
            console.error(profileData.error);
            showMessage(profileData.error, 'error'); // Mostra mensagem de erro
            return;
        }

        // Preenche a imagem do perfil
        const imgElement = document.getElementById('perfil-imagem');
        imgElement.src = profileData.imagem; 
        imgElement.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement.title = profileData.imagem; 

        // Preenche o segundo elemento de imagem
        const imgElement2 = document.getElementById('func_perfil');
        imgElement2.src = profileData.imagem; // Aqui você pode usar a mesma imagem ou uma diferente
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario} - Funcionário Perfil`; 
        imgElement2.title = `src="${profileData.imagem}"`; // Caso deseje manter a mesma informação, ou pode ser diferente

        // Atualiza nome e email nos elementos do perfil
        document.getElementById('nam').innerText = profileData.nome_funcionario; // Atualiza o nome
        document.getElementById('eml').innerText = profileData.email; // Atualiza o email

        // Atualiza nome e email nos inputs do formulário
        document.getElementById('name').value = profileData.nome_funcionario; // Atualiza o nome no input
        document.getElementById('e-mail').value = profileData.email; // Atualiza o email no input

    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
        showMessage('Erro ao carregar os dados do funcionário: ' + error.message, 'error'); // Mostra mensagem de erro
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

document.getElementById('edit-profile-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    const fileInput = document.getElementById('imagemp'); // Input da imagem
    const file = fileInput.files[0]; // Obtém o arquivo da imagem selecionada
    const nome = document.getElementById('name').value; // Captura o nome
    const email = document.getElementById('e-mail').value; // Captura o email
    const novaSenha = document.getElementById('password').value; // Captura a nova senha, se fornecida

    // Adiciona log para depuração
    console.log('Nome:', nome);
    console.log('Email:', email);

    // Verifica se o nome e email não estão vazios
    if (!nome || !email) {
        showMessage('Por favor, preencha o nome e o email.', 'error');
        return; // Não prossegue se os campos obrigatórios não forem preenchidos
    }

    const apiKey = '7072f24e239a795'; // Sua chave de API do Imgur
    let imageUrl = null;

    // Se um arquivo de imagem foi selecionado, faz o upload
    if (file) {
        const formData = new FormData();
        formData.append('image', file); // Adiciona o arquivo de imagem

        try {
            const response = await fetch(`https://api.imgur.com/3/image`, {
                method: 'POST',
                headers: {
                    Authorization: `Client-ID ${apiKey}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                imageUrl = data.data.link; // URL da imagem enviada
            } else {
                showMessage('Erro ao enviar a imagem: ' + data.error.message, 'error');
                return;
            }
        } catch (error) {
            console.error('Erro ao fazer o upload:', error);
            showMessage('Erro ao fazer o upload: ' + error.message, 'error');
            return;
        }
    }

    // Faz uma requisição para o PHP para atualizar os dados
    try {
        const updateResponse = await fetch('atualizar_imagem.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                nova_senha: novaSenha,
                imagem: imageUrl // Envia a URL da imagem para o PHP
            })
        });

        const updateData = await updateResponse.json();
        console.log('Resposta do servidor:', updateData); // Para verificar a resposta do PHP

        if (updateData.success) {
            showMessage('Dados atualizados com sucesso!', 'success');

            // Reinicia a página após 3 segundos (3000 milissegundos)
            setTimeout(function() {
                location.reload(); // Recarrega a página
            }, 3000);
        } else {
            showMessage('Erro ao atualizar os dados: ' + updateData.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        showMessage('Erro ao enviar os dados: ' + error.message, 'error');
    }
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