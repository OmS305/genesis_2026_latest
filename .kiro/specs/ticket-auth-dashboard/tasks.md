# Implementation Plan

- [ ] 1. Setup backend dependencies and environment
  - Install bcryptjs and jsonwebtoken packages in Backend folder
  - Add JWT_SECRET to .env file
  - _Requirements: 2.2, 2.5, 6.3_

- [ ] 2. Create User model and authentication middleware
  - [ ] 2.1 Create Backend/models/User.js with schema (name, email, password, role, createdAt)
    - Define Mongoose schema with required fields and unique email index
    - _Requirements: 1.1, 1.2_
  
  - [ ] 2.2 Create Backend/models/Ticket.js by moving existing Ticket model
    - Extract Ticket model from server.js into separate file
    - Export model for use in routes
    - _Requirements: 8.1, 8.2_
  
  - [ ] 2.3 Create Backend/middleware/auth.js with JWT verification
    - Implement verifyToken middleware that extracts JWT from Authorization header
    - Decode token and attach user data (userId, email, role) to req.user
    - Return 401 error for invalid or missing tokens
    - _Requirements: 6.3, 6.4, 6.5_

- [ ] 3. Implement authentication routes
  - [ ] 3.1 Create Backend/routes/authRoutes.js with signup endpoint
    - Implement POST /api/auth/signup route
    - Validate email format and required fields
    - Check if email already exists in database
    - Hash password using bcryptjs before saving
    - Return success message or error
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [ ] 3.2 Add login endpoint to authRoutes.js
    - Implement POST /api/auth/login route
    - Find user by email
    - Compare submitted password with hashed password using bcryptjs
    - Generate JWT token with userId, email, and role
    - Return token and user data or error
    - _Requirements: 2.1, 2.2, 2.5_

- [ ] 4. Implement ticket routes with role-based access
  - [ ] 4.1 Create Backend/routes/ticketRoutes.js with GET /api/tickets endpoint
    - Apply verifyToken middleware to protect route
    - Check user role from req.user
    - If admin: return all tickets from database
    - If user: filter tickets where ticket.email matches req.user.email
    - Return tickets array with success response
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_

- [ ] 5. Update server.js to integrate new routes
  - [ ] 5.1 Import and configure new routes in server.js
    - Import authRoutes and ticketRoutes
    - Import User and Ticket models
    - Mount authRoutes at /api/auth
    - Mount ticketRoutes at /api
    - Keep existing /addTicket endpoint unchanged
    - _Requirements: 8.3_

- [ ] 6. Initialize React frontend project
  - [ ] 6.1 Create React app in frontend folder
    - Run create-react-app or vite to initialize project
    - Install dependencies: react-router-dom, axios
    - _Requirements: 7.1, 7.2_
  
  - [ ] 6.2 Setup Tailwind CSS
    - Install tailwindcss, postcss, autoprefixer
    - Configure tailwind.config.js with dark theme colors
    - Update index.css with Tailwind directives and custom dark theme styles
    - _Requirements: 7.3_

- [ ] 7. Create authentication context and API service
  - [ ] 7.1 Create frontend/src/context/AuthContext.jsx
    - Implement AuthContext with state for user, token, isAuthenticated
    - Create login function that stores token in localStorage
    - Create logout function that removes token from localStorage
    - Create signup function for user registration
    - Load token from localStorage on initialization
    - Provide context to app via AuthProvider
    - _Requirements: 2.3, 5.1, 5.2, 5.4_
  
  - [ ] 7.2 Create frontend/src/services/api.js
    - Create axios instance with baseURL http://localhost:5000
    - Add request interceptor to attach JWT token to Authorization header
    - Export signup function (POST /api/auth/signup)
    - Export login function (POST /api/auth/login)
    - Export getTickets function (GET /api/tickets)
    - _Requirements: 6.3_

- [ ] 8. Build authentication pages
  - [ ] 8.1 Create frontend/src/pages/Signup.jsx
    - Create form with fields: name, email, password, role (dropdown: admin/user)
    - Implement form validation for email format
    - Call signup API on form submit
    - Display error messages for validation or API errors
    - Redirect to /login on successful signup
    - Style with dark theme using Tailwind CSS
    - _Requirements: 1.1, 1.4, 1.5, 7.1, 7.5_
  
  - [ ] 8.2 Create frontend/src/pages/Login.jsx
    - Create form with fields: email, password
    - Call login API on form submit
    - Store token and user data using AuthContext
    - Display error messages for invalid credentials
    - Redirect to /dashboard on successful login
    - Style with dark theme using Tailwind CSS
    - _Requirements: 2.1, 2.3, 2.4, 7.2, 7.5_

- [ ] 9. Build dashboard and ticket display components
  - [ ] 9.1 Create frontend/src/components/ProtectedRoute.jsx
    - Check authentication status from AuthContext
    - Redirect to /login if not authenticated
    - Render children if authenticated
    - _Requirements: 6.1, 6.2_
  
  - [ ] 9.2 Create frontend/src/pages/Dashboard.jsx
    - Fetch tickets using getTickets API on component mount
    - Display loading state while fetching
    - Display empty state if no tickets found
    - Render ticket list using TicketTable component
    - Include logout button that calls AuthContext.logout
    - Handle API errors and redirect to login on 401
    - Style with dark theme
    - _Requirements: 3.2, 3.4, 3.5, 4.2, 4.4, 4.5, 5.3, 7.4_
  
  - [ ] 9.3 Create frontend/src/components/TicketTable.jsx
    - Accept tickets array as prop
    - Display tickets in table format with columns: ID, Email, Subject, Message, Date
    - Format createdAt date for readability
    - Style with dark theme, alternating row colors, hover effects
    - Make responsive for mobile devices
    - _Requirements: 3.2, 4.2, 7.4_

- [ ] 10. Setup routing and integrate all components
  - [ ] 10.1 Create frontend/src/App.jsx with routing
    - Import and setup React Router
    - Wrap app with AuthProvider
    - Define routes: / (redirect to /login), /login, /signup, /dashboard
    - Wrap /dashboard with ProtectedRoute
    - _Requirements: 6.1, 6.2_
  
  - [ ] 10.2 Update frontend/src/index.js
    - Import and render App component
    - Import index.css for Tailwind styles
    - _Requirements: 7.3_

- [ ] 11. Test complete authentication flow
  - [ ] 11.1 Test backend API endpoints
    - Start backend server
    - Test POST /api/auth/signup with valid data
    - Test POST /api/auth/login with created user
    - Test GET /api/tickets with admin token (should return all tickets)
    - Test GET /api/tickets with user token (should return filtered tickets)
    - Test GET /api/tickets without token (should return 401)
    - _Requirements: 1.1, 2.1, 3.1, 4.1_
  
  - [ ] 11.2 Test frontend application
    - Start frontend development server
    - Test signup flow: create admin and normal user accounts
    - Test login flow: login with both user types
    - Test dashboard: verify admin sees all tickets, user sees only their tickets
    - Test logout: verify token is cleared and redirect to login
    - Test protected route: try accessing /dashboard without login
    - Test page refresh: verify auth state persists
    - _Requirements: 1.4, 2.4, 3.2, 4.2, 5.1, 5.2, 6.1_
