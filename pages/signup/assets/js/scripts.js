const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion/users';
const USERS_API_URL = `${API_BASE_URL}/users`;

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  const passwordError = document.getElementById('passwordError');
  const signupButton = document.getElementById('signupButton');
  const buttonText = signupButton.querySelector('.button-text');
  const spinner = signupButton.querySelector('.spinner');

  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      passwordError.textContent = 'Passwords do not match';
      passwordError.style.display = 'block';
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      passwordError.style.display = 'block';
      return;
    }
    
    // Hide error message if validation passes
    passwordError.style.display = 'none';
    
    // Show loading state
    buttonText.textContent = 'Signing up...';
    spinner.classList.remove('hidden');
    signupButton.disabled = true;
    
    try {
      // Send data to API
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Successful signup
        alert('Account created successfully!');
        // Redirect to login page
        window.location.href = '../login/index.html';
      } else {
        // Handle error
        if (data.error === 'User already exists') {
          alert('An account with this email already exists. Please log in or use a different email.');
        } else {
          alert(data.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again later.');
    } finally {
      // Reset button state
      buttonText.textContent = 'Sign Up';
      spinner.classList.add('hidden');
      signupButton.disabled = false;
    }
  });
});
