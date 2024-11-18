document.addEventListener('DOMContentLoaded', () => {
    const identidadeInput = document.querySelector('#identidade');
    const contatoInput = document.querySelector('#contato');

    // Formatação para Identidade (RG ou CPF)
    identidadeInput.addEventListener('input', (event) => {
        let value = identidadeInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Verifica se o valor tem 9 ou menos dígitos (formato RG)
        if (value.length <= 10) {
            // Formata RG (XX.XXX.XXX-XX)
            identidadeInput.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
        } 
        // Verifica se o valor tem 11 dígitos (formato CPF)
        else if (value.length <= 13) {
            // Aplica o formato de CPF (XXX.XXX.XXX-XX)
            identidadeInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        // Limita o número de caracteres ao máximo para RG (9) ou CPF (11)
        if (value.length > 11) {
            identidadeInput.value = identidadeInput.value.slice(0, 14); // Limita a 14 caracteres no máximo
        }
    });

    // Formatação para Contato (Telefone)
    contatoInput.addEventListener('input', (event) => {
        let value = contatoInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Aplica o formato de telefone (XX) XXXXX-XXXX
        if (value.length <= 11) {
            // Formata para (XX) XXXXX-XXXX
            contatoInput.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }

        // Limita o número de caracteres a 11 (para telefone)
        if (value.length > 11) {
            contatoInput.value = contatoInput.value.slice(0, 15); // Limita a 15 caracteres no máximo
        }
    });
});