// Function to get appointment API URL for the current user
function getCurrentUserAppointmentApiUrl() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.id) {
    console.error('No user ID found in localStorage');
    return null;
  }
  
  return `https://demo-api-skills.vercel.app/api/ElderlyCareCompanion/users/${user.id}/appointment`;
}

// Function to create a new appointment
async function createAppointment(appointmentData) {
  const appointmentApiUrl = getCurrentUserAppointmentApiUrl();
  if (!appointmentApiUrl) {
    throw new Error('User not authenticated');
  }
  
  console.log('Creating appointment with data:', appointmentData);
  console.log('Using API URL:', appointmentApiUrl);
  
  try {
    const response = await fetch(appointmentApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    });
    
    console.log('Appointment creation response status:', response.status);
    const data = await response.json();
    console.log('Appointment creation response data:', data);
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create appointment');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

// Function to fetch all appointments for the current user
async function fetchUserAppointments() {
  const appointmentApiUrl = getCurrentUserAppointmentApiUrl();
  if (!appointmentApiUrl) {
    throw new Error('User not authenticated');
  }
  
  console.log('Fetching appointments from:', appointmentApiUrl);
  
  try {
    const response = await fetch(appointmentApiUrl);
    console.log('Appointments fetch response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    const appointments = await response.json();
    console.log('Fetched appointments:', appointments);
    
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

// Function to display appointments in the UI
function displayAppointments(appointments) {
  const appointmentsContainer = document.getElementById('appointmentsList');
  if (!appointmentsContainer) {
    console.error('Appointments container not found');
    return;
  }
  
  if (!appointments || appointments.length === 0) {
    appointmentsContainer.innerHTML = '<p class="no-appointments">No appointments found.</p>';
    return;
  }
  
  let appointmentsHTML = '';
  
  appointments.forEach(appointment => {
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString();
    const formattedTime = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    appointmentsHTML += `
      <div class="appointment-card">
        <div class="appointment-header">
          <h3>${appointment.serviceType}</h3>
          <span class="appointment-status ${appointment.status.toLowerCase()}">${appointment.status}</span>
        </div>
        <div class="appointment-details">
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Location:</strong> ${appointment.location}</p>
          <p><strong>Notes:</strong> ${appointment.notes || 'No notes provided'}</p>
        </div>
      </div>
    `;
  });
  
  appointmentsContainer.innerHTML = appointmentsHTML;
}

// Initialize appointments functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.id) {
    console.log('User not logged in, redirecting to login page');
    window.location.href = '../../login/index.html';
    return;
  }
  
  // Set up appointment form if it exists
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const serviceType = document.getElementById('serviceType').value;
      const date = document.getElementById('appointmentDate').value;
      const time = document.getElementById('appointmentTime').value;
      const location = document.getElementById('location').value;
      const notes = document.getElementById('notes').value;
      
      // Combine date and time
      const appointmentDateTime = new Date(`${date}T${time}`);
      
      // Create appointment data
      const appointmentData = {
        serviceType,
        date: appointmentDateTime.toISOString(),
        location,
        notes,
        status: 'Pending'
      };
      
      try {
        // Show loading state
        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Creating Appointment...';
        submitButton.disabled = true;
        
        // Create appointment
        await createAppointment(appointmentData);
        
        // Show success message
        alert('Appointment created successfully!');
        
        // Reset form
        appointmentForm.reset();
        
        // Refresh appointments list
        loadAppointments();
      } catch (error) {
        alert(`Error creating appointment: ${error.message}`);
      } finally {
        // Reset button state
        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
  
  // Load appointments if container exists
  const appointmentsContainer = document.getElementById('appointmentsList');
  if (appointmentsContainer) {
    loadAppointments();
  }
});

// Function to load appointments
async function loadAppointments() {
  try {
    const appointments = await fetchUserAppointments();
    displayAppointments(appointments);
  } catch (error) {
    console.error('Error loading appointments:', error);
    const appointmentsContainer = document.getElementById('appointmentsList');
    if (appointmentsContainer) {
      appointmentsContainer.innerHTML = `<p class="error-message">Error loading appointments: ${error.message}</p>`;
    }
  }
} 