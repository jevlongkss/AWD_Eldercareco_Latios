import elderCareAPI from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const passwordError = document.getElementById('passwordError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        loginButton.disabled = true;
        loginButton.querySelector('.button-text').classList.add('hidden');
        loginButton.querySelector('.spinner').classList.remove('hidden');

        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await elderCareAPI.login({ email, password });
            
            // Store the authentication token if provided
            if (response.token) {
                localStorage.setItem('authToken', response.token);
            }

            // Redirect to dashboard or home page
            window.location.href = '/dashboard';
        } catch (error) {
            passwordError.textContent = error.message;
            passwordError.style.display = 'block';
        } finally {
            // Reset loading state
            loginButton.disabled = false;
            loginButton.querySelector('.button-text').classList.remove('hidden');
            loginButton.querySelector('.spinner').classList.add('hidden');
        }
    });
}); 