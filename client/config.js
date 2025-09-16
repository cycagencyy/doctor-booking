// Backend Server Configuration
const config = {
  // Backend server URL
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    APPOINTMENTS: '/api/appointments',
    AVAILABLE_APPOINTMENTS: '/api/appointments/available',
    DOCTORS: '/api/doctors',
    ADMIN: '/api/admin'
  },
  
  // Default time slots
  DEFAULT_TIME_SLOTS: [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00","17:30"
  ],
  
  // Appointment statuses
  STATUSES: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  }
};

module.exports = config;
