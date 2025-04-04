// API URLs
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion';
const USERS_API_URL = `${API_BASE_URL}/users`;
const APPOINTMENTS_API_URL = `${API_BASE_URL}/appointments`;

// Function to get current user
function getCurrentUser() {
  try {
    console.log('Checking localStorage for user data...');
    const userStr = localStorage.getItem('user');
    console.log('Raw user data from localStorage:', userStr);
    
    if (!userStr) {
      console.log('No user data found in localStorage');
      return null;
    }
    
    const user = JSON.parse(userStr);
    console.log('Parsed user data:', user);
    
    if (!user || !user.id || !user.email) {
      console.log('Invalid user data - missing required fields');
      localStorage.removeItem('user');
      return null;
    }
    
    // Ensure user ID is a string
    user.id = String(user.id);
    console.log('Valid user found with ID:', user.id);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Function to create a new appointment
async function createAppointment(appointmentData) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  console.log('Creating appointment for user:', user.id, 'User data:', user);
  
  try {
    // Get the full location name based on the value
    const locationMap = {
      'manila': 'Manila, PH',
      'quezon': 'Quezon City, PH',
      'makati': 'Makati, PH'
    };
    
    // Create a simple string for medicationDetails
    const medicationDetails = `Phone: ${appointmentData.phone}, Email: ${appointmentData.email}, Preferred Contact: ${appointmentData.contact || 'email'}, Notes: ${appointmentData.notes || 'None'}`;
    
    // Prepare the appointment data according to API requirements
    const appointmentPayload = {
      userId: user.id,
      type: "Care Service",
      title: `Care Service Appointment - ${appointmentData.name}`,
      dateTime: new Date(appointmentData.date).toISOString(),
      location: locationMap[appointmentData.location] || appointmentData.location,
      medicationDetails: medicationDetails,
      status: "Pending" // Add default status
    };

    console.log('Sending appointment payload:', appointmentPayload);
    
    const response = await fetch(APPOINTMENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentPayload)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to create appointment (Status: ${response.status}): ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Appointment created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in createAppointment:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Function to fetch user's appointments
async function fetchAppointments() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    console.log('Fetching appointments for user:', user.id);
    const url = `${APPOINTMENTS_API_URL}?userId=${user.id}`;
    console.log('Fetch URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch appointments (Status: ${response.status}): ${errorText}`);
    }
    
    const appointments = await response.json();
    console.log('Fetched appointments:', appointments);
    
    if (!Array.isArray(appointments)) {
      console.error('Expected array of appointments but got:', typeof appointments);
      return [];
    }
    
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Function to update an appointment
async function updateAppointment(appointmentId, appointmentData) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  console.log('Updating appointment:', appointmentId);
  
  try {
    // Get the full location name based on the value
    const locationMap = {
      'manila': 'Manila, PH',
      'quezon': 'Quezon City, PH',
      'makati': 'Makati, PH'
    };
    
    // Create a simple string for medicationDetails
    const medicationDetails = `Phone: ${appointmentData.phone}, Email: ${appointmentData.email}, Preferred Contact: ${appointmentData.contact || 'email'}, Notes: ${appointmentData.notes || 'None'}`;
    
    // Prepare the appointment data according to API requirements
    const appointmentPayload = {
      userId: user.id,
      type: "Care Service",
      title: `Care Service Appointment - ${appointmentData.name}`,
      dateTime: new Date(appointmentData.date).toISOString(),
      location: locationMap[appointmentData.location] || appointmentData.location,
      medicationDetails: medicationDetails,
      status: "Pending" // Add default status
    };

    console.log('Sending update payload:', appointmentPayload);
    
    const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentPayload)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to update appointment (Status: ${response.status})`);
    }
    
    const responseData = await response.json();
    console.log('Appointment updated successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    throw error;
  }
}

// Function to delete an appointment
async function deleteAppointment(appointmentId) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  console.log('Deleting appointment:', appointmentId);
  
  try {
    const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to delete appointment (Status: ${response.status})`);
    }
    
    console.log('Appointment deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    throw error;
  }
}

