// API Base URLs
const API_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCareCompanion';
const USERS_API_URL = `${API_URL}/users`;

// Sample initial data (will be replaced with API data)
let appointments = [
    {
        id: 1,
        name: 'Ellen Ross',
        email: 'ellenross@gmail.com',
        phone: '09123456789',
        contactPref: 'Phone',
        location: 'Manila, PH',
        dateOfAppointment: '2025-05-02'
    }
];

// Fetch appointments from API
async function fetchAppointments() {
    try {
        const response = await fetch(USERS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        appointments = data.map(user => ({
            id: user.id,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            contactPref: user.contactPref || 'Email',
            location: user.location || '',
            dateOfAppointment: user.dateOfAppointment || new Date().toISOString().split('T')[0]
        }));
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error:', error);
        // If API fails, use sample data
        displayAppointments(appointments);
    }
}

// Display appointments in table
function displayAppointments(appointments) {
    const tbody = document.getElementById('appointmentTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.email}</td>
            <td>${appointment.phone}</td>
            <td>${appointment.contactPref}</td>
            <td>${appointment.location}</td>
            <td>${appointment.dateOfAppointment}</td>
            <td>
                <button onclick="editAppointment(${appointment.id})" class="btn btn-primary btn-sm">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteAppointment(${appointment.id})" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Delete appointment
async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
        const response = await fetch(`${USERS_API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete appointment');
        appointments = appointments.filter(appointment => appointment.id !== id);
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete appointment');
    }
}

// Edit appointment
async function editAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;
    
    try {
        // Populate form with appointment data
        document.getElementById('name').value = appointment.name;
        document.getElementById('email').value = appointment.email;
        document.getElementById('phone').value = appointment.phone;
        document.getElementById('contactPref').value = appointment.contactPref;
        document.getElementById('location').value = appointment.location;
        document.getElementById('dateOfAppointment').value = appointment.dateOfAppointment;
        
        // Store the ID being edited
        document.getElementById('appointmentForm').dataset.editId = id;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
        modal.show();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load appointment data');
    }
}

// Save appointment (create or update)
async function saveAppointment() {
    const form = document.getElementById('appointmentForm');
    const editId = parseInt(form.dataset.editId);
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = "Password123!"; // Default password for new users
    
    // Validate required fields
    if (!name || !email || !password) {
        alert('Name, email, and password are required');
        return;
    }
    
    // Structure the data according to API requirements
    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        if (editId) {
            // Update existing user
            const response = await fetch(`${USERS_API_URL}/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Failed to update user');
            }
            
            // Get the updated user from the response
            const updatedUser = await response.json();
            
            // Update local data
            const index = appointments.findIndex(a => a.id === editId);
            if (index !== -1) {
                appointments[index] = { 
                    ...appointments[index], 
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: document.getElementById('phone').value,
                    contactPref: document.getElementById('contactPref').value,
                    location: document.getElementById('location').value,
                    dateOfAppointment: document.getElementById('dateOfAppointment').value
                };
            }
        } else {
            // Create new user
            console.log('Sending data:', userData); // Debug log
            
            const response = await fetch(USERS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Failed to create user');
            }

            // Get the created user from the response
            const createdUser = await response.json();
            console.log('Created user:', createdUser); // Debug log
            
            // Add to local array with proper format
            appointments.push({ 
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                phone: document.getElementById('phone').value,
                contactPref: document.getElementById('contactPref').value,
                location: document.getElementById('location').value,
                dateOfAppointment: document.getElementById('dateOfAppointment').value
            });
        }

        // Refresh table and close modal
        displayAppointments(appointments);
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        modal.hide();
        form.reset();
        delete form.dataset.editId;

        // Show success message
        alert('User saved successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save user. Please check the console for details.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fetch initial appointments
    fetchAppointments();

    // Add New Client button
    const addNewClientBtn = document.getElementById('addNewClient');
    if (addNewClientBtn) {
        addNewClientBtn.addEventListener('click', () => {
            const form = document.getElementById('appointmentForm');
            form.reset();
            delete form.dataset.editId;
            const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
            modal.show();
        });
    }

    // Save button in modal
    const saveBtn = document.getElementById('saveAppointment');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAppointment);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredAppointments = appointments.filter(appointment => 
                appointment.name.toLowerCase().includes(searchTerm) ||
                appointment.email.toLowerCase().includes(searchTerm) ||
                appointment.phone.includes(searchTerm) ||
                appointment.location.toLowerCase().includes(searchTerm)
            );
            displayAppointments(filteredAppointments);
        });
    }
});
