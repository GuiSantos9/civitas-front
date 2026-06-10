// js/pages/login.js

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const btnEntrar = document.getElementById('btn-entrar');
    const errorMessage = document.getElementById('login-error-message');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Limpa e esconde mensagens de erro anteriores
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        
        // 2. Ativa o estado de carregamento no botão usando o seu .spinner do components.css
        const originalBtnText = btnEntrar.innerHTML;
        btnEntrar.disabled = true;
        btnEntrar.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';

        // 3. Captura os dados digitados nos inputs
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        // 4. Converte os dados para o formato URL Encoded (Chave=Valor) exigido pelo .formLogin() do Spring
        const params = new URLSearchParams();
        params.append('username', usernameInput);
        params.append('password', passwordInput);

        try {
            // 5. Faz a requisição AJAX para a rota de login padrão do seu Spring Boot
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            // Se o Spring responder com sucesso (Status 200 OK do seu successHandler no Java)
            if (response.ok) {
                // Salva uma informação básica local no navegador para controle de rotas das páginas
                localStorage.setItem('civitas_logged_in', 'true');
                localStorage.setItem('civitas_user', JSON.stringify({ username: usernameInput }));

                // Redireciona o usuário direto para a Tela 5 (Dashboard)
                window.location.href = 'dashboard.html';
            } 
            // Se as credenciais estiverem erradas (Status 401 do seu failureHandler no Java)
            else if (response.status === 401) {
                throw new Error('Usuário ou senha incorretos.');
            } 
            // Qualquer outro status de erro que possa acontecer no servidor
            else {
                throw new Error('Ocorreu um erro no servidor. Tente novamente mais tarde.');
            }

        } catch (error) {
            console.error('Erro durante o fluxo de autenticação:', error);
            
            // Exibe o texto do erro dentro da div de erro estruturada no HTML
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            // 6. Restaura o estado visual original do botão de entrada
            btnEntrar.disabled = false;
            btnEntrar.innerHTML = originalBtnText;
        }
    });
});