// Function to display appointments
function displayAppointments(appointments) {
  // Create appointments container if it doesn't exist
  let appointmentsContainer = document.getElementById('appointments-list');
  if (!appointmentsContainer) {
    appointmentsContainer = document.createElement('div');
    appointmentsContainer.id = 'appointments-list';
    appointmentsContainer.className = 'appointments-container';
    
    // Insert after the appointment form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
      appointmentForm.parentNode.insertBefore(appointmentsContainer, appointmentForm.nextSibling);
    } else {
      document.body.appendChild(appointmentsContainer);
    }
  }
  
  // Clear existing appointments
  appointmentsContainer.innerHTML = '';
  
  if (appointments.length === 0) {
    appointmentsContainer.innerHTML = '<p class="no-appointments">No appointments found.</p>';
    return;
  }
  
  // Create appointment cards
  appointments.forEach(appointment => {
    const appointmentCard = document.createElement('div');
    appointmentCard.className = 'appointment-card';
    appointmentCard.dataset.id = appointment.id;
    
    // Format date for display
    const appointmentDate = new Date(appointment.dateTime);
    const formattedDate = appointmentDate.toLocaleDateString() + ' ' + appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Extract contact info from medicationDetails string
    let contactInfo = '';
    if (appointment.medicationDetails) {
      contactInfo = appointment.medicationDetails;
    }
    
    // Create appointment card content
    appointmentCard.innerHTML = `
      <div class="appointment-header">
        <h3>${appointment.title}</h3>
        <span class="appointment-status ${appointment.status ? appointment.status.toLowerCase() : 'pending'}">${appointment.status || 'Pending'}</span>
      </div>
      <div class="appointment-details">
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Location:</strong> ${appointment.location}</p>
        <p><strong>Contact:</strong> ${contactInfo}</p>
      </div>
      <div class="appointment-actions">
        <button class="edit-btn" data-id="${appointment.id}">Edit</button>
        <button class="delete-btn" data-id="${appointment.id}">Delete</button>
      </div>
    `;
    
    appointmentsContainer.appendChild(appointmentCard);
  });
  
  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
      const appointmentId = this.dataset.id;
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        openEditModal(appointment);
      }
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const appointmentId = this.dataset.id;
      if (confirm('Are you sure you want to delete this appointment?')) {
        deleteAppointment(appointmentId)
          .then(() => {
            // Refresh appointments list
            loadAppointments();
          })
          .catch(error => {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment. Please try again.');
          });
      }
    });
  });
}

