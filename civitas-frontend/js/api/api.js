const BASE_URL = 'http://localhost:8080/api'; // Altere para a porta/rota real do seu Spring Boot

/**
 * Recupera os cabeçalhos padrão para as requisições,
 * incluindo o Token JWT caso o usuário esteja autenticado.
 */
function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const token = localStorage.getItem('civitas_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Trata a resposta do servidor, convertendo para JSON 
 * ou lançando erros legíveis.
 */
async function handleResponse(response) {
    // Se o backend responder 401 (Não autorizado) ou 403 (Proibido),
    // limpa o token expirado/inválido e manda o usuário de volta para o login.
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('civitas_token');
        localStorage.removeItem('civitas_user');
        
        // Evita loop de redirecionamento se já estiver na página de login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '/pages/login.html';
        }
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    // Tenta parsear o JSON se houver conteúdo no corpo da resposta
    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    }

    if (!response.ok) {
        // Se o Spring devolver uma mensagem de erro estruturada, usa ela
        const errorMessage = data?.message || `Erro na requisição: ${response.status}`;
        throw new Error(errorMessage);
    }

    return data;
}

// Objeto global da API com os métodos HTTP mapeados
const api = {
    async get(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Erro no GET [${endpoint}]:`, error);
            throw error;
        }
    },

    async post(endpoint, body) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Erro no POST [${endpoint}]:`, error);
            throw error;
        }
    },

    async put(endpoint, body) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Erro no PUT [${endpoint}]:`, error);
            throw error;
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Erro no DELETE [${endpoint}]:`, error);
            throw error;
        }
    }
};