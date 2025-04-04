// API URLs
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion';
const USERS_API_URL = `${API_BASE_URL}/users`;
const APPOINTMENTS_API_URL = `${API_BASE_URL}/appointments`;

// Function to get current user
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            return null;
        }
        const user = JSON.parse(userStr);
        if (!user || !user.id) {
            localStorage.removeItem('user');
            return null;
        }
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Function to fetch appointments for the current user
async function fetchAppointments() {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: String(user.id)
            })
        });

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

// Function to get a single appointment
async function getAppointment(appointmentId) {
  try {
    console.log('Fetching appointment:', appointmentId);
    const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch appointment (Status: ${response.status}): ${errorText}`);
    }
    
    const appointment = await response.json();
    console.log('Fetched appointment:', appointment);
    return appointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
}

// Function to update an appointment
async function updateAppointment(appointmentId, appointmentData) {
    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: String(appointmentId),
                userId: String(appointmentData.userId),
                type: appointmentData.type,
                title: appointmentData.title,
                dateTime: appointmentData.dateTime,
                location: appointmentData.location,
                medicationDetails: appointmentData.medicationDetails,
                status: appointmentData.status
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update appointment (Status: ${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
}

// Function to delete an appointment
async function deleteAppointment(appointmentId) {
    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: String(appointmentId)
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to delete appointment (Status: ${response.status})`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
    }
}

// Function to display appointments in the table
function displayAppointments(appointments) {
    const tableBody = document.getElementById('appointmentTableBody');
    if (!tableBody) {
        console.error('Appointment table body not found');
        return;
    }

    tableBody.innerHTML = '';

    if (!appointments || appointments.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="7" class="text-center">No appointments found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        // Extract contact info from medicationDetails string
        let phone = '', email = '', contactPref = 'Email';
        if (appointment.medicationDetails) {
            const phoneMatch = appointment.medicationDetails.match(/Phone: (.*?),/);
            const emailMatch = appointment.medicationDetails.match(/Email: (.*?),/);
            const contactMatch = appointment.medicationDetails.match(/Preferred Contact: (.*?),/);
            
            if (phoneMatch && phoneMatch[1]) phone = phoneMatch[1];
            if (emailMatch && emailMatch[1]) email = emailMatch[1];
            if (contactMatch && contactMatch[1]) contactPref = contactMatch[1];
        }

        // Format date
        const appointmentDate = new Date(appointment.dateTime);
        const formattedDate = appointmentDate.toLocaleDateString() + ' ' + appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Get name from title
        const name = appointment.title.replace('Care Service Appointment - ', '');

        row.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${contactPref}</td>
            <td>${appointment.location}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${appointment.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${appointment.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.dataset.id;
            openEditModal(appointmentId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.dataset.id;
            if (confirm('Are you sure you want to delete this appointment?')) {
                deleteAppointment(appointmentId)
                    .then(() => {
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
async function openEditModal(appointmentId) {
    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: String(appointmentId)
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch appointment (Status: ${response.status})`);
        }

        const appointment = await response.json();
        
        // Extract contact info from medicationDetails string
        let phone = '', email = '', contactPref = 'Email';
        if (appointment.medicationDetails) {
            const phoneMatch = appointment.medicationDetails.match(/Phone: (.*?),/);
            const emailMatch = appointment.medicationDetails.match(/Email: (.*?),/);
            const contactMatch = appointment.medicationDetails.match(/Preferred Contact: (.*?),/);
            
            if (phoneMatch && phoneMatch[1]) phone = phoneMatch[1];
            if (emailMatch && emailMatch[1]) email = emailMatch[1];
            if (contactMatch && contactMatch[1]) contactPref = contactMatch[1];
        }

        // Get name from title
        const name = appointment.title.replace('Care Service Appointment - ', '');

        // Format date for input
        const appointmentDate = new Date(appointment.dateTime);
        const formattedDate = appointmentDate.toISOString().split('T')[0];

        // Set form values
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        document.getElementById('phone').value = phone;
        document.getElementById('contactPref').value = contactPref;
        document.getElementById('location').value = appointment.location;
        document.getElementById('dateOfAppointment').value = formattedDate;

        // Store appointment ID for update
        document.getElementById('saveAppointment').dataset.appointmentId = appointmentId;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
        modal.show();
    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('Failed to load appointment details. Please try again.');
    }
}

// Function to load appointments
async function loadAppointments() {
    try {
        const appointments = await fetchAppointments();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        const tableBody = document.getElementById('appointmentTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Failed to load appointments. Please try again later.</td></tr>';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../../login/index.html';
        return;
    }

    // Load appointments
    loadAppointments();

    // Add event listener for the "Add New Client" button
    const addNewClientBtn = document.getElementById('addNewClient');
    if (addNewClientBtn) {
        addNewClientBtn.addEventListener('click', function() {
            // Reset form
            document.getElementById('appointmentForm').reset();
            
            // Remove appointment ID from save button
            delete document.getElementById('saveAppointment').dataset.appointmentId;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
            modal.show();
        });
    }

    // Add event listener for the save button
    const saveAppointmentBtn = document.getElementById('saveAppointment');
    if (saveAppointmentBtn) {
        saveAppointmentBtn.addEventListener('click', async function() {
            try {
                // Get form values
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    contact: document.getElementById('contactPref').value,
                    location: document.getElementById('location').value,
                    date: document.getElementById('dateOfAppointment').value
                };

                // Validate required fields
                if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.date) {
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

                const user = getCurrentUser();
                const appointmentPayload = {
                    userId: String(user.id),
                    type: "Care Service",
                    title: `Care Service Appointment - ${formData.name}`,
                    dateTime: new Date(formData.date).toISOString(),
                    location: formData.location,
                    medicationDetails: `Phone: ${formData.phone}, Email: ${formData.email}, Preferred Contact: ${formData.contact}, Notes: None`,
                    status: "Pending"
                };

                const appointmentId = this.dataset.appointmentId;
                if (appointmentId) {
                    // Update existing appointment
                    await updateAppointment(appointmentId, appointmentPayload);
                    alert('Appointment updated successfully!');
                } else {
                    // Create new appointment
                    const response = await fetch(`${APPOINTMENTS_API_URL}/create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(appointmentPayload)
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to create appointment (Status: ${response.status})`);
                    }

                    alert('Appointment created successfully!');
                }

                // Close modal and refresh appointments
                const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
                modal.hide();
                loadAppointments();

            } catch (error) {
                console.error('Error saving appointment:', error);
                alert(`Failed to save appointment: ${error.message}`);
            }
        });
    }

    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#appointmentTableBody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
});
