/**
 * Busca os dados de endereço baseados no CEP informado.
 *  @param {string} cep - O CEP a ser buscado (com ou sem pontuação).
 *  @returns {Promise<Object>} - O objeto de endereço ou um objeto de erro.
 */
async function fetchEnderecoByCep(cep) {
    // Remove qualquer caractere que não seja número
    const cepLimpo = cep.replace(/\D/g, '');

    // Verifica se o CEP possui tamanho válido
    if (cepLimpo.length !== 8) {
        return { erro: true, mensagem: 'CEP deve conter 8 dígitos.' };
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
            return { erro: true, mensagem: 'CEP não encontrado.' };
        }

        return data;
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return { erro: true, mensagem: 'Erro na comunicação com o servidor.' };
    }
}