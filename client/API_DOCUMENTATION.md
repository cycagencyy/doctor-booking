# API Documentation - Doctor Booking System

## Overview
This document describes the client-side API endpoints that connect to the backend server for the doctor booking system.

## Configuration

### Backend URL
The API connects to the backend server using the `BACKEND_URL` environment variable:
- **Local Development**: `http://localhost:5000`
- **Production**: Set `BACKEND_URL` environment variable to your deployed backend URL

## Endpoints

### 1. Appointments API (`/api/appointments`)

#### GET - Fetch Appointments
```javascript
GET /api/appointments?status=pending&date=2024-01-15&page=1&limit=10
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `confirmed`, `cancelled`, `completed`)
- `date` (optional): Filter by specific date (YYYY-MM-DD format)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Response:**
```json
{
  "ok": true,
  "appointments": [...],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

#### POST - Create New Appointment
```javascript
POST /api/appointments
Content-Type: application/json

{
  "patientName": "أحمد محمد",
  "patientEmail": "ahmed@example.com",
  "patientPhone": "01234567890",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00",
  "notes": "موعد متابعة"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "تم إنشاء الموعد بنجاح",
  "appointment": {...}
}
```

#### PUT - Update Appointment
```javascript
PUT /api/appointments?id=APPOINTMENT_ID
Content-Type: application/json

{
  "patientName": "أحمد محمد",
  "patientEmail": "ahmed@example.com",
  "patientPhone": "01234567890",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:30",
  "notes": "موعد متابعة محدث"
}
```

#### DELETE - Delete Appointment
```javascript
DELETE /api/appointments?id=APPOINTMENT_ID
```

#### PATCH - Update Appointment Status
```javascript
PATCH /api/appointments?id=APPOINTMENT_ID
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 2. Available Appointments API (`/api/appointments/available/[date]`)

#### GET - Get Available Time Slots
```javascript
GET /api/appointments/available/2024-01-15
```

**Response:**
```json
{
  "ok": true,
  "date": "2024-01-15",
  "availableSlots": ["09:00", "09:30", "10:00", ...],
  "bookedSlots": ["10:30", "14:00"]
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "ok": false,
  "message": "Error message in Arabic",
  "error": "Error message in English"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `405`: Method Not Allowed
- `500`: Internal Server Error

## CORS Support

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Fallback Behavior

If the backend server is unavailable, the available appointments endpoint will return default time slots:
- Time slots: 09:00 to 17:30 (30-minute intervals)
- Response includes a `note` field indicating fallback mode

## Environment Variables

Set the following environment variable for production deployment:

```bash
BACKEND_URL=https://your-backend-domain.com
```

## Usage Examples

### Frontend Integration

```javascript
// Fetch appointments
const response = await fetch('/api/appointments?status=pending');
const data = await response.json();

// Create new appointment
const newAppointment = await fetch('/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientName: 'أحمد محمد',
    patientEmail: 'ahmed@example.com',
    patientPhone: '01234567890',
    appointmentDate: '2024-01-15',
    appointmentTime: '10:00'
  })
});

// Get available slots
const availableSlots = await fetch('/api/appointments/available/2024-01-15');
const slots = await availableSlots.json();
```

## Deployment Notes

1. **Vercel**: Set `BACKEND_URL` in environment variables
2. **Netlify**: Add environment variable in site settings
3. **Railway**: Set environment variable in project settings
4. **Local Development**: Backend should run on `http://localhost:5000`
