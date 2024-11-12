document.querySelector('.editar-funcionario').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Cria um objeto FormData com os dados do formulário
    const formData = new FormData(this);

    // Envia os dados via AJAX com Fetch API
    fetch('.././php/editar/funcionario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const notification = document.querySelector('.notification');
        const notificationBody = document.querySelector('.notification_body');
        let icone = ''; // Variável para o ícone da notificação

        // Remove todas as classes de notificação anteriores
        notification.classList.remove('notification--alert', 'notification--error', 'notification--success');

        // Define o ícone e a classe com base no tipo da notificação
        switch (data.status) {
            case 'error':
                icone = "<i class='bi bi-x-circle'></i> "; // Ícone de erro
                notification.classList.add('notification--error');
                break;
            case 'success':
                icone = "<i class='bi bi-check-circle'></i> "; // Ícone de sucesso
                notification.classList.add('notification--success');
                break;
            case 'alert':
                icone = "<i class='bi bi-exclamation-circle'></i> "; // Ícone de alerta
                notification.classList.add('notification--alert');
                break;
            default:
                return; // Tipo desconhecido, não exibir nada
        }

        // Define a mensagem com o ícone na notificação
        notificationBody.innerHTML = `${icone}${data.message}`;

        // Exibe a notificação
        notification.style.display = 'flex';

        // Oculta a notificação após 5 segundos
        setTimeout(() => {
            notification.style.display = 'none';
            if (data.status === 'success') {
                location.reload(); // Recarrega a página apenas se for sucesso
            }
        }, 5300);
    })
    .catch(error => {
        console.error('Error:', error);
        const notification = document.querySelector('.notification');
        const notificationBody = document.querySelector('.notification_body');
        notification.classList.remove('notification--success');
        notification.classList.add('notification--error');
        notificationBody.innerHTML = "<i class='bi bi-x-circle'></i> Ocorreu um erro inesperado.";
        notification.style.display = 'flex';
        
        // Oculta a notificação após 5 segundos
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5300);
    });
});
