// API Client for ElderCare Co.
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/ElderlyCare/appointments';

class ElderCareAPI {
    // Create Appointment
    async createAppointment(appointmentData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                throw new Error('Failed to create appointment');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Empty response from server');
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse JSON:', text);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    }

    // Get All Appointments
    async getAppointments(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Empty response from server');
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse JSON:', text);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    }

    // Schedule Reminder
    async scheduleReminder(appointmentId, reminderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${appointmentId}/reminder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reminderData),
            });

            if (!response.ok) {
                throw new Error('Failed to schedule reminder');
            }

            return await response.json();
        } catch (error) {
            console.error('Error scheduling reminder:', error);
            throw error;
        }
    }
}

// Export the API client
const elderCareAPI = new ElderCareAPI();

// Appointment Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const submitButton = document.getElementById('submitButton');
    const appointmentError = document.getElementById('appointmentError');
    const typeSelect = document.getElementById('type');
    const medicationDetailsGroup = document.getElementById('medicationDetailsGroup');
    const reminderGroup = document.getElementById('reminderGroup');

    // Show/hide medication details based on appointment type
    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            if (medicationDetailsGroup) {
                medicationDetailsGroup.style.display = 
                    e.target.value === 'medication' ? 'block' : 'none';
            }
        });
    }

    // Show/hide reminder options
    if (reminderGroup) {
        reminderGroup.style.display = 'block';
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            if (appointmentError) {
                appointmentError.textContent = '';
                appointmentError.style.display = 'none';
            }
            
            // Show loading state
            if (submitButton) {
                const buttonText = submitButton.querySelector('.button-text');
                const spinner = submitButton.querySelector('.spinner');
                submitButton.disabled = true;
                if (buttonText) buttonText.classList.add('hidden');
                if (spinner) spinner.classList.remove('hidden');
            }

            try {
                // Get form values
                const title = document.getElementById('title').value;
                const type = document.getElementById('type').value;
                const dateTime = document.getElementById('dateTime').value;
                const location = document.getElementById('location').value;
                const medicationDetails = document.getElementById('medicationDetails')?.value;
                
                // Get reminder preferences
                const reminderEnabled = document.getElementById('reminderEnabled')?.checked;
                const reminderType = document.getElementById('reminderType')?.value;
                const reminderTime = document.getElementById('reminderTime')?.value;

                // Get userId from localStorage (assuming it was stored during login)
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const userId = userData.id;

                if (!userId) {
                    throw new Error('User not logged in');
                }

                // Create appointment data object
                const appointmentData = {
                    userId,
                    type,
                    title,
                    dateTime: new Date(dateTime).toISOString(),
                    location: location || undefined,
                    medicationDetails: type === 'medication' ? medicationDetails : undefined,
                    reminder: reminderEnabled ? {
                        type: reminderType,
                        time: reminderTime
                    } : undefined
                };

                // Send to API
                const response = await elderCareAPI.createAppointment(appointmentData);
                console.log('Appointment created:', response);

                // If reminder is enabled, schedule it
                if (reminderEnabled && response.id) {
                    const reminderData = {
                        type: reminderType,
                        time: reminderTime,
                        appointmentId: response.id,
                        userId: userId
                    };
                    await elderCareAPI.scheduleReminder(response.id, reminderData);
                }

                // Clear form
                appointmentForm.reset();

                // Update appointments list if it exists
                await updateAppointmentsList();

                // Show success message
                if (appointmentError) {
                    appointmentError.textContent = 'Appointment created successfully!';
                    appointmentError.style.display = 'block';
                    appointmentError.style.color = 'green';
                }
            } catch (error) {
                console.error('Appointment creation error:', error);
                if (appointmentError) {
                    appointmentError.textContent = error.message || 'Failed to create appointment. Please try again.';
                    appointmentError.style.display = 'block';
                    appointmentError.style.color = 'red';
                }
            } finally {
                // Reset loading state
                if (submitButton) {
                    const buttonText = submitButton.querySelector('.button-text');
                    const spinner = submitButton.querySelector('.spinner');
                    submitButton.disabled = false;
                    if (buttonText) buttonText.classList.remove('hidden');
                    if (spinner) spinner.classList.add('hidden');
                }
            }
        });
    }

    // Function to update appointments list
    async function updateAppointmentsList() {
        const appointmentsList = document.getElementById('appointmentsList');
        if (!appointmentsList) return;

        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = userData.id;

            if (!userId) {
                throw new Error('User not logged in');
            }

            const appointments = await elderCareAPI.getAppointments(userId);
            
            // Clear current list
            appointmentsList.innerHTML = '';

            // Add appointments to list
            appointments.forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.className = 'appointment-item';
                appointmentElement.innerHTML = `
                    <h3>${appointment.title}</h3>
                    <p>Type: ${appointment.type}</p>
                    <p>Date: ${new Date(appointment.dateTime).toLocaleString()}</p>
                    ${appointment.location ? `<p>Location: ${appointment.location}</p>` : ''}
                    ${appointment.medicationDetails ? `<p>Medication Details: ${appointment.medicationDetails}</p>` : ''}
                    ${appointment.reminder ? `
                        <p>Reminder: ${appointment.reminder.type === 'email' ? 'Email' : 'SMS'} 
                        ${appointment.reminder.time} before appointment</p>
                    ` : ''}
                `;
                appointmentsList.appendChild(appointmentElement);
            });
        } catch (error) {
            console.error('Error updating appointments list:', error);
        }
    }

    // Initial load of appointments
    updateAppointmentsList();
});
