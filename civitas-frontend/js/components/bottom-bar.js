document.addEventListener('DOMContentLoaded', () => {
    const bottomBarContainer = document.getElementById('bottom-bar-container');
    const isDashboard = window.location.pathname.includes('dashboard.html');
    
    if (bottomBarContainer) {
        bottomBarContainer.innerHTML = `
            <nav class="bottom-bar">
                <a href="requests-list.html" class="nav-item">
                    <i class="fa-solid fa-list-ul"></i>
                    <span>Chamados</span>
                </a>
                <a id="nav-painel" class="nav-item active" style="cursor: pointer;">
                    <i class="fa-solid fa-chart-pie"></i>
                    <span>Painel</span>
                </a>
                <a id="nav-novo" class="nav-item" style="cursor: pointer;">
                    <i class="fa-solid fa-plus-circle"></i>
                    <span>Novo</span>
                </a>
                <a href="#" id="nav-sair" class="nav-item">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sair</span>
                </a>
            </nav>
        `;

        // Lógica de Navegação Inteligente
        document.getElementById('nav-painel').addEventListener('click', () => {
            if (!isDashboard) window.location.href = 'dashboard.html';
        });

        document.getElementById('nav-novo').addEventListener('click', () => {
            // Se não estiver no dashboard, vai pra lá e avisa pra abrir o formulário
            if (!isDashboard) window.location.href = 'dashboard.html?open=novo';
        });

        document.getElementById('nav-sair').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});