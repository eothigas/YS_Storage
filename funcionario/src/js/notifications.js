// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
}

// Função para buscar notificações do servidor
async function fetchNotifications() {
    try {
        // Buscar notificações do servidor
        const notificationResponse = await fetch('/funcionario/php/notification/main_notification.php');
        const notificationData = await notificationResponse.json();

        console.log('Resposta das notificações:', notificationData);  // Depuração

        // Verificar se a resposta das notificações foi bem sucedida
        if (notificationData.status === 'success') {
            // Filtra as notificações para incluir apenas aquelas com status 'não lido'
            const unreadNotifications = notificationData.notifications.filter(notification =>
                notification.status === 'nao_lido'
            );

            console.log('Notificações não lidas:', unreadNotifications);  // Depuração

            // Se houver notificações não lidas, embaralha e exibe
            if (unreadNotifications.length > 0) {
                shuffleArray(unreadNotifications); // Embaralha as notificações
                displaySideNotifications(unreadNotifications.slice(0, 5)); // Limita a 5 notificações
            } else {
                displaySideNotifications([]); // Sem novas notificações
            }
        }
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
    }
}

// Função para exibir notificações na área lateral
function displaySideNotifications(notifications) {
    console.log('Exibindo notificações:', notifications); // Verifica o conteúdo das notificações
    const notificationsArea = document.getElementById("notifications-area");
    notificationsArea.innerHTML = ""; // Limpa a área de notificações

    if (notifications.length === 0) {
        notificationsArea.innerHTML = '<i class="bi bi-info-circle info-notification">Sem novas notificações!</i>';
    } else {
        notifications.forEach(notification => {
            console.log(notification);  // Verifica cada notificação sendo criada

            const notificationDiv = document.createElement("div");
            notificationDiv.classList.add("notification-item");

            // Adiciona o id_orcamento como uma classe no div
            notificationDiv.classList.add('orcamento-id-' + notification.id_orcamento);

             // Se o id_orcamento for maior que 1, adiciona o estilo de cursor pointer
            if (notification.id_orcamento > 1) {
                notificationDiv.style.cursor = "pointer";
            }

            // Imagem da notificação
            const img = document.createElement("img");
            // Verifica o tipo de notificação e define a imagem adequada
            img.src = notification.type === "formulario"
                ? "../funcionario/src/images/formulario.png"  // Caminho da imagem para o tipo "formulario"
                : "../funcionario/src/images/engine.png";      // Caminho da imagem padrão para outros tipos
            img.classList.add("notification-image");

            // Conteúdo da notificação
            const content = document.createElement("div");
            content.classList.add("notification-content");

            const title = document.createElement("p");
            title.classList.add("notification-title");
            title.textContent = notification.title;

            const description = document.createElement("p");
            description.classList.add("notification-description");
            description.textContent = notification.description;

            content.appendChild(title);
            content.appendChild(description);

            // Div para o botão "Marcar como Lido"
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("notification-button");

            // Botão "Lido"
            const markAsReadButton = document.createElement("button");
            markAsReadButton.classList.add("btn-mark-read");
            markAsReadButton.textContent = "Lido";

            // Ação de lido
            markAsReadButton.addEventListener("click", async () => {
                try {
                    const notificationId = notification.id_notification; // Pega o id da notificação corretamente
                    console.log("Marcando como lido a notificação com ID:", notificationId);

                    const response = await fetch('/funcionario/php/notification/notification_status.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ notification_id: notificationId }) // Envia o id da notificação
                    });

                    const data = await response.json();

                    if (data.status === 'success') {
                        console.log('Notificação marcada como lida');
                        fetchNotifications(); // Atualiza a lista de notificações
                    } else {
                        console.error('Erro ao atualizar o status da notificação:', data.message);
                    }
                } catch (error) {
                    console.error('Erro ao marcar a notificação como lida:', error);
                }
            });

            // Adiciona o botão ao container
            buttonContainer.appendChild(markAsReadButton);

            // Adiciona imagem, conteúdo e botão à notificação
            notificationDiv.appendChild(img);
            notificationDiv.appendChild(content);
            notificationDiv.appendChild(buttonContainer);

            // Adiciona a notificação na área de notificações
            notificationsArea.appendChild(notificationDiv);

            // Se for do tipo "formulario", adiciona o evento de abrir o modal
            if (notification.type === "formulario") {
                // Usa o id_orcamento extraído da classe
                notificationDiv.addEventListener("click", () => {
                    const orcamentoId = notification.id_orcamento; // Pega o id_orcamento
                    openOrcamentoModal(orcamentoId); // Passa o id_orcamento para a função
                });
            }
        });

        // Cria o botão "Marcar todas como lidas" se houver mais de 1 notificação
        if (notifications.length > 1) {
            const markAllButton = document.createElement("button");
            markAllButton.id = "mark-all-read";
            markAllButton.classList.add("btn-mark-all-read");
            markAllButton.textContent = "Marcar todas como lidas";

            // Adiciona o botão abaixo das notificações
            notificationsArea.appendChild(markAllButton);

            // Adiciona o evento de clique no botão "Marcar todas como lidas"
            markAllButton.addEventListener("click", markAllAsRead);
        }
    }
}

