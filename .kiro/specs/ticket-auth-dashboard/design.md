# Design Document

## Overview

This design extends the existing Node.js/Express backend with authentication capabilities and builds a complete React frontend with role-based access control. The system will add user management, JWT authentication, and a dashboard interface for viewing tickets based on user roles. Tickets already exist in the MongoDB database and will be fetched through the backend API.

### Key Design Principles

- **Minimal Backend Changes**: Preserve existing MongoDB connection and ticket schema
- **Security First**: Implement JWT authentication, password hashing, and protected routes
- **Role-Based Access**: Enforce ticket visibility rules at the API layer
- **Clean Separation**: Backend handles business logic and data access; frontend handles presentation and user interaction
- **Dark Theme UI**: Minimalist, clean interface with focus on usability

## Architecture

### System Architecture

```
┌─────────────────┐
│   React Frontend│
│   (Port 3000)   │
└────────┬────────┘
         │
         │ HTTP + JWT
         │
    ┌────▼────────┐
    │   Express   │
    │   Backend   │
    │ (Port 5000) │
    └────┬────────┘
         │
    ┌────▼─────────┐
    │   MongoDB    │
    │    Atlas     │
    │              │
    │  - users     │
    │  - tickets   │
    └──────────────┘
```

**Key Points:**
- React frontend communicates with backend using JWT authentication
- Backend is the single point of access to MongoDB
- All database operations go through the Express backend
- Tickets are fetched from the existing tickets collection in MongoDB

### Technology Stack

**Backend:**
- Node.js + Express (existing)
- MongoDB + Mongoose (existing)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (existing)
- dotenv (existing)

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Axios (HTTP client)

## Components and Interfaces

### Backend Components

#### 1. Models (`Backend/models/`)

**User.js**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'user'], required),
  createdAt: Date (default: Date.now)
}
```

**Ticket.js** (existing, moved to models folder)
```javascript
{
  email: String,
  subject: String,
  message: String,
  createdAt: Date (default: Date.now)
}
```

#### 2. Middleware (`Backend/middleware/`)

**auth.js**
- `verifyToken`: Extracts and verifies JWT from Authorization header
- Attaches decoded user data (email, role, userId) to req.user
- Returns 401 if token is invalid or missing

#### 3. Routes (`Backend/routes/`)

**authRoutes.js**
- `POST /api/auth/signup`: Create new user with hashed password
- `POST /api/auth/login`: Authenticate user and return JWT

**ticketRoutes.js**
- `GET /api/tickets`: Get tickets (filtered by role)
  - Admin: returns all tickets
  - User: returns tickets where ticket.email === user.email

#### 4. Updated server.js

- Import and use new routes
- Maintain existing `/addTicket` endpoint for n8n
- Keep existing MongoDB connection
- Add JWT_SECRET to .env

### Frontend Components

#### Directory Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── TicketCard.jsx
│   │   └── TicketTable.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

#### Component Descriptions

**1. AuthContext.jsx**
- Manages authentication state (user, token, isAuthenticated)
- Provides login, logout, and signup functions
- Persists token to localStorage
- Loads token on app initialization

**2. ProtectedRoute.jsx**
- Wraps routes that require authentication
- Redirects to /login if not authenticated
- Uses AuthContext to check auth status

**3. Login.jsx**
- Email and password input fields
- Calls /api/auth/login
- Stores JWT and redirects to /dashboard
- Displays error messages

**4. Signup.jsx**
- Name, email, password, and role dropdown
- Calls /api/auth/signup
- Redirects to /login on success
- Validates email format
- Displays error messages

**5. Dashboard.jsx**
- Fetches tickets from /api/tickets with JWT
- Displays loading state while fetching
- Shows empty state if no tickets
- Renders TicketTable or TicketCard components
- Includes logout button

**6. TicketTable.jsx / TicketCard.jsx**
- Displays ticket data in table or card format
- Shows: ticketId (_id), email, subject, message, createdAt
- Dark theme styling with Tailwind

**7. api.js**
- Axios instance with baseURL (http://localhost:5000)
- Interceptor to attach JWT to Authorization header
- Exported functions: signup, login, getTickets

**8. App.jsx**
- React Router setup
- Routes: /, /login, /signup, /dashboard
- Wraps app with AuthContext.Provider
- Redirects / to /login

## Data Models

### User Collection

```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // bcrypt hashed
  role: "user", // or "admin"
  createdAt: ISODate("2026-02-06T...")
}
```

**Indexes:**
- email: unique index

### Tickets Collection (existing)

```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  subject: "Support Request",
  message: "Need help with...",
  createdAt: ISODate("2026-02-06T...")
}
```

**Note:** No changes to existing schema to preserve n8n compatibility

## API Endpoints

### Authentication Endpoints

**POST /api/auth/signup**
```
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}

Response (201):
{
  "success": true,
  "message": "User created successfully"
}

Response (400):
{
  "error": "Email already exists"
}
```

**POST /api/auth/login**
```
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Response (401):
{
  "error": "Invalid credentials"
}
```

### Ticket Endpoints

**GET /api/tickets** (Protected)
```
Headers:
Authorization: Bearer <jwt_token>

