// Função para atualizar o perfil do usuário com os dados da sessão
function atualizarPerfilUsuario() {
    fetch('./php/check_session.php')
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            // Verifica se os dados foram retornados corretamente
            if (data.status !== 'error') {
                // Preenche a imagem de perfil e o nome do usuário
                document.getElementById('img-profile').src = data.logo; // Atualiza o src da imagem
                document.getElementById('username').textContent = data.nome; // Atualiza o nome do usuário
            } else {
                console.error("Erro ao carregar dados da sessão: " + data.message);
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
}

// Carregar os dados do perfil do usuário quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    atualizarPerfilUsuario();
});