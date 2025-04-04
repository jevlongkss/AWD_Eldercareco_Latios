const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion';
const USERS_API_URL = `${API_BASE_URL}/users`;

// Function to get appointment API URL for a specific user
function getAppointmentApiUrl(userId) {
  return `${API_BASE_URL}/users/${userId}/appointment`;
}

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  const passwordError = document.getElementById('passwordError');
  const signupButton = document.getElementById('signupButton');
  const buttonText = signupButton.querySelector('.button-text');
  const spinner = signupButton.querySelector('.spinner');

  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
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
      console.log('Attempting to create user with:', { name, email });
      
      // Send data to API
      const response = await fetch(USERS_API_URL, {
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
      
      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: data.name,
          email: data.email,
          id: data.id
        }));
        
        // Store the appointment API URL for this user
        const appointmentApiUrl = getAppointmentApiUrl(data.id);
        localStorage.setItem('appointmentApiUrl', appointmentApiUrl);
        console.log('Stored appointment API URL:', appointmentApiUrl);
        
        // Successful signup
        alert('Account created successfully!');
        // Redirect to home page
        window.location.href = '../../index.html';
      } else {
        // Handle error
        if (data.error === 'User already exists') {
          passwordError.textContent = 'An account with this email already exists. Please log in or use a different email.';
          passwordError.style.display = 'block';
        } else {
          passwordError.textContent = data.error || 'Failed to create account. Please try again.';
          passwordError.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      passwordError.textContent = 'An error occurred during signup. Please try again later.';
      passwordError.style.display = 'block';
    } finally {
      // Reset button state
      buttonText.textContent = 'Sign Up';
      spinner.classList.add('hidden');
      signupButton.disabled = false;
    }
  });
});
