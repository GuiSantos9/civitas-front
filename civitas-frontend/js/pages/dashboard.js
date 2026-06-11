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