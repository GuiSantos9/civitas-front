document.addEventListener('DOMContentLoaded', () => {
    const formSolicitacao = document.getElementById('form-solicitacao');
    const btnSubmit = formSolicitacao.querySelector('button[type="submit"]');

    formSolicitacao.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Animação de carregamento no botão
        const originalBtnText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';

        // Captura a categoria selecionada (Radio Button)
        const categoryRadios = document.getElementsByName('category');
        let selectedCategory = 'FLOORING'; // Valor Padrão
        for (const radio of categoryRadios) {
            if (radio.checked) {
                selectedCategory = radio.value;
                break;
            }
        }

        // Monta o objeto com os mesmos nomes (fields) do seu RequestDTO no Spring
        const requestData = {
            category: selectedCategory,
            description: formSolicitacao.querySelector('textarea[name="description"]').value,
            location: formSolicitacao.querySelector('input[name="location"]').value,
            priority: 'MEDIUM' // Prioridade padrão inicial
        };

        try {
            // Faz o POST para criar a solicitação no banco H2
            await api.post('/api/requests', requestData);
            
            // Se der certo, redireciona para a Tela 02 de Sucesso
            window.location.href = 'request-success.html';

        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            alert(`Falha ao enviar solicitação: ${error.message}`);
        } finally {
            // Restaura o botão caso dê erro
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnText;
        }
    });
});