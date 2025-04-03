// API Base URLs
const API_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCare';
const APPOINTMENTS_API_URL = `${API_URL}/appointments`;

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
        const response = await fetch(APPOINTMENTS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        appointments = data.map(apt => ({
            id: apt.id,
            name: apt.name || '',
            email: apt.email || '',
            phone: apt.phone || '',
            contactPref: apt.contactPref || 'Email',
            location: apt.location || '',
            dateOfAppointment: new Date(apt.dateTime).toISOString().split('T')[0]
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
        const response = await fetch(`${APPOINTMENTS_API_URL}/${id}`, {
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
    
    const appointmentData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        contactPref: document.getElementById('contactPref').value,
        location: document.getElementById('location').value,
        dateTime: new Date(document.getElementById('dateOfAppointment').value).toISOString()
    };

    try {
        if (editId) {
            // Update existing appointment
            const response = await fetch(`${APPOINTMENTS_API_URL}/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) throw new Error('Failed to update appointment');
            
            const index = appointments.findIndex(a => a.id === editId);
            if (index !== -1) {
                appointments[index] = { 
                    ...appointments[index], 
                    ...appointmentData,
                    dateOfAppointment: document.getElementById('dateOfAppointment').value
                };
            }
        } else {
            // Create new appointment
            const response = await fetch(APPOINTMENTS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) throw new Error('Failed to create appointment');
            
            const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
            appointments.push({ 
                id: newId,
                ...appointmentData,
                dateOfAppointment: document.getElementById('dateOfAppointment').value
            });
        }

        // Refresh table and close modal
        displayAppointments(appointments);
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        modal.hide();
        form.reset();
        delete form.dataset.editId;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
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