// Function to open edit modal
function openEditModal(appointment) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('edit-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  
  // Format date for input field
  const appointmentDate = new Date(appointment.dateTime);
  const formattedDate = appointmentDate.toISOString().split('T')[0];
  
  // Extract contact info from medicationDetails string
  let phone = '', email = '', preferredContact = 'email', notes = '';
  if (appointment.medicationDetails) {
    const phoneMatch = appointment.medicationDetails.match(/Phone: (.*?),/);
    const emailMatch = appointment.medicationDetails.match(/Email: (.*?),/);
    const contactMatch = appointment.medicationDetails.match(/Preferred Contact: (.*?),/);
    const notesMatch = appointment.medicationDetails.match(/Notes: (.*?)$/);
    
    if (phoneMatch && phoneMatch[1]) phone = phoneMatch[1];
    if (emailMatch && emailMatch[1]) email = emailMatch[1];
    if (contactMatch && contactMatch[1]) preferredContact = contactMatch[1];
    if (notesMatch && notesMatch[1]) notes = notesMatch[1];
  }
  
  // Create modal content
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Edit Appointment</h2>
      <form id="edit-form">
        <div class="form-group">
          <label for="edit-name">Name*</label>
          <input type="text" id="edit-name" value="${appointment.title.replace('Care Service Appointment - ', '')}" required>
        </div>
        <div class="form-group">
          <label for="edit-phone">Phone*</label>
          <input type="tel" id="edit-phone" value="${phone}" required>
        </div>
        <div class="form-group">
          <label for="edit-email">Email*</label>
          <input type="email" id="edit-email" value="${email}" required>
        </div>
        <div class="form-group">
          <label>Your Contact Preference:</label>
          <div class="contact-preference">
            <label>
              <input type="radio" name="edit-contact" value="email" ${preferredContact === 'email' ? 'checked' : ''}> Email
            </label>
            <label>
              <input type="radio" name="edit-contact" value="phone" ${preferredContact === 'phone' ? 'checked' : ''}> Phone
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="edit-location">Location*</label>
          <select id="edit-location">
            <option value="manila" ${appointment.location.includes('Manila') ? 'selected' : ''}>Manila, PH</option>
            <option value="quezon" ${appointment.location.includes('Quezon') ? 'selected' : ''}>Quezon City, PH</option>
            <option value="makati" ${appointment.location.includes('Makati') ? 'selected' : ''}>Makati, PH</option>
          </select>
        </div>
        <div class="form-group">
          <label for="edit-date">Date*</label>
          <input type="date" id="edit-date" value="${formattedDate}" required>
        </div>
        <div class="form-group">
          <label for="edit-notes">Additional Information</label>
          <textarea id="edit-notes" rows="4">${notes}</textarea>
        </div>
        <input type="hidden" id="edit-appointment-id" value="${appointment.id}">
        <button type="submit" class="submit-btn">Update Appointment</button>
      </form>
    </div>
  `;
  
  // Show modal
  modal.style.display = 'block';
  
  // Close modal when clicking the X
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Handle form submission
  const editForm = document.getElementById('edit-form');
  editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const appointmentId = document.getElementById('edit-appointment-id').value;
    const formData = {
      name: document.getElementById('edit-name').value.trim(),
      phone: document.getElementById('edit-phone').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      contact: document.querySelector('input[name="edit-contact"]:checked')?.value,
      location: document.getElementById('edit-location').value,
      date: document.getElementById('edit-date').value,
      notes: document.getElementById('edit-notes').value.trim()
    };
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate phone number (at least 10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      alert('Please enter a valid phone number (at least 10 digits)');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Update appointment
    updateAppointment(appointmentId, formData)
      .then(() => {
        alert('Appointment updated successfully!');
        modal.style.display = 'none';
        // Refresh appointments list
        loadAppointments();
      })
      .catch(error => {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment. Please try again.');
      });
  });
}

// Function to load appointments
async function loadAppointments() {
  try {
    console.log('Starting to load appointments...');
    const appointments = await fetchAppointments();
    console.log('Appointments loaded successfully:', appointments);
    displayAppointments(appointments);
  } catch (error) {
    console.error('Error loading appointments:', error);
    console.error('Error stack:', error.stack);
    const appointmentsContainer = document.getElementById('appointments-list');
    if (appointmentsContainer) {
      appointmentsContainer.innerHTML = `<p class="error-message">Failed to load appointments: ${error.message}</p>`;
    }
  }
}

// Initialize care service form
function initializeCareForm() {
  console.log('Initializing care form...');
  const user = getCurrentUser();
  
  if (!user) {
    console.log('User not logged in, redirecting to login page');
    window.location.href = '../../login/index.html';
    return;
  }
  
  const careForm = document.querySelector('.care-form');
  if (!careForm) {
    console.error('Care form not found');
    return;
  }
  
  careForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
      const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        contact: document.querySelector('input[name="contact"]:checked')?.value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        notes: document.getElementById('additional-info').value.trim()
      };
      
      console.log('Form data collected:', formData);
      
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.location) {
        alert('Please fill in all required fields (Name, Phone, Email, Date, and Location)');
        return;
      }
      
      // Validate phone number (at least 10 digits)
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        alert('Please enter a valid phone number (at least 10 digits)');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      console.log('Creating appointment with data:', formData);
      const appointment = await createAppointment(formData);
      console.log('Appointment created:', appointment);
      
      alert('Appointment created successfully!');
      careForm.reset();
      
      // Refresh appointments list
      loadAppointments();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error stack:', error.stack);
      alert(`Failed to create appointment: ${error.message}`);
    }
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded, initializing application...');
  
  // Check if we're on the care service client page
  const careForm = document.querySelector('.care-form');
  if (careForm) {
    console.log('Care form found, initializing...');
    initializeCareForm();
    
    // Load user's appointments
    console.log('Loading appointments...');
    loadAppointments();
  } else {
    console.log('Care form not found on this page');
  }
});

