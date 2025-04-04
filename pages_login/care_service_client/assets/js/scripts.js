// API Client for ElderCare Co.
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion';

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication status immediately
  const checkAuth = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        window.location.href = '../login/index.html';
        return null;
      }

      // Fetch all users to get the correct ID
      const response = await fetch(`${API_BASE_URL}/users`);
      const users = await response.json();
      
      // Find the user with matching email
      const matchingUser = users.find(u => u.email === user.email);
      
      if (!matchingUser) {
        console.error('User not found in the database');
        window.location.href = '../login/index.html';
        return null;
      }

      console.log('Found user:', matchingUser); // Debug log
      return matchingUser;
    } catch (error) {
      console.error('Error in checkAuth:', error);
      return null;
    }
  };

  // Get the form element
  const appointmentForm = document.querySelector('.care-form');
  const submitButton = appointmentForm.querySelector('.submit-btn');

  // Add event listener for form submission
  appointmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const contactPreference = document.querySelector('input[name="contact"]:checked')?.value || 'email';
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    const additionalInfo = document.getElementById('additional-info').value;
    
    // Validate required fields
    if (!name || !phone || !email || !date) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Show loading state
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;

      // Get current user and verify authentication
      const user = await checkAuth();
      if (!user) {
        alert('Please log in to create an appointment');
        window.location.href = '../login/index.html';
        return;
      }

      console.log('Creating appointment for user:', user.id); // Debug log
      
      // Prepare appointment data
      const appointmentData = {
        userId: user.id,
        type: 'visiting',
        title: `Appointment for ${name}`,
        dateTime: new Date(date).toISOString(),
        location: location,
        medicationDetails: additionalInfo || null
      };

      console.log('Sending appointment data:', appointmentData); // Debug log
      
      // Send data to API
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (response.ok) {
        // Successful appointment creation
        alert('Appointment created successfully!');
        // Reset form
        appointmentForm.reset();
      } else {
        // Handle error
        throw new Error(data.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(error.message || 'An error occurred while creating the appointment. Please try again later.');
    } finally {
      // Reset button state
      submitButton.textContent = 'SUBMIT';
      submitButton.disabled = false;
    }
  });
  
  // Function to fetch and display appointments
  async function fetchAppointments() {
    try {
      // Get current user and verify authentication
      const user = await checkAuth();
      if (!user) return;

      console.log('Fetching appointments for user:', user.id); // Debug log
      
      // Fetch appointments for the current user
      const response = await fetch(`${API_BASE_URL}/appointments?userId=${encodeURIComponent(user.id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const appointments = await response.json();
      console.log('Fetched appointments:', appointments); // Debug log
      
      if (response.ok) {
        // Display appointments if there's a container for them
        const appointmentsContainer = document.getElementById('appointments-list');
        if (appointmentsContainer) {
          if (appointments.length === 0) {
            appointmentsContainer.innerHTML = '<p>No appointments found.</p>';
          } else {
            appointmentsContainer.innerHTML = appointments.map(appointment => `
              <div class="appointment-card">
                <h3>${appointment.title}</h3>
                <p><strong>Date:</strong> ${new Date(appointment.dateTime).toLocaleDateString()}</p>
                <p><strong>Location:</strong> ${appointment.location}</p>
                ${appointment.medicationDetails ? `<p><strong>Additional Info:</strong> ${appointment.medicationDetails}</p>` : ''}
              </div>
            `).join('');
          }
        }
      } else {
        throw new Error(appointments.error || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }
  
  // Initial auth check and fetch appointments
  checkAuth().then(user => {
    if (user && document.getElementById('appointments-list')) {
      fetchAppointments();
    }
  });
});
