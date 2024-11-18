// Função para animação de contagem gradual
function animateCounter(element, target) {
    let count = 0;
    const increment = target / 20; // Controla a velocidade

    const updateCount = () => {
        count += increment;
        if (count < target) {
            element.innerText = Math.ceil(count);
            setTimeout(updateCount, 20);
        } else {
            element.innerText = target;
        }
    };

    updateCount();
}

// Função para buscar os dados do PHP e iniciar a contagem
async function fetchAndAnimateCounts() {
    try {
        const response = await fetch('../funcionario/php/dashboard/data/data_cards.php'); 
        const data = await response.json();

        // Seleciona os elementos <p> onde os números serão exibidos
        animateCounter(document.querySelector('#card-workers .dash-info p'), data.funcionarios);
        animateCounter(document.querySelector('#card-enterprise .dash-info p'), data.empresa);
        animateCounter(document.querySelector('#card-user .dash-info p'), data.clientes);
        animateCounter(document.querySelector('#card-storage .dash-info p'), data.storage);

    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndAnimateCounts);