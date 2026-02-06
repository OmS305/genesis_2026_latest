# Ticket Management System

A full-stack ticket management system with role-based authentication built with Node.js, Express, MongoDB, and React.

## Features

- **User Authentication**: Signup and login with JWT tokens
- **Role-Based Access Control**: 
  - Admin users can view all tickets
  - Normal users can only view their own tickets
- **Dark Theme UI**: Clean, minimalist interface
- **Secure**: Password hashing with bcrypt, JWT authentication

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to the Backend folder:
```bash
cd Backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Make sure `.env` file has the correct values:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key_change_in_production_2026
```

4. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating Users

1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - Name
   - Email
   - Password
   - Role (Admin or User)
3. Click "Sign Up"
4. You'll be redirected to the login page

### Logging In

1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the dashboard

### Dashboard

- **Admin users**: Can see all tickets in the system
- **Normal users**: Can only see tickets where the email matches their account email

### Adding Tickets

Tickets can be added via the existing `/addTicket` endpoint:

```bash
POST http://localhost:5000/addTicket
Content-Type: application/json

{
  "email": "user@example.com",
  "subject": "Support Request",
  "message": "I need help with..."
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Tickets (Protected)
- `GET /api/tickets` - Get tickets (filtered by role)

### Legacy
- `POST /addTicket` - Add ticket (no auth required)

## Project Structure

```
.
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── ticketRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── TicketTable.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Testing

### Test Admin Access
1. Create an admin user via signup
2. Login with admin credentials
3. Verify you can see all tickets

### Test User Access
1. Create a normal user via signup
2. Login with user credentials
3. Verify you only see tickets matching your email

### Test Authentication
1. Try accessing `/dashboard` without logging in
2. Verify you're redirected to `/login`
3. Login and verify you can access the dashboard
4. Refresh the page and verify you stay logged in
5. Logout and verify you're redirected to login

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours
- Protected routes require valid JWT token
- Email validation on signup
- Role-based access control enforced at API level

## License

MIT
