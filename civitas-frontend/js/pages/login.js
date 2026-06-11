document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const btnEntrar = document.getElementById('btn-entrar');
    const errorMessage = document.getElementById('login-error-message');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        const originalBtnText = btnEntrar.innerHTML;
        btnEntrar.disabled = true;
        btnEntrar.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';

        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        const params = new URLSearchParams();
        params.append('username', usernameInput);
        params.append('password', passwordInput);

        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (response.ok) {
                localStorage.setItem('civitas_logged_in', 'true');
                localStorage.setItem('civitas_user', JSON.stringify({ username: usernameInput }));

                window.location.href = 'file:///C:/Users/NOTEBOOK/Desktop/Estudos-Projetos/civitas/civitas-frontend/pages/dashbord.html';
            }
            else if (response.status === 401) {
                throw new Error('Usuário ou senha incorretos.');
            }
            else {
                throw new Error('Ocorreu um erro no servidor. Tente novamente mais tarde.');
            }

        } catch (error) {
            console.error('Erro durante o fluxo de autenticação:', error);

            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            btnEntrar.disabled = false;
            btnEntrar.innerHTML = originalBtnText;
        }
    });
});