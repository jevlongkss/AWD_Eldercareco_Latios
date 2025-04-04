// API URLs
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion';
const USERS_API_URL = `${API_BASE_URL}/users`;

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const passwordError = document.getElementById('passwordError');
  const loginButton = document.getElementById('loginButton');
  const buttonText = loginButton.querySelector('.button-text');
  const spinner = loginButton.querySelector('.spinner');

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate required fields
    if (!email || !password) {
      passwordError.textContent = 'Email and password are required';
      passwordError.style.display = 'block';
      return;
    }
    
    // Hide error message if validation passes
    passwordError.style.display = 'none';
    
    // Show loading state
    buttonText.textContent = 'Logging in...';
    spinner.classList.remove('hidden');
    loginButton.disabled = true;
    
    try {
      console.log('Fetching users from:', USERS_API_URL);
      
      // First, get all users
      const response = await fetch(USERS_API_URL);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users (Status: ${response.status})`);
      }
      
      const users = await response.json();
      console.log('Found', users.length, 'users');
      
      // Find user with matching email and password
      const user = users.find(u => u.email === email && u.password === password);
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (user) {
        // Store user info in localStorage
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        
        console.log('Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Show success message
        alert('Login successful!');
        
        // Redirect based on user type
        if (email === 'admin@admin.com') {
          console.log('Admin user detected, redirecting to admin page');
          // Use absolute path to ensure correct redirection
          const baseUrl = window.location.href.substring(0, window.location.href.indexOf('/pages/'));
          window.location.href = `${baseUrl}/pages/crud_admin/index.html`;
        } else {
          console.log('Regular user, redirecting to home page');
          // Use absolute path to ensure correct redirection
          const baseUrl = window.location.href.substring(0, window.location.href.indexOf('/pages/'));
          window.location.href = `${baseUrl}/pages_login/home/index.html`;
        }
      } else {
        // Login failed
        console.log('Login failed: Invalid credentials');
        passwordError.textContent = 'Invalid email or password';
        passwordError.style.display = 'block';
      }
    } catch (error) {
      console.error('Error during login:', error);
      passwordError.textContent = 'An error occurred during login. Please try again later.';
      passwordError.style.display = 'block';
    } finally {
      // Reset button state
      buttonText.textContent = 'Login';
      spinner.classList.add('hidden');
      loginButton.disabled = false;
    }
  });
});
