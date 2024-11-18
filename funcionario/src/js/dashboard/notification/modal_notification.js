let currentPage = 1;  // Página inicial
const notificationsPerPage = 5;  // Número de notificações por página
let totalNotifications = 0;  // Total de notificações disponíveis

// Função para abrir o modal de notificações
function openModal() {
    document.getElementById('notificationsModal').style.display = 'flex';
    document.querySelector('#navbar').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    fetchInfosModal();  // Chama a função para carregar as infos
}

// Função para fechar o modal
function closeModalNote() {
    document.getElementById('notificationsModal').style.display = 'none';
    document.querySelector('#navbar').style.display = 'flex';
    document.querySelector('main').style.display = 'flex';
}

// Função para fechar o modal de orcamento
function closeModalOrc() {
    document.getElementById('orcamento-modal-note').style.display = 'none';
    document.getElementById('notificationsModal').style.display = 'flex';
}

// Função para pegar as infos e exibir no modal
function fetchInfosModal() {
    // Faz uma requisição para o arquivo PHP que retorna as notificações
    fetch(`https://www.yourstorage.x10.mx/funcionario/php/notification/notifications.php?page=${currentPage}&limit=${notificationsPerPage}`)  // Passando página e limite de notificações
        .then(response => response.json())
        .then(data => {
            // Adiciona um log para ver a estrutura do objeto retornado
            console.log(data);

            if (data.status === 'success') {
                const modalBody = document.querySelector('.modal-body');
                modalBody.innerHTML = ''; // Limpa o conteúdo existente

                // Atualiza o total de notificações
                totalNotifications = data.totalNotifications;

                // Exibe o "notão" com o número de notificações
                updateNotificationCount();

                // Verifica se a chave 'notifications' existe e se é um array
                if (Array.isArray(data.notifications) && data.notifications.length > 0) {
                    // Se houver notificações
                    data.notifications.forEach(notification => {
                        // Cria um elemento para cada notificação
                        const notificationElement = document.createElement('div');
                        notificationElement.classList.add('notification_modal');

                        // Se a notificação for do tipo "formulario", pega o id_orcamento e exibe o modal
                        if (notification.type === 'formulario') {
                            notificationElement.innerHTML = `
                                <h2>${notification.title}</h2>
                                <p>${notification.description}</p>
                                <button class='view-form' onclick="fetchAndDisplayOrcamento(${notification.id_orcamento})">Ver Formulário</button>
                            `;
                        } else {
                            // Caso contrário, exibe a notificação normalmente
                            notificationElement.innerHTML = `
                                <h2>${notification.title}</h2>
                                <p>${notification.description}</p>
                            `;
                        }

                        // Adiciona a notificação ao corpo do modal
                        modalBody.appendChild(notificationElement);
                    });
                    
                    // Ativa ou desativa os botões de navegação
                    updatePaginationButtons();
                } else {
                    // Caso não haja notificações ou a chave 'notifications' seja inválida
                    modalBody.innerHTML = '<p>Não há novas notificações.</p>';
                }
            } else {
                alert('Erro ao carregar as notificações');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar as informações:', error);
        });
}

// Função para buscar os dados do orçamento e exibir no modal
async function fetchAndDisplayOrcamento(orcamentoId) {
    try {
        console.log('Buscando dados do orçamento com id:', orcamentoId); // Log para depuração
        const response = await fetch(`https://www.yourstorage.x10.mx/funcionario/php/get_orcamento.php?id_orcamento=${orcamentoId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            displayOrcamentoData(data.result);
            document.getElementById('orcamento-modal-note').style.display = 'flex';  // Exibe o modal de orçamento
            document.getElementById('notificationsModal').style.display = 'none';  // Esconde o modal de notificações
        } else {
            console.error('Erro ao buscar dados do orçamento:', data.message);
        }
    } catch (error) {
        console.error('Erro ao buscar dados do orçamento:', error);
    }
}

// Função para exibir os dados do orçamento no modal
function displayOrcamentoData(orcamento) {
    const orcamentoArea = document.getElementById("orcamento-area-note");
    orcamentoArea.innerHTML = ""; // Limpa a área de orçamento

    if (!orcamento) {
        orcamentoArea.innerHTML = '<i class="bi bi-info-circle info-orcamento">Sem dados de orçamento disponíveis!</i>';
    } else {
        const orcamentoDiv = document.createElement("div");
        orcamentoDiv.classList.add("orcamento-item-note");

        const mensagem = (orcamento.mensagem === 'null' || orcamento.mensagem === null) 
            ? 'Mensagem não enviada' 
            : orcamento.mensagem;

        orcamentoDiv.innerHTML = `   
            <p><strong>Nome:</strong> ${orcamento.nome}</p>
            <p><strong>Email:</strong> ${orcamento.email}</p>
            <p><strong>Telefone:</strong> ${orcamento.telefone}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
            <p><strong>Empresa:</strong> ${orcamento.enterprise}</p>
            <p><strong>CNPJ ou CPF:</strong> ${orcamento.cnpj}</p>
            <p><strong>Motivo:</strong> ${orcamento.question}</p>
            <button class='send-email-note' type='button'><span>Enviar Email</span></button>
        `;

        const sendEmailButton = orcamentoDiv.querySelector('.send-email-note');
        sendEmailButton.addEventListener('click', function() {
            const email = orcamento.email;
            const subject = encodeURIComponent(`Recebimento de Formulário - ${orcamento.nome}`);
            window.location.href = `mailto:${email}?subject=${subject}`;
        });

        orcamentoArea.appendChild(orcamentoDiv);
    }
}

// Função para atualizar o "notão" (contador de notificações)
function updateNotificationCount() {
    const notificationCountElement = document.querySelector('.notification-count');
    
    if (notificationCountElement) {
        notificationCountElement.innerHTML = `Exibindo ${currentPage * notificationsPerPage - (notificationsPerPage - 1)} - ${Math.min(currentPage * notificationsPerPage, totalNotifications)} de ${totalNotifications} notificações`;
    }
}

// Função para atualizar os botões de navegação
function updatePaginationButtons() {
    const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

    // Desativa ou ativa os botões conforme a página atual
    document.getElementById('antButton').disabled = currentPage === 1;
    document.getElementById('proxButton').disabled = currentPage === totalPages;
}

// Função para alterar a página de notificações
function changePage(direction) {
    // Atualiza a página atual com base na direção (+1 ou -1)
    currentPage += direction;

    // Recarrega as notificações para a nova página
    fetchInfosModal();
}

// Função para carregar a página inicial de notificações ao abrir o modal
document.addEventListener('DOMContentLoaded', function() {
    // Ao abrir o modal, as notificações serão carregadas
    const openModalButton = document.getElementById('openModalButton');
    openModalButton.addEventListener('click', openModal);

    // Adiciona eventos para os botões de navegação de página
    const prevButton = document.getElementById('antButton');
    const nextButton = document.getElementById('proxButton');

    prevButton.addEventListener('click', function() {
        changePage(-1);  // Vai para a página anterior
    });

    nextButton.addEventListener('click', function() {
        changePage(1);  // Vai para a próxima página
    });
});
