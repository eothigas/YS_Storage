document.addEventListener('DOMContentLoaded', () => {
    const identidadeInput = document.querySelector('#identidade');
    const contatoInput = document.querySelector('#contato');

    // Formatação para Identidade (CPF ou CNPJ)
    identidadeInput.addEventListener('input', (event) => {
        let value = identidadeInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Se o valor tem 11 dígitos, formata como CPF
        if (value.length <= 11) {
            identidadeInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } 
        // Se o valor tem 14 dígitos, formata como CNPJ
        else if (value.length <= 14) {
            identidadeInput.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        // Limita o número de caracteres ao máximo para CPF (11) ou CNPJ (14)
        if (value.length > 14) {
            identidadeInput.value = identidadeInput.value.slice(0, 18); // Limita a 18 caracteres no máximo
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