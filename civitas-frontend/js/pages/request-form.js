// js/pages/request-form.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-solicitacao');
    const checkOutro = document.getElementById('check-outro');
    const inputOutro = document.getElementById('input-outro');
    const cepInput = document.getElementById('cep');
    const btnBuscaCep = document.getElementById('btn-busca-cep');

    // 1. Controle da categoria "Outro"
    checkOutro.addEventListener('change', (e) => {
        if (e.target.checked) {
            inputOutro.disabled = false;
            inputOutro.required = true;
            inputOutro.focus();
        } else {
            inputOutro.disabled = true;
            inputOutro.required = false;
            inputOutro.value = '';
        }
    });

    // 2. Máscara para o CEP (87000-000)
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    // 3. Autocompletar endereço com ViaCEP
    const preencherEndereco = async () => {
        const cep = cepInput.value;
        if (cep.length < 8) return;

        btnBuscaCep.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        const resultado = await fetchEnderecoByCep(cep);

        if (!resultado.erro) {
            document.getElementById('endereco').value = `${resultado.logradouro || ''}, ${resultado.bairro || ''}`;
            document.getElementById('bairro').value = resultado.bairro || '';
            document.getElementById('cidade').value = resultado.localidade || '';
            document.getElementById('estado').value = resultado.uf || '';
            document.getElementById('numero').focus();
        } else {
            alert(resultado.mensagem); 
        }
        btnBuscaCep.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    };

    btnBuscaCep.addEventListener('click', preencherEndereco);
    cepInput.addEventListener('blur', preencherEndereco);

    // 4. Envio dos dados para o Spring Boot
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        
        // Como o banco espera uma única String (Enum), pegamos o primeiro marcado
        const categoriasSelecionadas = formData.getAll('category');
        if (categoriasSelecionadas.length === 0) {
            alert('Por favor, selecione ao menos uma categoria.');
            return;
        }

        // Monta o payload exato mapeado no seu Hibernate log
        const payload = {
            description: formData.get('description'),
            location: `${formData.get('location')} - Nº ${formData.get('numero')}`,
            category: categoriasSelecionadas[0], // Envia o Enum correspondente
            priority: "MEDIUM" // Valor padrão inicial, trate no Spring se necessário
        };

        try {
            // Ajuste o endpoint conforme a sua @RequestMapping do Controller (ex: /solicitacoes)
            await api.post('/solicitacoes', payload);
            alert('Solicitação cadastrada com sucesso!');
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert(`Falha ao salvar no banco: ${error.message}`);
        }
    });
});