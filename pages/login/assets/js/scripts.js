// API Client for ElderCare Co.
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCare/users';

class ElderCareAPI {
    // Login user
    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials or server error');
            }

            const text = await response.text(); // First get the response as text
            if (!text) {
                throw new Error('Empty response from server');
            }

            try {
                return JSON.parse(text); // Then try to parse it as JSON
            } catch (e) {
                console.error('Failed to parse JSON:', text);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    // Get all users
    async getUsers() {
        try {
            const response = await fetch(API_BASE_URL);
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Empty response from server');
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse JSON:', text);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
}

// Export the API client
const elderCareAPI = new ElderCareAPI();

// Login Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const spinner = loginButton.querySelector('.spinner');
    const passwordError = document.getElementById('passwordError');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            if (passwordError) {
                passwordError.textContent = '';
                passwordError.style.display = 'none';
            }
            
            // Show loading state
            loginButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                // Get form values
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const phone = document.getElementById('phone').value;

                // Validate form
                if (!email && !phone) {
                    throw new Error('Please provide either email or phone number');
                }

                if (!password) {
                    throw new Error('Password is required');
                }

                // Create login credentials object
                const credentials = {
                    username: email || phone, // Use email or phone as username
                    password: password
                };

                console.log('Attempting login with credentials:', credentials);
                const response = await elderCareAPI.login(credentials);
                console.log('Login response:', response);
                
                // Store the authentication token
                if (response && response.token) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userData', JSON.stringify(response.user || {}));
                    window.location.href = '../dashboard/index.html';
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Login error:', error);
                if (passwordError) {
                    passwordError.textContent = error.message || 'Login failed. Please try again.';
                    passwordError.style.display = 'block';
                }
            } finally {
                // Reset loading state
                loginButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }

    // Update register link href
    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        registerLink.href = '../signup/index.html';
    }
});
