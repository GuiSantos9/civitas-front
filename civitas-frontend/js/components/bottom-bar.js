document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bottom-bar-container');
    
    // Se a página não tiver o container (ex: tela de login), ele não faz nada
    if (!container) return;

    // Descobre em qual página o usuário está agora
    const currentPath = window.location.pathname;

    // Constrói o HTML do menu dinamicamente
    const bottomBarHTML = `
        <nav class="bottom-bar" style="position: fixed; bottom: 0; width: 100%; background: var(--color-surface); border-top: 1px solid var(--color-border); display: flex; justify-content: space-around; padding: 10px 0; z-index: 1000; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);">
            <a href="requests-list.html" class="bottom-bar-item" style="text-decoration: none; color: ${currentPath.includes('requests-list') || currentPath.includes('request-detail') ? 'var(--color-primary)' : 'var(--color-muted)'}; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <i class="fa-solid fa-list-check" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.75rem; font-weight: 600;">Chamados</span>
            </a>
            
            <a href="dashboard.html" class="bottom-bar-item" style="text-decoration: none; color: ${currentPath.includes('dashboard') ? 'var(--color-primary)' : 'var(--color-muted)'}; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <i class="fa-solid fa-chart-pie" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.75rem; font-weight: 600;">Painel</span>
            </a>
            
            <a href="request-form.html" class="bottom-bar-item" style="text-decoration: none; color: ${currentPath.includes('request-form') ? 'var(--color-primary)' : 'var(--color-muted)'}; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <i class="fa-solid fa-circle-plus" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.75rem; font-weight: 600;">Novo</span>
            </a>
            
            <a href="#" id="btn-logout" class="bottom-bar-item" style="text-decoration: none; color: var(--color-muted); display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <i class="fa-solid fa-right-from-bracket" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.75rem; font-weight: 600;">Sair</span>
            </a>
        </nav>
    `;

    // Injeta o HTML na tela
    container.innerHTML = bottomBarHTML;

    // Lógica do botão de Sair (Logout)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // Chama o endpoint padrão de logout do Spring Security
                await fetch('http://localhost:8081/logout', {
                    method: 'POST',
                    credentials: 'include' // Garante que o cookie de sessão seja enviado para ser destruído
                });
            } catch (error) {
                console.error('Erro de comunicação no logout:', error);
            } finally {
                // Independente da resposta do servidor, limpa os dados locais e volta pro login
                localStorage.removeItem('civitas_logged_in');
                localStorage.removeItem('civitas_user');
                window.location.href = 'login.html';
            }
        });
    }
});