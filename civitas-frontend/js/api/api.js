// js/api/api.js

const BASE_URL = 'http://localhost:8081'; 

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

async function handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
        // Se a sessão do Spring expirar, limpa o controle local e volta pro login
        localStorage.removeItem('civitas_logged_in');
        localStorage.removeItem('civitas_user');
        
        if (!window.location.pathname.includes('login.html')) {
            // Usa caminho relativo simples para evitar problemas com file:///
            window.location.href = 'login.html'; 
        }
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    }

    if (!response.ok) {
        const errorMessage = data?.message || `Erro na requisição: ${response.status}`;
        throw new Error(errorMessage);
    }

    return data;
}

const api = {
    async get(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: getHeaders(),
                credentials: 'include' // <-- MUITO IMPORTANTE: Envia o Cookie de Sessão
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
                body: JSON.stringify(body),
                credentials: 'include' // <-- MUITO IMPORTANTE: Envia o Cookie de Sessão
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
                body: JSON.stringify(body),
                credentials: 'include'
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
                headers: getHeaders(),
                credentials: 'include'
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Erro no DELETE [${endpoint}]:`, error);
            throw error;
        }
    }
};