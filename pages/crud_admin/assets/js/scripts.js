// API Base URLs
const USERS_API_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCare/users';
const APPOINTMENTS_API_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCare/appointments';

// Fetch and display users
async function fetchUsers() {
    try {
        const response = await fetch(USERS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch users');
    }
}

// Fetch and display appointments
async function fetchAppointments() {
    try {
        const response = await fetch(APPOINTMENTS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointments = await response.json();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch appointments');
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username || ''}</td>
            <td>${user.email || ''}</td>
            <td>${user.phoneNumber || ''}</td>
            <td>
                <button onclick="editUser('${user.id}')" class="btn btn-primary btn-sm">Edit</button>
                <button onclick="deleteUser('${user.id}')" class="btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display appointments in table
function displayAppointments(appointments) {
    const tbody = document.getElementById('appointmentTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        const dateTime = new Date(appointment.dateTime).toLocaleString();
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.userId}</td>
            <td>${appointment.title}</td>
            <td>${appointment.type}</td>
            <td>${dateTime}</td>
            <td>${appointment.location || ''}</td>
            <td>${appointment.medicationDetails || ''}</td>
            <td>
                <button onclick="editAppointment('${appointment.id}')" class="btn btn-primary btn-sm">Edit</button>
                <button onclick="deleteAppointment('${appointment.id}')" class="btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Create new appointment
async function createAppointment(formData) {
    try {
        const response = await fetch(APPOINTMENTS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: formData.userId,
                type: formData.type,
                title: formData.title,
                dateTime: new Date(formData.dateTime).toISOString(),
                location: formData.location,
                medicationDetails: formData.medicationDetails
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create appointment');
        }

        await fetchAppointments(); // Refresh the table
        return true;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        return false;
    }
}

// Delete appointment
async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete appointment');
        await fetchAppointments(); // Refresh the table
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete appointment');
    }
}

// Edit appointment
async function editAppointment(id) {
    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch appointment');
        const appointment = await response.json();
        
        // Populate form with appointment data
        document.getElementById('appointmentId').value = appointment.id;
        document.getElementById('appointmentUserId').value = appointment.userId;
        document.getElementById('appointmentTitle').value = appointment.title;
        document.getElementById('appointmentType').value = appointment.type;
        document.getElementById('appointmentDateTime').value = new Date(appointment.dateTime)
            .toISOString().slice(0, 16); // Format for datetime-local input
        document.getElementById('appointmentLocation').value = appointment.location || '';
        document.getElementById('appointmentMedicationDetails').value = appointment.medicationDetails || '';
        
        // Show edit modal
        const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
        modal.show();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load appointment data');
    }
}

// Update appointment
async function updateAppointment(formData) {
    try {
        const response = await fetch(`${APPOINTMENTS_API_URL}/${formData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: formData.userId,
                type: formData.type,
                title: formData.title,
                dateTime: new Date(formData.dateTime).toISOString(),
                location: formData.location,
                medicationDetails: formData.medicationDetails
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update appointment');
        }

        await fetchAppointments(); // Refresh the table
        return true;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        return false;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fetch initial data
    fetchUsers();
    fetchAppointments();

    // Handle appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                id: document.getElementById('appointmentId').value,
                userId: document.getElementById('appointmentUserId').value,
                title: document.getElementById('appointmentTitle').value,
                type: document.getElementById('appointmentType').value,
                dateTime: document.getElementById('appointmentDateTime').value,
                location: document.getElementById('appointmentLocation').value,
                medicationDetails: document.getElementById('appointmentMedicationDetails').value
            };

            let success;
            if (formData.id) {
                success = await updateAppointment(formData);
            } else {
                success = await createAppointment(formData);
            }

            if (success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
                modal.hide();
                appointmentForm.reset();
            }
        });
    }

    // Handle new appointment button
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', () => {
            document.getElementById('appointmentForm').reset();
            document.getElementById('appointmentId').value = '';
            const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
            modal.show();
        });
    }
});
