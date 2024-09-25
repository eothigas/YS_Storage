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
        imgElement2.src = profileData.imagem; 
        imgElement2.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement2.title = profileData.imagem; 
        
        // Preenche os dados do perfil
        const imgElement3 = document.getElementById('perfil-imagem');
        imgElement3.src = profileData.imagem; 
        imgElement3.alt = `Imagem de ${profileData.nome_funcionario}`; 
        imgElement3.title = profileData.imagem; 

        // Atualiza nome e email
        document.getElementById('nome').innerText = profileData.nome_funcionario; // Atualiza o nome
        document.getElementById('email').innerText = profileData.email; // Atualiza o email

    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

// Função para abrir o modal
document.getElementById('open-modal-btn').addEventListener('click', function() {
    document.getElementById('alterar-dados-modal').style.display = 'block';
});

// Função para fechar o modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('alterar-dados-modal').style.display = 'none';
});

// Exibe a pré-visualização da imagem escolhida
document.getElementById('imagem').addEventListener('change', function(event) {
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

// Adiciona o evento ao botão de abrir o modal (pode ser um botão de "Editar Perfil" por exemplo)
document.getElementById('open-modal-btn').addEventListener('click', openModal);


document.getElementById('edit-profile-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    const fileInput = document.getElementById('imagemp'); // Input da imagem
    const file = fileInput.files[0]; // Obtém o arquivo da imagem selecionada
    const nome = document.getElementById('nome').value; // Captura o nome
    const email = document.getElementById('email').value; // Captura o email
    const novaSenha = document.getElementById('nova-senha').value; // Captura a nova senha
    const confirmarSenha = document.getElementById('confirmar-senha').value; // Captura a confirmação da senha

    // Verifica se as senhas coincidem (se novas senhas forem inseridas)
    if (novaSenha && novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    // Se não houver arquivo de imagem, apenas envia os dados sem o upload da imagem
    if (!file) {
        try {
            const response = await fetch('atualizar_imagem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    nova_senha: novaSenha
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Dados atualizados com sucesso!');
            } else {
                alert('Erro ao atualizar os dados: ' + data.message);
            }

        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
        }

        return; // Retorna sem fazer o upload da imagem
    }

    // Caso uma imagem tenha sido selecionada, faz o upload e depois atualiza no banco
    const apiKey = '8f24881f0b24b8e3cfc841f961542d38'; // Substitua por sua chave de API do Postimages/ImgBB
    const formData = new FormData();
    formData.append('image', file); // Adiciona o arquivo de imagem
    formData.append('key', apiKey); // Chave de API

    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            const imageUrl = data.data.url; // URL da imagem enviada
            console.log('Imagem enviada com sucesso: ', imageUrl);

            // Agora faz uma requisição para o PHP para atualizar os dados e a imagem
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
            if (updateData.success) {
                alert('Dados e imagem atualizados com sucesso!');
            } else {
                alert('Erro ao atualizar os dados: ' + updateData.message);
            }

        } else {
            alert('Erro ao enviar a imagem: ' + data.error.message);
        }
    } catch (error) {
        console.error('Erro ao fazer o upload:', error);
    }
});