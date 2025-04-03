// API Client for ElderCare Co.
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCare/users';

class ElderCareAPI {
    // Create a new user
    async createUser(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create user');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Get all users
    async getUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Login user
    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

// Export the API client
const elderCareAPI = new ElderCareAPI();

// Signup Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('signupButton');
    const passwordError = document.getElementById('passwordError');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            signupButton.disabled = true;
            const buttonText = signupButton.querySelector('.button-text');
            const spinner = signupButton.querySelector('.spinner');
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                // Get form values
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const agreeToTerms = document.getElementById('remember').checked;

                // Validate form
                if (!agreeToTerms) {
                    throw new Error('Please agree to the Terms & Conditions');
                }

                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }

                // Create user data object
                const userData = {
                    name,
                    email,
                    password,
                    phone: phone || undefined // Only include phone if it's provided
                };

                // Create new API instance and send request
                const api = new ElderCareAPI();
                const response = await api.createUser(userData);
                
                // Store the authentication token if provided
                if (response.token) {
                    localStorage.setItem('authToken', response.token);
                }

                // Redirect to dashboard or home page
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Signup error:', error);
                if (passwordError) {
                    passwordError.textContent = error.message;
                    passwordError.style.display = 'block';
                }
            } finally {
                // Reset loading state
                signupButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }
});

export default elderCareAPI;

fetch(API_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("API connection failed");
    }
    return response.json();
  })
  .then((data) => console.log("API connected successfully:", data))
  .catch((error) => console.error("Error connecting to API:", error));
