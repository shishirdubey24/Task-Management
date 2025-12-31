Full-Stack Todo Application (Auth + Tasks)

This project is a full-stack Todo application with secure authentication, user-scoped tasks, and persistent sessions using JWT (cookie-based) authentication.

The architecture is intentionally split into clear layers so that authentication, authorization, state management, and UI responsibilities do not leak into each other.

1️⃣ Prerequisites

Before running this project, ensure you have:

System Requirements

Node.js ≥ 18

npm or yarn

MongoDB (local or Atlas)

Modern browser (Chrome recommended)

Required Knowledge

React (hooks, context, routing)

Redux Toolkit (async thunks)

Express middleware

JWT authentication basics

HTTP cookies & CORS

2️⃣ Tech Stack
Frontend

React (Vite)

React Router DOM

Redux Toolkit

Axios

Context API (Auth)

Tailwind / custom CSS

Backend

Node.js

Express

MongoDB + Mongoose

JWT

bcrypt

cookie-parser

cors

dotenv

3️⃣ Dependency Overview
Backend (/Backend)
npm install express mongoose jsonwebtoken bcryptjs cors cookie-parser dotenv

Frontend (/Frontend)
npm install react-router-dom axios @reduxjs/toolkit react-redux

4️⃣ High-Level Architecture
Browser
↓
React App
↓
AuthProvider (Context)
↓
ProtectedRoute
↓
Redux Store (Tasks)
↓
Axios (with cookies)
↓
Express API
↓
Auth Middleware
↓
MongoDB

5️⃣ Authentication Design (IMPORTANT)
🔑 Key Decisions

JWT is stored in HTTP-only cookies

Frontend never reads JWT directly

User session is restored using /auth/me

Authorization happens via middleware, not frontend logic

This avoids:

XSS token theft

State duplication

Auth logic inside UI components

6️⃣ Backend: File-by-File Explanation
models/User.js

Defines the user schema.

Stores username, email, password

Password is hashed before saving

Used by auth routes

models/Task.js

Defines task ownership.

Each task belongs to one user

Tasks are always queried using userId

Prevents cross-user data leaks

middleware/auth.js

Central authorization gate.

What it does

Reads JWT from cookies

Verifies token

Extracts userId

Attaches req.userId

If token is missing or invalid → 401 Unauthorized

This middleware protects:

/tasks

/auth/me

routes/auth.js

Handles entire auth lifecycle.

/register

Validates input

Hashes password

Creates user

Issues JWT

Stores JWT in cookie

/login

Verifies credentials

Issues JWT cookie

Returns user info

/me

Protected route

Uses auth middleware

Returns current user

/logout

Clears JWT cookie

Ends session

routes/tasks.js

All routes are protected.

GET /tasks → user-specific paginated tasks

POST /tasks → create task for logged-in user

PUT /tasks/:id → update user’s task

DELETE /tasks/:id → delete user’s task

No route works without authentication.

7️⃣ Frontend: Core Flow
main.jsx

Root of the application.

Wraps app with:

Redux Provider

AuthProvider

BrowserRouter

Order matters:

AuthProvider must wrap routes

Router must wrap all navigation

context/AuthContext.js

Defines shared auth state.

Provides:

user

setUser

loading

No side effects here. Pure context.

context/AuthProvider.jsx

Single source of truth for auth state.

On app load

Calls /auth/me

If cookie valid → sets user

If invalid → sets user = null

Sets loading = false

⚠️ No redirects here (by design)

Router/ProtectedRoute.jsx

Controls access to private routes.

Logic

If loading → wait

If user === null → redirect to /login

Else → render protected component

This avoids infinite redirect loops.

App.jsx

Defines routing.

Private routes are wrapped with ProtectedRoute:

/

/task/:id

/task/edit/:id

Public routes:

/login

/register

8️⃣ Redux: Task State Flow
store/TaskSlice.js

Handles all task operations.

Async Thunks

fetchTasks

getTask

addTask

updateTask

deleteTask

Axios automatically sends cookies (withCredentials = true).

Redux is used only for tasks, not auth.

Why auth is NOT in Redux

Auth is session-based

Context handles lifecycle better

Prevents stale auth state

Avoids token duplication

9️⃣ UI Components Flow
Login.jsx

Sends credentials

Cookie is set by backend

Redirects to /

Does NOT store user manually

Todo.jsx

Reads user from AuthContext

Displays avatar & profile card

Logout clears cookie via backend

TodoForm.jsx

Dispatches addTask

Task is saved with userId server-side

TodoList.jsx

Fetches tasks on mount

Renders user-specific tasks

🔄 End-to-End Data Flow Example
Login → Fetch Tasks
User submits login
↓
Backend sets JWT cookie
↓
Frontend redirects to /
↓
AuthProvider calls /auth/me
↓
User stored in context
↓
ProtectedRoute allows access
↓
TodoList dispatches fetchTasks
↓
Backend filters by req.userId
↓
User sees only their tasks

10️⃣ Constraints & Guarantees
Security

JWT never exposed to JS

Tasks scoped by userId

No unauthorized access

Scalability

Stateless backend

Token-based auth

Easy to add refresh tokens

Maintainability

Auth isolated

UI clean

Predictable data flow

✅ Final Notes

This architecture is:

Production-safe

Scalable

Cleanly separated

Easy to extend

You implemented:

Correct auth lifecycle

Proper protected routing

Secure task ownership

Clean state management

This is not beginner code.
This is how real systems are built.
