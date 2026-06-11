document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. LÓGICA DO CALENDÁRIO
    // ==========================================
    const containerDias = document.getElementById('dias-calendario');
    const labelMes = document.getElementById('mes-atual');
    
    if (containerDias && labelMes) {
        const dataAtual = new Date();
        const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
        labelMes.textContent = `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;
        
        let diasHTML = '';
        const diasNoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= diasNoMes; i++) {
            if (i === dataAtual.getDate()) {
                diasHTML += `<span class="day-active">${i}</span>`; 
            } else {
                diasHTML += `<span>${i}</span>`;
            }
        }
        containerDias.innerHTML = diasHTML;
    }

    // ==========================================
    // 2. LÓGICA DE SPA (TROCA DE TELAS)
    // ==========================================
    const viewDashboard = document.getElementById('view-dashboard');
    const viewFormulario = document.getElementById('view-formulario');
    const btnAbrirForm = document.getElementById('btn-abrir-formulario');
    const btnVoltar = document.getElementById('btn-voltar-dashboard');

    function mostrarFormulario() {
        viewDashboard.style.display = 'none';    
        viewFormulario.style.display = 'block'; 
    }

    function mostrarPainel() {
        viewFormulario.style.display = 'none';   
        viewDashboard.style.display = 'block'; 
    }

    if (btnAbrirForm) btnAbrirForm.addEventListener('click', mostrarFormulario);
    if (btnVoltar) btnVoltar.addEventListener('click', mostrarPainel);

    if (new URLSearchParams(window.location.search).get('open') === 'novo') {
        mostrarFormulario();
    }

    setTimeout(() => {
        const navPainel = document.getElementById('nav-painel');
        const navNovo = document.getElementById('nav-novo');
        if (navPainel) navPainel.addEventListener('click', mostrarPainel);
        if (navNovo) navNovo.addEventListener('click', mostrarFormulario);
    }, 300);

    // ==========================================
    // 3. LÓGICA DOS GRÁFICOS (ESTADOS E PIZZA CORRIGIDOS)
    // ==========================================
    const canvasPie = document.getElementById('chartPieServicos');
    const canvasBar = document.getElementById('chartBarEstados');

    if (canvasPie && canvasBar) {
        const ctxPie = canvasPie.getContext('2d');
        const ctxBar = canvasBar.getContext('2d');

        try {
            const solicitacoes = await api.get('/api/requests');
            
            const contagemCategorias = { 'FLOORING': 0, 'LIGHTING': 0, 'SANITATION': 0, 'HEALTH': 0, 'SCHOOL_SAFETY': 0, 'ENVIRONMENT': 0, 'OTHER': 0 };
            const contagemEstados = {}; 

            if (solicitacoes && solicitacoes.length > 0) {
                solicitacoes.forEach(req => {
                    if (contagemCategorias[req.category] !== undefined) contagemCategorias[req.category]++;
                    
                    if (req.location) {
                        let estado = "N/I";
                        // Se houver o novo separador exclusivo "|", divide por ele. Senão usa o hífen antigo.
                        if (req.location.includes('|')) {
                            const partes = req.location.split('|');
                            estado = partes[partes.length - 1].trim().toUpperCase().substring(0, 2);
                        } else if (req.location.includes('-')) {
                            const partes = req.location.split('-');
                            estado = partes[partes.length - 1].trim().toUpperCase().substring(0, 2);
                        }

                        // Ignora códigos corrompidos gerados por testes anteriores (como "NI" ou "I")
                        if (estado && estado !== "NI" && estado !== "I" && estado.length === 2) {
                            contagemEstados[estado] = (contagemEstados[estado] || 0) + 1;
                        }
                    }
                });
            }

            // --- Renderização: Pizza ---
            const valoresPizza = Object.values(contagemCategorias);
            const pizzaVazia = valoresPizza.every(v => v === 0);
            
            new Chart(ctxPie, {
                type: 'doughnut',
                data: {
                    labels: ['Infra', 'Iluminação', 'Saneamento', 'Saúde', 'Segurança', 'Meio Amb.', 'Outros'],
                    datasets: [{
                        data: pizzaVazia ? [1, 1, 1, 1, 1, 1, 1] : valoresPizza,
                        backgroundColor: pizzaVazia 
                            ? ['#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0'] 
                            : ['#1B4F8A', '#2563B0', '#00ACC1', '#E53935', '#F0A500', '#4CAF50', '#9E9E9E'],
                        borderWidth: 1
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: true, 
                    aspectRatio: 1.3, 
                    plugins: {
                        legend: { 
                            position: 'bottom',
                            labels: { padding: 10, boxWidth: 12, font: { size: 11 } }
                        }
                    }
                }
            });

            // --- Renderização: Barras Dinâmicas ---
            const chavesEstados = Object.keys(contagemEstados);
            const temEstadosValidos = chavesEstados.length > 0;
            
            const labelsEstados = temEstadosValidos ? chavesEstados.sort() : ['Sem Dados'];
            const dadosEstados = temEstadosValidos ? labelsEstados.map(est => contagemEstados[est]) : [0];

            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: labelsEstados, 
                    datasets: [{
                        label: 'Chamados por Estado',
                        data: dadosEstados, 
                        backgroundColor: temEstadosValidos ? '#1B4F8A' : '#E2E8F0',
                        borderRadius: 4
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    layout: { padding: { top: 15, bottom: 5 } },
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });

        } catch (error) {
            console.error('Erro ao processar gráficos:', error);
        }
    }

    // ==========================================
    // 4. LÓGICA DO FORMULÁRIO E ENVIO (REPARADO)
    // ==========================================
    const form = document.getElementById('form-new-request');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnEnviar = document.getElementById('btn-enviar-solicitacao');
            btnEnviar.textContent = 'Enviando...';
            btnEnviar.disabled = true;

            let catSelecionada = document.querySelector('input[name="category"]:checked').value;
            let estadoInput = document.getElementById('estado').value.trim().toUpperCase();
            
            // Enviamos apenas o DTO aceito pelo seu Spring Boot (Evita Erro 400)
            // Usamos a barra "|" para isolar o Estado de forma segura
            let payload = {
                description: document.getElementById('description').value,
                category: catSelecionada,
                location: `${document.getElementById('endereco').value}, ${document.getElementById('numero').value} - ${document.getElementById('bairro').value}, ${document.getElementById('cidade').value} | ${estadoInput}`
            };

            try {
                await api.post('/api/requests', payload);
                alert('Solicitação criada com sucesso!');
                window.location.reload(); 
            } catch (error) {
                console.error('Erro detalhado:', error);
                alert('Erro ao salvar. Verifique se o servidor Spring Boot está ativo.');
            } finally {
                btnEnviar.textContent = 'Enviar Solicitação';
                btnEnviar.disabled = false;
            }
        });
    }
});