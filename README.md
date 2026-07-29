# ShiftGrid - Event Workforce & Logistics Coordination Platform

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Flask](https://img.shields.io/badge/Backend-Flask-000000)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)

ShiftGrid is a full-stack workforce management platform designed for coordinating volunteers and staff at events. Unlike spreadsheet-based scheduling systems, ShiftGrid enforces scheduling rules at the database and API level to ensure volunteers are only assigned to appropriate shifts while preventing scheduling conflicts.

The project consists of a **React Single Page Application (SPA)** frontend and a **Flask REST API** backend communicating through JSON over HTTPS.

---

# Table of Contents

* [Project Overview](#project-overview)
* [Problem Statement](#problem-statement)
* [Solution](#solution)
* [Features](#features)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Database Design](#database-design)
* [API Endpoints](#api-endpoints)
* [Frontend Routes](#frontend-routes)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Testing](#testing)
* [Deployment](#deployment)
* [Team Responsibilities](#team-responsibilities)
* [Future Improvements](#future-improvements)
* [License](#license)

---

# Project Overview

**ShiftGrid** helps organizers efficiently manage event volunteers, staff assignments, locations, certifications, and scheduling.

The name reflects the application's purpose:

* **Shift** — time-based blocks of work assigned to volunteers.
* **Grid** — the structured relationships between users, locations, skills, and schedules.

Rather than relying solely on frontend validation, ShiftGrid enforces business rules directly within the backend and database to maintain data integrity.

---

# Problem Statement

Many volunteer management systems still rely on spreadsheets or generic task management tools, which often lead to:

* Volunteers assigned to roles without required certifications.
* Double-booked volunteers across overlapping shifts.
* Limited visibility into staffing shortages.
* Manual verification of volunteer qualifications.
* Difficulty managing large events with multiple locations.

---

# Solution

ShiftGrid addresses these issues through backend-enforced business rules.

### Skill-Gated Shift Claiming

Volunteers may only claim shifts if they possess the required verified skills stored in the `user_skills` relationship.

### Collision Detection

Before assigning a shift, the backend checks whether the volunteer already has another overlapping shift.

### JWT Authentication

Authentication is handled using JSON Web Tokens.

Role-based authorization ensures:

* **Admins** manage locations and shifts.
* **Volunteers** browse and claim available shifts.

### Volunteer Preferences

Each volunteer can configure:

* Preferred event locations
* Preferred shift times
* Preferred event types

These preferences help prioritize relevant opportunities while still enforcing all scheduling and certification requirements.

---

# Features

## Authentication

* User registration
* Secure login
* JWT authentication
* Password hashing (Bcrypt)
* Forgot Password workflow
* Password Reset workflow

## Volunteer Features

* Browse available shifts
* Claim eligible shifts
* View assigned shifts
* Manage profile
* View verified skills
* Update volunteer preferences

## Administrator Features

* Create shifts
* Update shifts
* Delete shifts
* Create event locations
* Update event locations
* Delete event locations

## Scheduling Logic

* Prevent overlapping shifts
* Validate required skills
* Protected API endpoints
* Role-based permissions

---

# System Architecture

```text
                JSON over HTTPS

+-------------------------+
|      React Frontend     |
|     (Vite + React)      |
+-----------+-------------+
            |
            |
            v
+-------------------------+
|     Flask REST API      |
| JWT Authentication      |
| Business Logic          |
| SQLAlchemy ORM          |
+-----------+-------------+
            |
            |
            v
+-------------------------+
| SQLite / PostgreSQL DB  |
+-------------------------+
```

Frontend and backend are separate applications connected exclusively through REST APIs.

---

# Technology Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

## Backend

* Flask
* Flask-JWT-Extended
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-CORS
* Bcrypt

## Database

* SQLite (development)
* PostgreSQL (production)

---

# Project Structure

```text
ShiftGrid/

├── backend/
│   ├── app/
│   │   ├── models.py
│   │   ├── routes/
│   │   ├── auth/
│   │   ├── services/
│   │   ├── utils/
│   │   └── __init__.py
│   │
│   ├── migrations/
│   ├── seed.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# Database Design

## Models

### User

* username
* email
* password_hash
* role
* created_at

### UserPreference

* user_id
* preferred_location
* preferred_shift_time
* preferred_event_type
* updated_at

### SkillTag

* name
* description
* difficulty_level
* created_at

### EventLocation

* name
* address
* capacity
* notes

### Shift

* role_title
* required_skill
* start_time
* end_time
* user_id
* location_id

### PasswordResetToken

* email
* token_string
* expires_at
* is_used

---

## Relationships

```text
User
 │
 ├────< Shift
 │
 ├────< UserPreference
 │
 └────< user_skills >──── SkillTag

EventLocation
      │
      └────< Shift
```

---

# Frontend Routes

| Route            | Authentication | Description                  |
| ---------------- | -------------- | ---------------------------- |
| /login           | Public         | Login page                   |
| /register        | Public         | Registration                 |
| /forgot-password | Public         | Request password reset       |
| /reset-password  | Public         | Reset password               |
| /dashboard       | Protected      | Dashboard                    |
| /shifts          | Protected      | Browse and claim shifts      |
| /locations       | Protected      | View event locations         |
| /admin           | Admin          | Manage shifts and locations  |
| /profile         | Protected      | User profile and preferences |

---

# API Endpoints

## Authentication

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | `/api/auth/register`        |
| POST   | `/api/auth/login`           |
| POST   | `/api/auth/forgot-password` |
| POST   | `/api/auth/reset-password`  |
| GET    | `/api/auth/me`              |

## Shift Management

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | `/api/shifts`            |
| POST   | `/api/shifts/create`     |
| POST   | `/api/shifts/:id/claim`  |
| PUT    | `/api/shifts/:id/update` |
| DELETE | `/api/shifts/:id/delete` |

## Location Management

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | `/api/locations`            |
| POST   | `/api/locations/create`     |
| PUT    | `/api/locations/:id/update` |
| DELETE | `/api/locations/:id/delete` |

## Preferences

| Method | Endpoint           |
| ------ | ------------------ |
| PUT    | `/api/preferences` |

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/ShiftGrid.git

cd ShiftGrid
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

Windows

```bash
venv\Scripts\activate
```

macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
flask db upgrade
```

Seed the database

```bash
python seed.py
```

Run the backend

```bash
flask run
```

Backend runs at:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

Create a `.env` file inside the backend directory.

```env
FLASK_APP=run.py
FLASK_ENV=development

SECRET_KEY=your-secret-key

JWT_SECRET_KEY=your-jwt-secret

DATABASE_URL=sqlite:///shiftgrid.db
```

## Frontend

```env
VITE_API_URL=http://localhost:5000
```

---

# Running the Project

Start the backend:

```bash
cd backend

flask run
```

Start the frontend:

```bash
cd frontend

npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Testing

Recommended testing checklist:

* User Registration
* Login
* JWT Authentication
* Password Reset
* Protected Routes
* Shift CRUD
* Location CRUD
* Shift Claiming
* Skill Validation
* Collision Detection
* Volunteer Preferences
* Admin Authorization

Backend APIs can be tested using Postman or Insomnia.

---

# Deployment

## Backend

Recommended platforms:

* Render
* Railway

## Frontend

Recommended platforms:

* Vercel
* Netlify

Before deployment:

* Configure production environment variables.
* Update frontend API URL.
* Configure production database.
* Run database migrations.

---

# Team Responsibilities

## Person A

* Database models
* SQLAlchemy configuration
* Flask application factory
* Database migrations
* Seed data
* Environment configuration

## Person B

* Authentication
* JWT
* Password reset
* Shift APIs
* Location APIs
* Business logic
* Collision detection
* Skill validation

## Person C

* React application
* Routing
* Authentication UI
* Shared layout
* Tailwind CSS
* Protected routes

## Person D

* Dashboard
* Shift management UI
* Location management UI
* Admin panel
* Profile page
* API integration
* Frontend deployment

---

# Future Improvements

* Email notifications for shift assignments
* Calendar synchronization
* QR code volunteer check-in
* SMS reminders
* Advanced shift recommendation engine
* Admin analytics dashboard
* Live event staffing overview
* Multi-event support
* Organization management
* Audit logging

---

# License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.
