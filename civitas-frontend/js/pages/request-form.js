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

    // 2. Máscara simples para o CEP (ex: 87000-000)
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    // 3. Ação de buscar o CEP
    const preencherEndereco = async () => {
        const cep = cepInput.value;
        if (cep.length < 8) return;

        // Animação de carregamento (opcional: mudar ícone)
        btnBuscaCep.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        const resultado = await fetchEnderecoByCep(cep);

        if (!resultado.erro) {
            document.getElementById('endereco').value = resultado.logradouro || '';
            document.getElementById('bairro').value = resultado.bairro || '';
            document.getElementById('cidade').value = resultado.localidade || '';
            document.getElementById('estado').value = resultado.uf || '';
            document.getElementById('numero').focus(); // Foca no número para o usuário digitar
        } else {
            alert(resultado.mensagem); // Futuramente, podemos trocar isso pelo seu 'toast.js'
        }

        // Restaura ícone original
        btnBuscaCep.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    };

    // Busca ao clicar no botão ou ao sair do campo (blur)
    btnBuscaCep.addEventListener('click', preencherEndereco);
    cepInput.addEventListener('blur', preencherEndereco);

    // 4. Captura dos dados para o Backend
    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const solicitacaoData = Object.fromEntries(formData.entries());
    solicitacaoData.categorias = formData.getAll('categorias');

    try {
        // Dispara o POST direto para o endpoint do Spring (/api/solicitacoes)
        const resposta = await api.post('/solicitacoes', solicitacaoData);
        
        alert('Solicitação enviada com sucesso!'); 
        // Aqui você poderá usar o toast.js para ficar mais bonito: toast.success('...');
        
        window.location.href = 'dashboard.html'; // Redireciona após o sucesso
    } catch (error) {
        alert(`Não foi possível enviar: ${error.message}`);
    }
});
});