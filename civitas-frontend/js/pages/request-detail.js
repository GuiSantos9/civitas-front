document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    const titleEl = document.querySelector('.page-title');
    const priorityBadgeEl = document.querySelector('.chip');
    const addressEl = document.querySelector('.text-muted');
    const descriptionEl = document.querySelector('.request-summary p:last-child');
    const timelineContainer = document.querySelector('.timeline');

    if (!requestId) {
        timelineContainer.innerHTML = '<p style="color: var(--color-danger);">Nenhuma solicitação selecionada.</p>';
        return;
    }

    try {
        const solicitacao = await api.get(`/api/requests/${requestId}`);
        
        atualizarResumo(solicitacao, titleEl, priorityBadgeEl, addressEl, descriptionEl);

        const historico = solicitacao.history || []; 
        renderizarTimeline(historico, timelineContainer);

    } catch (error) {
        console.error('Erro ao buscar detalhes da solicitação:', error);
        renderizarMock(titleEl, priorityBadgeEl, addressEl, descriptionEl, timelineContainer);
    }
});

function atualizarResumo(data, titleEl, priorityBadgeEl, addressEl, descriptionEl) {
    const categorias = {
        'FLOORING': 'Infraestrutura / Pavimentação',
        'HEALTH': 'Saúde',
        'LIGHTING': 'Iluminação Pública',
        'SCHOOL_SAFETY': 'Segurança Escolar'
    };

    const prioridades = {
        'HIGH': { text: 'Alta Prioridade', class: 'chip-high' },
        'MEDIUM': { text: 'Prioridade Média', class: 'chip-medium' },
        'LOW': { text: 'Baixa Prioridade', class: 'chip-low' }
    };

    titleEl.textContent = categorias[data.category] || data.category;
    
    const prioridade = prioridades[data.priority] || prioridades['MEDIUM'];
    priorityBadgeEl.textContent = prioridade.text;
    priorityBadgeEl.className = `chip ${prioridade.class}`;

    addressEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location || 'Endereço não informado'}`;
    descriptionEl.innerHTML = `<strong>Descrição:</strong> ${data.description || 'Sem descrição.'}`;
}

function renderizarTimeline(historico, container) {
    if (!historico || historico.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum histórico registrado para esta solicitação ainda.</p>';
        return;
    }

    const statusVisual = {
        'OPEN': { icon: 'fa-box-open', colorClass: 'badge-open' },
        'TRIAGE': { icon: 'fa-filter', colorClass: 'badge-triage' },
        'IN_PROGRESS': { icon: 'fa-person-digging', colorClass: 'badge-in-progress' },
        'RESOLVED': { icon: 'fa-check', colorClass: 'badge-resolved' },
        'CLOSED': { icon: 'fa-xmark', colorClass: 'badge-closed' }
    };

    container.innerHTML = ''; 

    historico.forEach(item => {
        const visual = statusVisual[item.status] || { icon: 'fa-circle-info', colorClass: 'badge-closed' };
        const dataFormatada = item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '--/--';

        const itemHTML = `
            <div class="timeline-item">
                <div class="timeline-icon ${visual.colorClass}">
                    <i class="fa-solid ${visual.icon}"></i>
                </div>
                <div class="timeline-content card">
                    <div class="timeline-header">
                        <h3>${item.responsibleName || 'Sistema'}</h3>
                        <span class="timeline-date">${dataFormatada}</span>
                    </div>
                    <p class="text-muted">${item.description || 'Status atualizado.'}</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
}

function renderizarMock(titleEl, priorityBadgeEl, addressEl, descriptionEl, container) {
    titleEl.textContent = 'Pavimentação';
    priorityBadgeEl.textContent = 'Prioridade Média';
    priorityBadgeEl.className = 'chip chip-medium';
    addressEl.innerHTML = '<i class="fa-solid fa-location-dot"></i> Rua Janeiro, 998';
    descriptionEl.innerHTML = `<strong>Descrição:</strong> Buraco na via causando risco de acidentes para ciclistas.`;

    container.innerHTML = `
        <div class="timeline-item">
            <div class="timeline-icon badge-in-progress">
                <i class="fa-solid fa-exclamation"></i>
            </div>
            <div class="timeline-content card">
                <div class="timeline-header">
                    <h3>José Antônio</h3>
                    <span class="timeline-date">24/03</span>
                </div>
                <p class="text-muted">Equipe enviada ao local para avaliação do asfalto.</p>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-icon badge-resolved">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="timeline-content card">
                <div class="timeline-header">
                    <h3>Carlos Augusto</h3>
                    <span class="timeline-date">23/03</span>
                </div>
                <p class="text-muted">Solicitação recebida e triada pelo sistema.</p>
            </div>
        </div>
    `;
}