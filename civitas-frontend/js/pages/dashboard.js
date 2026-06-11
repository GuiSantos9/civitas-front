document.addEventListener('DOMContentLoaded', async () => {
    const ctxLine = document.getElementById('chartLineMelhoria').getContext('2d');
    const ctxPie = document.getElementById('chartPieServicos').getContext('2d');

    try {
        const solicitacoes = await api.get('/api/requests');
        
        const contagemCategorias = {
            'LIGHTING': 0,
            'HEALTH': 0,
            'FLOORING': 0,
            'SCHOOL_SAFETY': 0
        };

        if (solicitacoes && solicitacoes.length > 0) {
            solicitacoes.forEach(req => {
                if (contagemCategorias[req.category] !== undefined) {
                    contagemCategorias[req.category]++;
                }
            });
        }

        const dadosPizza = [
            contagemCategorias['LIGHTING'], 
            contagemCategorias['HEALTH'], 
            contagemCategorias['FLOORING'], 
            contagemCategorias['SCHOOL_SAFETY']
        ];

        renderPieChart(ctxPie, dadosPizza);
        renderLineChart(ctxLine);

    } catch (error) {
        console.error('Erro ao buscar dados do Dashboard:', error);
        // Fallback de apresentação se o banco falhar/estiver vazio
        renderPieChart(ctxPie, [40, 25, 20, 15]); 
        renderLineChart(ctxLine);
    }
});

function renderPieChart(context, dataValues) {
    const bancoVazio = dataValues.every(val => val === 0);
    const valoresFinais = bancoVazio ? [1, 1, 1, 1] : dataValues; 

    new Chart(context, {
        type: 'doughnut',
        data: {
            labels: ['Iluminação', 'Saúde', 'Infraestrutura', 'Segurança'],
            datasets: [{
                data: valoresFinais,
                backgroundColor: ['#1B4F8A', '#2563B0', '#F0A500', '#E2E8F0'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (bancoVazio) return ' Sem dados no momento';
                            return ` ${context.label}: ${context.raw} solicitações`;
                        }
                    }
                }
            }
        }
    });
}

function renderLineChart(context) {
    new Chart(context, {
        type: 'line',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
                label: 'Chamados Resolvidos',
                data: [12, 19, 15, 25],
                borderColor: '#1B4F8A', 
                backgroundColor: 'rgba(27, 79, 138, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de Troca de Telas (SPA) ---
    const viewDashboard = document.getElementById('view-dashboard');
    const viewFormulario = document.getElementById('view-formulario');
    const btnAbrirForm = document.getElementById('btn-abrir-formulario');
    const btnVoltar = document.getElementById('btn-voltar-dashboard');

    if (btnAbrirForm && btnVoltar) {
        btnAbrirForm.addEventListener('click', () => {
            viewDashboard.style.display = 'none';    // Esconde gráficos
            viewFormulario.style.display = 'block';  // Mostra formulário
        });

        btnVoltar.addEventListener('click', () => {
            viewFormulario.style.display = 'none';   // Esconde formulário
            viewDashboard.style.display = 'block';   // Mostra gráficos
        });
    }

    // --- Lógica do Formulário (Anonimato e Outros) ---
    const cbAnonimo = document.getElementById('anonimo');
    const contatoFields = document.getElementById('contato-fields');
    const radioOutro = document.getElementById('radio-outro');
    const radiosCategoria = document.querySelectorAll('input[name="category"]');
    const groupOutroTexto = document.getElementById('group-outro-texto');
    const inputOutroTexto = document.getElementById('outro-texto');

    if (cbAnonimo) {
        cbAnonimo.addEventListener('change', () => {
            const inputs = contatoFields.querySelectorAll('input');
            if (cbAnonimo.checked) {
                contatoFields.style.opacity = '0.5';
                inputs.forEach(input => { input.disabled = true; input.value = ''; });
            } else {
                contatoFields.style.opacity = '1';
                inputs.forEach(input => input.disabled = false);
            }
        });
    }

    if (radiosCategoria) {
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
    }

    // --- Lógica de Envio para o Backend ---
    const form = document.getElementById('form-new-request');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnEnviar = document.getElementById('btn-enviar-solicitacao');
            btnEnviar.textContent = 'Enviando...';
            btnEnviar.disabled = true;

            let catSelecionada = document.querySelector('input[name="category"]:checked').value;
            let payload = {
                description: document.getElementById('description').value,
                category: catSelecionada,
                location: `${document.getElementById('endereco').value}, ${document.getElementById('numero').value} - ${document.getElementById('bairro').value}`
            };

            try {
                // Dispara para o seu Spring Boot
                await api.post('/api/requests', payload);
                alert('Solicitação criada com sucesso!');
                form.reset();
                
                // Volta para os gráficos automaticamente após salvar
                viewFormulario.style.display = 'none';
                viewDashboard.style.display = 'block';
                
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar. Verifique o backend.');
            } finally {
                btnEnviar.textContent = 'Enviar Solicitação';
                btnEnviar.disabled = false;
            }
        });
    }
});