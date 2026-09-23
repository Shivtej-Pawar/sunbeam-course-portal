# Sunbeam Student Course Portal

A full-stack course management portal built for Sunbeam Institute, with separate **Student** and **Admin** experiences. Students can browse courses, enroll, and access course videos; Admins can manage courses, videos, and enrolled students — all behind JWT-based, role-protected authentication.

## Tech Stack

**Frontend:** React 19 (Vite), React Router v7, Axios, React Toastify
**Backend:** Python, Flask, Flask-JWT-Extended, Flask-CORS, Passlib (sha256_crypt)
**Database:** MySQL (via `mysql-connector-python`)
**API Testing:** Postman (collection included in repo)

## Features

### Public
- Browse all courses and active/ongoing courses
- View course details, fees, and schedule
- Register to a course (auto-creates a student account with a default password)
- Student and Admin login

### Student (JWT-protected)
- View enrolled courses ("My Courses")
- Access course videos (YouTube-hosted) for enrolled courses only
- View and update profile (change password)
- Upload and retrieve profile picture
- Check enrollment status for a given course

### Admin (JWT-protected, role-restricted)
- Full CRUD on courses (add, update, delete, list with student counts)
- Full CRUD on videos (add, update, delete, list by course)
- View enrolled students, optionally filtered by course

## Project Structure

```
sunbeam-course-portal-main/
├── Backend/
│   ├── app.py                  # Flask app entry point, blueprint registration, CORS/JWT setup
│   ├── routes/
│   │   ├── users.py            # Student/Admin login (JWT issuance)
│   │   ├── course.py           # Course CRUD + active-course listing
│   │   ├── students.py         # Registration, profile, enrollment, video access
│   │   ├── videos.py           # Video CRUD
│   │   └── admin.py            # Enrolled-students lookup (admin only)
│   └── utils/
│       ├── db.py                # MySQL connection + query execution helper
│       └── util.py              # JWT setup, standardized JSON response helper
├── Frontend/frontend/
│   ├── src/
│   │   ├── pages/               # Home, Login, Register, Courses, Videos, About
│   │   ├── pages/Admin/         # ManageCourses, ManageVideos, StudentList
│   │   ├── components/          # Navbar, ProtectedRoute, ProfileModal
│   │   └── services/            # Axios-based API service modules
│   └── vite.config.js
├── database/
│   └── schema.sql               # MySQL schema (users, courses, students, videos)
└── Sunbeam-student-course-portal.postman_collection.json
```

## Database Schema

Four core tables with foreign-key relationships:

- **users** — email, password (hashed), role (`admin` / `student`)
- **courses** — course_id, course_name, description, fees, start_date, end_date, video_expire_days
- **students** — reg_no, name, email (→ users), course_id (→ courses), mobile_no, profile_pic (BLOB)
- **videos** — video_id, course_id (→ courses), title, youtube_url, description, added_at

## API Overview

20 REST endpoints across 5 blueprints:

| Module | Endpoints |
|---|---|
| `users` (`/users`) | Student login, Admin login |
| `course` (`/course`) | List all courses, list active courses, add, update, delete |
| `students` (`/student`) | Register to course, change password, my courses, my courses with videos, upload/get profile picture, get profile, check enrollment |
| `videos` (`/video`) | List all videos (optionally by course), add, update, delete |
| `admin` (`/admin`) | List enrolled students (optionally by course) |

All write operations and student/admin-only reads are protected with `@jwt_required()`, with role checks (`admin` / `student`) enforced inside each handler.

## Setup

### Backend
```bash
cd Backend
pip install flask flask-cors flask-jwt-extended passlib mysql-connector-python
python app.py
```
Configure your MySQL credentials in `Backend/utils/db.py` and set the `MY_JWT_SECRET` environment variable for production use (defaults to a dev secret otherwise). Run `database/schema.sql` against your MySQL instance to create the required tables.

### Frontend
```bash
cd Frontend/frontend
npm install
npm run dev
```
The frontend expects the backend at `http://127.0.0.1:5000` (see `src/services/config.js`).

## API Testing

A ready-to-import Postman collection is included at the project root: `Sunbeam-student-course-portal.postman_collection.json`.

## Security Notes

- Passwords are hashed with `passlib`'s `sha256_crypt` before storage.
- JWT secret is read from an environment variable (`MY_JWT_SECRET`) with a development fallback — **set a real secret before deploying**.
- CORS is currently scoped to `http://localhost:5173` (the Vite dev server) — update this for production origins.
