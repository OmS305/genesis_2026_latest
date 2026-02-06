# Quick Start Guide

## Start the Application

### 1. Start Backend Server

Open a terminal and run:

```bash
cd Backend
node server.js
```

You should see:
```
✅ MongoDB Atlas connected successfully
🚀 Server running on http://localhost:5000
```

### 2. Start Frontend Development Server

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The browser will automatically open to `http://localhost:3000`

## First Time Setup

### Create Test Users

1. **Create an Admin User**:
   - Go to http://localhost:3000/signup
   - Name: Admin User
   - Email: admin@test.com
   - Password: admin123
   - Role: Admin
   - Click "Sign Up"

2. **Create a Normal User**:
   - Go to http://localhost:3000/signup
   - Name: Test User
   - Email: user@test.com
   - Password: user123
   - Role: User
   - Click "Sign Up"

### Add Test Tickets

You can add tickets using the API endpoint. Open a new terminal and run:

```bash
# Add ticket for admin@test.com
curl -X POST http://localhost:5000/addTicket -H "Content-Type: application/json" -d "{\"email\":\"admin@test.com\",\"subject\":\"Admin Ticket\",\"message\":\"This is an admin ticket\"}"

# Add ticket for user@test.com
curl -X POST http://localhost:5000/addTicket -H "Content-Type: application/json" -d "{\"email\":\"user@test.com\",\"subject\":\"User Ticket\",\"message\":\"This is a user ticket\"}"

# Add another ticket for user@test.com
curl -X POST http://localhost:5000/addTicket -H "Content-Type: application/json" -d "{\"email\":\"user@test.com\",\"subject\":\"Second User Ticket\",\"message\":\"Another ticket for the user\"}"
```

Or use Postman/Thunder Client:
```
POST http://localhost:5000/addTicket
Content-Type: application/json

{
  "email": "user@test.com",
  "subject": "Support Request",
  "message": "I need help with something"
}
```

### Test the Application

1. **Login as Admin**:
   - Email: admin@test.com
   - Password: admin123
   - You should see ALL tickets in the dashboard

2. **Logout and Login as User**:
   - Email: user@test.com
   - Password: user123
   - You should see ONLY tickets with email "user@test.com"

## Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct in `Backend/.env`
- Make sure port 5000 is not already in use

### Frontend won't start
- Make sure you ran `npm install` in the frontend folder
- Check if port 3000 is not already in use

### Can't login
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify user was created successfully

### Tickets not showing
- Make sure you're logged in
- Check if tickets exist in MongoDB
- Verify the email on tickets matches your user email (for normal users)

## What's Next?

- Add more tickets via the `/addTicket` endpoint
- Create more users with different roles
- Test the role-based access control
- Customize the UI styling
- Add more features like ticket status updates, filtering, etc.
