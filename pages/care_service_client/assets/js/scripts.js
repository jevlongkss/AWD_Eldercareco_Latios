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
    
    console.log('Valid user found:', user.id);
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
  
  console.log('Creating appointment for user:', user.id);
  
  try {
    // Get the full location name based on the value
    const locationMap = {
      'manila': 'Manila, PH',
      'quezon': 'Quezon City, PH',
      'makati': 'Makati, PH'
    };
    
    // Format contact information as a string
    const contactInfo = `Phone: ${appointmentData.phone}, Email: ${appointmentData.email}, Preferred Contact: ${appointmentData.contact || 'email'}`;
    const notes = appointmentData.notes ? `\nNotes: ${appointmentData.notes}` : '';
    const medicationDetails = `Contact Information: ${contactInfo}${notes}`;
    
    // Prepare the appointment data according to API requirements
    const appointmentPayload = {
      userId: user.id,
      type: "Care Service", // Fixed type for care service appointments
      title: `Care Service Appointment - ${appointmentData.name}`,
      dateTime: new Date(appointmentData.date).toISOString(),
      location: locationMap[appointmentData.location] || appointmentData.location,
      medicationDetails: medicationDetails
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to create appointment (Status: ${response.status})`);
    }
    
    const responseData = await response.json();
    console.log('Appointment created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in createAppointment:', error);
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
    const response = await fetch(`${APPOINTMENTS_API_URL}?userId=${user.id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch appointments (Status: ${response.status})`);
    }
    
    const appointments = await response.json();
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
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
      
      const appointment = await createAppointment(formData);
      alert('Appointment created successfully!');
      careForm.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create appointment. Please try again.');
    }
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the care service client page
  const careForm = document.querySelector('.care-form');
  if (careForm) {
    initializeCareForm();
  }
});

