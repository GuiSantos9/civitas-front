// js/components/bottom-bar.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bottom-bar-container');
    
    if (container) {
        // Verifica qual é a página atual para marcar o ícone como 'active'
        const currentPath = window.location.pathname;
        const isDashboard = currentPath.includes('dashboard.html');
        
        container.innerHTML = `
            <nav class="bottom-bar">
                <a href="dashboard.html" class="bottom-bar-item ${isDashboard ? 'active' : ''}">
                    <i class="fa-solid fa-house"></i>
                    <span>Início</span>
                </a>
                
                <a href="request-form.html" class="bottom-bar-fab">
                    <div class="fab-circle">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <span>Nova</span>
                </a>
                
                <a href="#" class="bottom-bar-item">
                    <i class="fa-solid fa-bell"></i>
                    <span>Avisos</span>
                </a>
            </nav>
        `;
    }
});