document.addEventListener('DOMContentLoaded', () => {
    // Função para obter os dados do usuário
    fetch('/funcionario/php/dashboard/profile/data_profile.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
            document.getElementById('username').textContent = data.nome;
            
            // Verifica se a URL da imagem está presente na resposta
            if (data.imagem) {
                document.getElementById('img-profile').src = data.imagem; // A URL completa da imagem será atribuída aqui
            } else {
                console.log('Imagem não encontrada');
            }
            } else {
            // Caso o usuário não esteja logado ou a sessão tenha expirado
            alert(data.error || 'Erro desconhecido');
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
        });
});
