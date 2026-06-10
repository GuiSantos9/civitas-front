// js/pages/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialização do Gráfico de Linha (Taxa de melhoria)
    const ctxLine = document.getElementById('chartLineMelhoria').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
                label: 'Chamados Resolvidos',
                data: [12, 19, 15, 25],
                borderColor: '#1B4F8A', // --color-primary
                backgroundColor: 'rgba(27, 79, 138, 0.1)',
                borderWidth: 2,
                tension: 0.3
            }, {
                label: 'Metas Urbanas',
                data: [10, 14, 18, 22],
                borderColor: '#9CA3AF', // --color-muted
                borderDash: [5, 5],
                borderWidth: 1.5,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } } // Oculta legenda para simular o wireframe limpo
        }
    });

    // 2. Inicialização do Gráfico de Pizza (Serviços mais solicitados)
    const ctxPie = document.getElementById('chartPieServicos').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Iluminação', 'Saúde', 'Infraestrutura', 'Segurança'],
            datasets: [{
                data: [40, 25, 20, 15],
                backgroundColor: [
                    '#1B4F8A', // Primary
                    '#2563B0', // Primary Light
                    '#F0A500', // Accent
                    '#E2E8F0'  // Border/Grey
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            }
        }
    });
});