Response (200) - Admin:
{
  "success": true,
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user1@example.com",
      "subject": "Issue 1",
      "message": "Description...",
      "createdAt": "2026-02-06T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "email": "user2@example.com",
      "subject": "Issue 2",
      "message": "Description...",
      "createdAt": "2026-02-06T11:00:00.000Z"
    }
  ]
}

Response (200) - Normal User:
{
  "success": true,
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "subject": "My Issue",
      "message": "Description...",
      "createdAt": "2026-02-06T10:00:00.000Z"
    }
  ]
}

Response (401):
{
  "error": "Unauthorized"
}
```

**POST /addTicket** (Existing - Kept for compatibility)
```
Request:
{
  "email": "user@example.com",
  "subject": "Support Request",
  "message": "Need help..."
}

Response (200):
{
  "success": true,
  "message": "Ticket stored successfully",
  "data": { ... }
}

Note: This endpoint is maintained from the existing implementation.
```

## Security Implementation

### Password Hashing
- Use bcryptjs with salt rounds = 10
- Hash password before storing in database
- Compare hashed passwords during login

### JWT Authentication
- Sign tokens with HS256 algorithm
- Include payload: { userId, email, role }
- Set expiration: 24 hours
- Store JWT_SECRET in .env file
- Verify token on protected routes

### Frontend Security
- Store JWT in localStorage
- Include token in Authorization header: `Bearer <token>`
- Clear token on logout
- Redirect to login on 401 responses
- No sensitive data in JWT payload

### CORS Configuration
- Allow frontend origin (http://localhost:3000)
- Allow credentials for JWT authentication

## Error Handling

### Backend Error Handling

**Authentication Errors:**
- 400: Validation errors (missing fields, invalid email format)
- 401: Invalid credentials or expired token
- 409: Email already exists

**Ticket Errors:**
- 401: Missing or invalid token
- 500: Database errors

**Error Response Format:**
```javascript
{
  "error": "Error message description"
}
```

### Frontend Error Handling

**API Call Errors:**
- Display error messages in UI
- Show toast/alert for network errors
- Redirect to login on 401
- Form validation before submission

**Loading States:**
- Show spinner while fetching data
- Disable buttons during submission
- Display "Loading..." text

**Empty States:**
- "No tickets found" message
- Friendly empty state UI

## Testing Strategy

### Backend Testing

**Manual Testing:**
1. Test signup with valid/invalid data
2. Test login with correct/incorrect credentials
3. Test /api/tickets as admin (should see all tickets)
4. Test /api/tickets as user (should see filtered tickets)
5. Test /addTicket endpoint (should work)
6. Test protected routes without token (should return 401)

**Test Data:**
- Create admin user: admin@test.com / admin123
- Create normal user: user@test.com / user123
- Create tickets with different emails

### Frontend Testing

**Manual Testing:**
1. Test signup flow and redirect to login
2. Test login flow and redirect to dashboard
3. Test protected route access without login
4. Test dashboard displays correct tickets
5. Test logout clears token and redirects
6. Test page refresh maintains auth state
7. Test responsive design on different screen sizes

**Browser Testing:**
- Chrome, Firefox, Safari
- Test localStorage persistence
- Test JWT expiration handling

## UI/UX Design

### Color Scheme (Dark Theme)
- Background: #0a0a0a (near black)
- Secondary Background: #1a1a1a (dark gray)
- Text Primary: #ffffff (white)
- Text Secondary: #a0a0a0 (light gray)
- Accent: #3b82f6 (blue)
- Error: #ef4444 (red)
- Success: #10b981 (green)

### Typography
- Font: System font stack (sans-serif)
- Headings: 24px-32px, font-weight: 600
- Body: 14px-16px, font-weight: 400
- Buttons: 14px, font-weight: 500

### Layout
- Max width: 1200px
- Padding: 16px-24px
- Border radius: 8px
- Card shadows: subtle

### Components Style

**Forms:**
- Input fields: dark background, light border, white text
- Labels: light gray, 14px
- Buttons: blue accent, white text, hover effect
- Error messages: red text below fields

**Dashboard:**
- Header with logout button
- Ticket count display
- Table/Card grid layout
- Responsive: stack on mobile

**Tickets Display:**
- Card: dark gray background, rounded corners
- Table: alternating row colors, hover effect
- Columns: ID, Email, Subject, Message, Date

## Implementation Notes

### Backend Dependencies to Add
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0"
}
```

### Environment Variables
```
# Backend/.env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secure_random_secret_key_here
PORT=5000
```

### Development Workflow
1. Install backend dependencies
2. Add JWT_SECRET to .env
3. Create backend folder structure (models, routes, middleware)
4. Implement authentication logic
5. Test backend endpoints with Postman/Thunder Client
6. Initialize React app in frontend folder
7. Install frontend dependencies and setup Tailwind
8. Implement authentication context and API service
9. Build pages and components
10. Test full authentication flow
11. Test role-based ticket access

### Deployment Considerations
- Set NODE_ENV=production
- Use strong JWT_SECRET
- Enable HTTPS
- Configure CORS for production domain
- Set appropriate JWT expiration
- Add rate limiting for auth endpoints
- Consider refresh token implementation for production
