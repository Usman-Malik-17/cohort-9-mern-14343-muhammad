# Notes App

A full-stack MERN application that lets authenticated users create, edit, and delete rich-text notes, built as part of the Cohort 9 MERN (Node.js + React.js) assignment for 10Pearls.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Code Quality & Security](#code-quality--security)
- [API Overview](#api-overview)
- [Author](#author)

---

## Overview

Notes App provides secure, per-user note management with a rich-text editor. Every user's notes are private to their own account, and the backend enforces authentication and ownership on every request.

---

## Tech Stack

**Backend**

- Node.js, Express.js
- MongoDB with Mongoose
- JWT (access + refresh tokens) with `httpOnly` cookies
- Pino for structured application logging
- Mocha, Chai, Supertest for backend testing
- SonarQube (SonarCloud) for static code analysis

**Frontend**

- React.js (Vite)
- React Router
- Axios
- TipTap for rich-text editing
- Jest + React Testing Library for frontend testing
- Tailwind CSS

**Tooling**

- Git / GitHub (feature-branch workflow against `develop`)
- CodeRabbit for automated PR review
- ESLint

---

## Features

### Authentication & Authorization

- Sign up, log in, and log out
- Email verification with resend option
- Password hashing with bcrypt
- Access/refresh token flow using `httpOnly`, secure cookies (no tokens exposed to client-side JavaScript)
- Refresh token rotation with reuse detection
- Protected and public route guards on the frontend, backed by server-side session verification

### Notes Management

- Create, read, update, and delete notes
- Rich-text editing (TipTap) with a formatting toolbar
- Tagging support with duplicate-tag prevention
- Search notes by title, content, or tag
- Notes are strictly scoped to their owner — no user can view, edit, or delete another user's notes

### Application Logging

- Structured JSON logging via Pino
- Automatic HTTP request/response logging (method, status, response time)
- Sensitive fields (passwords, tokens, cookies, authorization headers) are redacted from logs
- All exceptions are logged with full context before a response is sent

### Exception Handling

- Centralized error-handling middleware
- Consistent `ApiError` / `ApiResponse` response format across all endpoints
- Input validation via `express-validator` on all write endpoints

### Testing

- Backend integration tests (Mocha/Chai/Supertest) covering the full auth flow and notes CRUD, including ownership checks and error cases
- Frontend unit tests (Jest/React Testing Library) covering key components and user flows

### Code Quality

- SonarQube-integrated static analysis
- Security and Reliability ratings improved to **A** through iterative fixes (NoSQL injection prevention, XSS sanitization, null-safety, ReDoS-safe validation)

---

## Project Structure

```
cohort-9-mern-14343-muhammad/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers (auth, notes)
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── utils/           # ApiError, ApiResponse, logger, mail, etc.
│   │   ├── db/               # MongoDB connection
│   │   └── app.js
│   └── tests/                # Mocha/Chai integration tests
├── src/                       # React frontend
│   ├── pages/                # Login, Signup, Dashboard, NoteEditor, etc.
│   ├── components/           # Reusable UI components
│   ├── api/                  # Axios instance
│   └── routes/                # ProtectedRoute, PublicRoute, router config
├── docs/                      # SonarQube analysis screenshots
├── sonar-project.properties
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas connection string (or local MongoDB instance)
- A Mailtrap (or similar SMTP) account for email verification during development

### Installation

Clone the repository and install dependencies for both the backend and frontend:

```bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-14343-muhammad.git
cd cohort-9-mern-14343-muhammad

# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=8000
NODE_ENV=development
PUBLIC_API_URL=http://localhost:8000

MONGO_URI=<your MongoDB connection string>
MONGO_URI_TEST=<a separate MongoDB database used only for running tests>

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=<your secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<your secret>
REFRESH_TOKEN_EXPIRY=10d

MAILTRAP_SMTP_HOST=<your Mailtrap host>
MAILTRAP_SMTP_PORT=<your Mailtrap port>
MAILTRAP_SMTP_USER=<your Mailtrap user>
MAILTRAP_SMTP_PASS=<your Mailtrap password>

LOG_LEVEL=info
```

Create a `.env` file in the frontend root with:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

> **Note:** `MONGO_URI_TEST` should point to a separate, disposable database — the test suite creates and deletes data in it on every run.

---

## Running the App

**Start the backend:**

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:8000`.

**Start the frontend:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Testing

**Backend (Mocha/Chai/Supertest):**

```bash
cd backend
npm test
```

Runs integration tests against the isolated test database defined in `MONGO_URI_TEST`, covering:

- Registration, login, logout, current user, and token refresh
- Notes CRUD, including invalid-ID handling and cross-user ownership protection

**Frontend (Jest):**

```bash
npm test
```

Covers key page components including Login, Signup, and Dashboard.

---

## Code Quality & Security

This project is integrated with **SonarQube (SonarCloud)** for static code analysis. Key improvements made during development, with before/after evidence in `docs/`:

| Metric                 | Before | After |
| ---------------------- | ------ | ----- |
| Security Rating        | E      | A     |
| Reliability Rating     | C      | A     |
| Maintainability Rating | A      | A     |

Notable fixes applied:

- Removed a host-header injection vulnerability in email verification links (now uses a configured `PUBLIC_API_URL` instead of trusting request headers)
- Removed access/refresh tokens from JSON API responses — tokens are transmitted only via `httpOnly` cookies
- Added runtime input-type validation and schema-level validators to prevent NoSQL query injection
- Sanitized rendered note content with DOMPurify to prevent stored XSS
- Simplified regular expressions to eliminate ReDoS (catastrophic backtracking) risk
- Added Pino log redaction for cookies, authorization headers, and tokens

All pull requests were reviewed via **CodeRabbit**, with security, reliability, and correctness findings addressed prior to merge.

---

## API Overview

All endpoints are prefixed with `/api/v1`.

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and receive session cookies |
| POST | `/auth/logout` | Log out and invalidate the session |
| GET | `/auth/verify-email/:token` | Verify a user's email |
| POST | `/auth/resend-email-verification` | Resend the verification email |
| POST | `/auth/refresh-token` | Issue a new access token |
| POST | `/auth/current-user` | Get the authenticated user's profile |

**Notes** (all require authentication)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes` | Get all notes for the current user |
| POST | `/notes` | Create a new note |
| GET | `/notes/:noteId` | Get a single note by ID |
| PATCH | `/notes/:noteId` | Update a note |
| DELETE | `/notes/:noteId` | Delete a note |

---

## Author

**Muhammad Usman Malik**
Cohort 9 — MERN (Node.js + React.js), 10Pearls
