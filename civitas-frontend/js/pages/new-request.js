// js/pages/new-request.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-new-request');
    const cbAnonimo = document.getElementById('anonimo');
    const contatoFields = document.getElementById('contato-fields');
    const radioOutro = document.getElementById('radio-outro');
    const radiosCategoria = document.querySelectorAll('input[name="category"]');
    const groupOutroTexto = document.getElementById('group-outro-texto');
    const inputOutroTexto = document.getElementById('outro-texto');

    // 1. Lógica de Anonimato (Opcional)
    cbAnonimo.addEventListener('change', () => {
        const inputs = contatoFields.querySelectorAll('input');
        if (cbAnonimo.checked) {
            contatoFields.style.opacity = '0.5';
            inputs.forEach(input => {
                input.disabled = true;
                input.value = ''; // Limpa os dados se desistir de se identificar
            });
        } else {
            contatoFields.style.opacity = '1';
            inputs.forEach(input => input.disabled = false);
        }
    });

    // 2. Lógica para exibir o campo de texto "Outro"
    radiosCategoria.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radioOutro.checked) {
                groupOutroTexto.style.display = 'block';
                inputOutroTexto.required = true;
            } else {
                groupOutroTexto.style.display = 'none';
                inputOutroTexto.required = false;
                inputOutroTexto.value = '';
            }
        });
    });

    // 3. Submissão do Formulário para o Spring Boot
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnEnviar = document.getElementById('btn-enviar-solicitacao');
        const originalText = btnEnviar.textContent;
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        // Captura o valor da categoria (se for OUTRO, concatena o texto digitado)
        let categoriaSelecionada = document.querySelector('input[name="category"]:checked').value;
        let complementoCategoria = "";
        if (categoriaSelecionada === "OTHER") {
            complementoCategoria = inputOutroTexto.value;
        }

        // Montagem do payload JSON idêntico ao que o backend espera receber
        const payload = {
            anonimo: cbAnonimo.checked,
            nomeCompleto: cbAnonimo.checked ? null : document.getElementById('nome').value,
            email: cbAnonimo.checked ? null : document.getElementById('email').value,
            telefone: cbAnonimo.checked ? null : document.getElementById('telefone').value,
            cpf: cbAnonimo.checked ? null : document.getElementById('cpf').value,
            
            category: categoriaSelecionada,
            customCategoryText: complementoCategoria,
            
            description: document.getElementById('description').value,
            cep: document.getElementById('cep').value,
            endereco: document.getElementById('endereco').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            numero: document.getElementById('numero').value
        };

        try {
            // Chamando seu interceptor da api.js configurado na porta certa
            const response = await api.post('/api/requests', payload);
            
            alert('Solicitação cadastrada com sucesso!');
            form.reset();
            window.location.href = 'requests-list.html'; // Volta para a tela 1
            
        } catch (error) {
            console.error('Erro ao salvar solicitação:', error);
            alert('Não foi possível enviar a solicitação. Verifique se o servidor está ativo.');
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = originalText;
        }
    });
});