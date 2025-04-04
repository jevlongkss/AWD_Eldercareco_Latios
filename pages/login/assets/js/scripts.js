const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion/users';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const passwordError = document.getElementById('passwordError');
  const loginButton = document.getElementById('loginButton');
  const buttonText = loginButton.querySelector('.button-text');
  const spinner = loginButton.querySelector('.spinner');

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
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
      // First, get all users to find the one with matching email
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const users = await response.json();
      
      if (response.ok) {
        // Find user with matching email
        const user = users.find(user => user.email === email);
        
        if (user) {
          // User found, verify password
          if (user.password === password) {
            // Password matches, login successful
            alert('Login successful!');
            // Store user info in session/local storage if needed
            localStorage.setItem('user', JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email
            }));
            // Redirect to home page or dashboard
            window.location.href = '../../index.html';
          } else {
            // Password doesn't match
            passwordError.textContent = 'Invalid email or password';
            passwordError.style.display = 'block';
          }
        } else {
          // User not found
          passwordError.textContent = 'Invalid email or password';
          passwordError.style.display = 'block';
        }
      } else {
        // API error
        alert(users.error || 'Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again later.');
    } finally {
      // Reset button state
      buttonText.textContent = 'Login';
      spinner.classList.add('hidden');
      loginButton.disabled = false;
    }
  });
});
