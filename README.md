# Task Manager – Full Stack Assignment (Binaried)

A simple full-stack Task Manager application built with **Angular**, **Node.js/Express**, and **MongoDB**, created for the AI Full Stack Developer Intern assignment.

Users can register, log in, and manage their own tasks (create, view, update, delete). Each user only sees their own tasks — authentication is handled with JWT.

---

## Tech Stack

- **Frontend:** Angular 17 (standalone components), TypeScript, plain CSS (responsive)
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens) + bcrypt for password hashing

---

## Project Structure

```
binaried-assignment/
├── backend/
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # Express routes (auth, tasks)
│   ├── middleware/      # JWT auth middleware
│   ├── server.js        # App entry point
│   └── .env.example     # Environment variable template
└── frontend/
    └── src/app/
        ├── auth/         # Login & Register components
        ├── tasks/         # Task list (CRUD UI)
        ├── services/      # AuthService, TaskService
        ├── guards/        # Route guard for protected pages
        └── interceptors/  # Attaches JWT to outgoing requests
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` with your own values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
```

Run the server:

```bash
npm run dev      # with nodemon
# or
npm start
```

Server runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:4200`. Make sure the backend is running first — the API URL is set in `src/environments/environment.ts` (defaults to `http://localhost:5000/api`).

### 3. Try it out

1. Go to `http://localhost:4200`
2. Register a new account
3. Add, edit, and delete tasks from the dashboard

---

## AI Tools Used

I used **Claude** during this assignment as my main AI pair-programmer. It helped me:

- Scaffold the overall project structure (backend routes/models, frontend components/services) quickly, following standard MVC/Angular conventions.
- Generate boilerplate for JWT auth (middleware, token signing/verification) and bcrypt password hashing.
- Write the Angular standalone component setup (routes, guards, HTTP interceptor for attaching the JWT token).
- Suggest a clean, responsive CSS layout without pulling in a heavy UI framework.

## Where AI Helped

- Speeding up repetitive boilerplate (Express route handlers, Mongoose schemas, Angular service classes).
- Getting the JWT auth flow (interceptor + guard + backend middleware) right on the first pass instead of debugging typical token-header mistakes.
- Producing consistent, readable code structure across frontend and backend.

## What I Implemented / Reviewed Myself

- Went through every generated file to understand the JWT flow end-to-end (issuing, storing, attaching, verifying tokens).
- Verified the CRUD routes were scoped correctly to the logged-in user (`user: req.user.id` on every Task query) so users can't see each other's tasks.
- Checked the Angular reactive flow — form state, edit/cancel logic, and error handling in `task-list.component.ts`.
- Adjusted the responsive CSS breakpoints and tested the layout at mobile widths.

## Challenges Faced

- Making sure the task list only returns tasks belonging to the authenticated user (not all tasks in the collection) — solved by filtering every Mongoose query with `req.user.id` from the decoded JWT.
- Keeping the Angular app framework-light (no NgRx, no UI library) while still having clean state management for the CRUD form — handled with simple component-level state instead of over-engineering it for a small assignment.

## If I Had More Time, I Would

- Add form validation feedback (e.g., using Angular Reactive Forms instead of template-driven forms) with inline field-level errors.
- Add pagination/filtering/search for the task list.
- Add unit tests (Jasmine/Karma for Angular, Jest/Supertest for the backend).
- Add refresh tokens and a "remember me" option instead of a single long-lived JWT.
- Deploy the app (e.g., frontend on Vercel/Netlify, backend on Render, DB on MongoDB Atlas) for a live demo link.

---

## API Endpoints (Backend Reference)

| Method | Endpoint             | Description             | Auth Required |
|--------|-----------------------|--------------------------|----------------|
| POST   | `/api/auth/register`  | Register new user       | No             |
| POST   | `/api/auth/login`     | Login                   | No             |
| GET    | `/api/tasks`          | Get all tasks (own)     | Yes            |
| POST   | `/api/tasks`          | Create task              | Yes            |
| PUT    | `/api/tasks/:id`      | Update task              | Yes            |
| DELETE | `/api/tasks/:id`      | Delete task              | Yes            |
