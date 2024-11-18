document.addEventListener('DOMContentLoaded', () => {
    fetch('.././php/check_session.php')
        .then(response => response.json())
        .then(data => {
            const idSessao = data.id; // O ID da sessão retornado pelo PHP

            function verificarID(idFuncionario) {
                return idFuncionario === idSessao;
            }

            const statusField = document.querySelector('.status-select');
            const emailField = document.querySelector('.email');
            const tooltipStatus = statusField.closest('.status-input').querySelector('.tooltip');
            const tooltipEmail = emailField.closest('.email-funcionario').querySelector('.tooltip');

            // Adiciona o evento de hover para o campo de status
            statusField.addEventListener('mouseover', function() {
                const idFuncionario = statusField.closest('form').querySelector('[name="id_funcionario"]').value;
                if (verificarID(idFuncionario)) {
                    tooltipStatus.style.visibility = 'visible'; // Exibe o tooltip
                    tooltipStatus.style.opacity = 1;
                }
            });

            // Adiciona o evento de hover para o campo de email
            emailField.addEventListener('mouseover', function() {
                const idFuncionario = emailField.closest('form').querySelector('[name="id_funcionario"]').value;
                if (verificarID(idFuncionario)) {
                    tooltipEmail.style.visibility = 'visible'; // Exibe o tooltip
                    tooltipEmail.style.opacity = 1;
                }
            });

            // Remove o tooltip quando o mouse sair
            statusField.addEventListener('mouseout', function() {
                tooltipStatus.style.visibility = 'hidden';
                tooltipStatus.style.opacity = 0;
            });

            emailField.addEventListener('mouseout', function() {
                tooltipEmail.style.visibility = 'hidden';
                tooltipEmail.style.opacity = 0;
            });

            document.querySelector('.editar-funcionario').addEventListener('submit', function(event) {
                event.preventDefault();

                const formData = new FormData(this);

                fetch('.././php/editar/funcionario.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    const notification = document.querySelector('.notification');
                    const notificationBody = document.querySelector('.notification_body');
                    let icone = '';

                    notification.classList.remove('notification--alert', 'notification--error', 'notification--success');

                    switch (data.status) {
                        case 'error':
                            icone = "<i class='bi bi-x-circle'></i> ";
                            notification.classList.add('notification--error');
                            break;
                        case 'success':
                            icone = "<i class='bi bi-check-circle'></i> ";
                            notification.classList.add('notification--success');
                            break;
                        case 'alert':
                            icone = "<i class='bi bi-exclamation-circle'></i> ";
                            notification.classList.add('notification--alert');
                            break;
                        default:
                            return;
                    }

                    notificationBody.innerHTML = `${icone}${data.message}`;
                    notification.style.display = 'flex';

                    setTimeout(() => {
                        notification.style.display = 'none';
                        if (data.status === 'success') {
                            location.reload();
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
                    
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 5300);
                });
            });
        })
        .catch(error => {
            console.error('Erro ao obter o ID da sessão:', error);
        });
});