// Função para marcar todas as notificações como lidas
async function markAllAsRead() {
    const notificationsArea = document.getElementById("notifications-area");

    // Limpar as notificações e adicionar uma mensagem genérica
    notificationsArea.innerHTML = '<i class="bi bi-check-circle info-notification">Sem novas notificações!</i>';

    try {
        // Atualizar o status das notificações no banco (marca como lidas)
        const response = await fetch('/funcionario/php/notification/notification_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Adiciona o cabeçalho adequado
            },
            body: JSON.stringify({ mark_all: true }) // Envia uma flag para marcar todas as notificações
        });

        const data = await response.json();

        if (data.status === 'success') {
            console.log('Notificações marcadas como lidas');
            fetchNotifications(); // Atualiza a lista de notificações
        } else {
            console.error('Erro ao atualizar o status das notificações:' , data.message);
        }
    } catch (error) {
        console.error('Erro ao marcar as notificações como lidas:', error);
    }
}

// Função para buscar os dados do orçamento
async function fetchAndDisplayOrcamentoSide(orcamentoId) {
    try {
        console.log('Buscando dados do orçamento com id:', orcamentoId); // Mensagem de depuração
        const response = await fetch(`https://www.yourstorage.x10.mx/funcionario/php/get_orcamento.php?id_orcamento=${orcamentoId}`);
        const data = await response.json();
        
        console.log('Resposta do servidor:', data); // Verifique a resposta do servidor

        if (data.status === 'success') {
            const orcamentoSide = data.result;
            displayOrcamentoDataSide(orcamentoSide);
        } else {
            console.error('Erro ao buscar dados do orçamento:', data.message);
        }
    } catch (error) {
        console.error('Erro ao buscar dados do orçamento:', error);
    }
}

// Função para exibir os dados do orçamento em uma div
function displayOrcamentoDataSide(orcamentoSide) {
    const orcamentoAreaOrc = document.getElementById("orcamento-area-orc");
    orcamentoAreaOrc.innerHTML = ""; // Limpa a área de orçamento

    // Verifica se há dados de orçamento
    if (!orcamentoSide) {
        orcamentoAreaOrc.innerHTML = '<i class="bi bi-info-circle info-orcamento">Sem dados de orçamento disponíveis!</i>';
    } else {
        // Exibe os dados do orçamento
        const orcamentoDivOrc = document.createElement("div");
        orcamentoDivOrc.classList.add("orcamento-item-orc");

        // Verifica se a mensagem é 'null' ou vazia e exibe uma mensagem padrão
        const mensagem = (orcamentoSide.mensagem === 'null' || orcamentoSide.mensagem === null) 
            ? 'Mensagem não enviada' 
            : orcamento.mensagem;

        // Estrutura de exibição dos dados
        orcamentoDivOrc.innerHTML = `   
            <p><strong>Nome:</strong> ${orcamentoSide.nome}</p>
            <p><strong>Email:</strong> ${orcamentoSide.email}</p>
            <p><strong>Telefone:</strong> ${orcamentoSide.telefone}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
            <p><strong>Empresa:</strong> ${orcamentoSide.enterprise}</p>
            <p><strong>CNPJ ou CPF:</strong> ${orcamentoSide.cnpj}</p>
            <p><strong>Motivo:</strong> ${orcamentoSide.question}</p>
            <button class='send-email-orc' type='button'><span>Enviar Email</span></button>
        `;

        // Adiciona o evento de clique no botão de envio de e-mail
        const sendEmailButton = orcamentoDivOrc.querySelector('.send-email-orc');
        sendEmailButton.addEventListener('click', function() {
            const email = orcamentoSide.email;
            const subject = encodeURIComponent(`Recebimento de Formulário - ${orcamentoSide.nome}`); // Assunto do email

            // Abre o editor de email com os dados preenchidos
            window.location.href = `mailto:${email}?subject=${subject}`;
        });

        // Adiciona a div do orçamento na área
        orcamentoAreaOrc.appendChild(orcamentoDivOrc);
    }
}

// Função para abrir o modal e buscar dados do orçamento
function openOrcamentoModal(orcamentoId) {
    document.getElementById("orcamento-modal-orc").style.display = "flex"; // Exibe o modal
    fetchAndDisplayOrcamentoSide(orcamentoId); // Busca os dados do orçamento e exibe no modal
}

// Função para fechar o modal
function closeModalSideNote() {
    document.getElementById("orcamento-modal-orc").style.display = "none"; // Esconde o modal
    document.getElementById('notificationsModal').style.display = "none"; // Fecha o modal de notificações, caso esteja aberto
}

// Inicia a busca por notificações quando o script é carregado
fetchNotifications();
