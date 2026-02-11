# HRMS Lite — Human Resource Management System

A lightweight, production-grade full-stack HRMS application for managing employee records and tracking daily attendance.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Tech Stack](https://img.shields.io/badge/Django-6-green) ![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-blue)

---

## Project Overview

HRMS Lite is a web-based HR tool that enables an admin to:

- **Manage employees** — Add, edit, view, search, and delete employee records
- **Track attendance** — Mark daily attendance (Present / Absent) for each employee, with date filtering
- **View dashboard** — Summary cards, department breakdown, attendance rate, and recent activity

The application is designed as a single-admin system with a clean, professional ERP-style interface.

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, Material UI 6, Tailwind CSS 3, Vite 6 |
| Backend    | Django 6, Django REST Framework                  |
| Database   | PostgreSQL (primary) / SQLite (fallback)         |
| HTTP       | Axios                                            |
| Icons      | Lucide React                                     |
| Routing    | React Router DOM 7                               |

---

## Features

### Core

- Employee CRUD (Create, Read, Update, Delete)
- Unique Employee ID and Email validation with server-side error handling
- Attendance marking per employee per day (upsert logic)
- Per-employee attendance history with date range filtering
- Proper HTTP status codes and meaningful error messages
- Loading, empty, and error UI states throughout

### Bonus

- **Dashboard** with KPI summary cards (total employees, present/absent today, departments)
- **Department breakdown** with visual progress bars
- **Today's attendance rate** percentage bar
- **Recent attendance activity** feed
- **Dedicated Attendance page** — view and mark attendance for all employees on any date
- **Employee search** across all fields (name, email, ID, department)
- **Department filter** dropdown
- **Total present days** displayed per employee in the table
- **Edit employee** support (inline editing via dialog)
- **Responsive design** with collapsible sidebar for mobile

---

## Project Structure

```
HRMS LITE/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── employees/
│   │   ├── models.py          # Employee & Attendance models
│   │   ├── serializers.py     # DRF serializers with validation
│   │   ├── views.py           # API views (Dashboard, CRUD, Attendance)
│   │   ├── urls.py            # Route definitions
│   │   └── admin.py           # Django admin registration
│   └── hrms_project/
│       ├── settings.py        # Django settings (DB, CORS, DRF)
│       └── urls.py            # Root URL config
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── api.js             # Axios API client
│       ├── App.jsx            # Router + layout shell
│       ├── main.jsx           # React root + MUI theme
│       ├── index.css          # Tailwind + custom styles
│       ├── components/
│       │   ├── Layout.jsx         # Sidebar + top bar layout
│       │   ├── EmployeeTable.jsx  # DataGrid with actions
│       │   ├── AddEmployeeDialog.jsx  # Create/Edit employee form
│       │   ├── AttendanceDialog.jsx   # Per-employee attendance history
│       │   └── ConfirmDialog.jsx      # Delete confirmation
│       └── pages/
│           ├── Dashboard.jsx   # KPI cards + charts + activity
│           ├── Employees.jsx   # Employee management page
│           └── Attendance.jsx  # Bulk attendance marking page
└── README.md
```

---

## API Endpoints

| Method | Endpoint                         | Description                           |
| ------ | -------------------------------- | ------------------------------------- |
| GET    | `/api/dashboard/`                | Dashboard summary statistics          |
| GET    | `/api/employees/`                | List employees (?search=, ?department=) |
| POST   | `/api/employees/`                | Create a new employee                 |
| GET    | `/api/employees/<id>/`           | Retrieve employee details             |
| PUT    | `/api/employees/<id>/`           | Update an employee                    |
| DELETE | `/api/employees/<id>/`           | Delete an employee (cascades)         |
| GET    | `/api/departments/`              | List distinct department names        |
| POST   | `/api/attendance/`               | Mark/update attendance (upsert)       |
| GET    | `/api/attendance/daily/?date=`   | All employees' status for a date      |
| GET    | `/api/attendance/<emp_id>/`      | Attendance history (?date_from=, ?date_to=) |

---

## Steps to Run Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (optional — SQLite used as fallback)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# (Optional) Create .env file for PostgreSQL
# DB_NAME=hrms_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# SECRET_KEY=your-secret-key
# DEBUG=1

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The API server will start at **http://localhost:8000**.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at **http://localhost:5173** and proxy API requests to the backend.

---

## Assumptions & Limitations

- **Single admin user** — No authentication or user management is implemented
- **Scope** — Leave management, payroll, and advanced HR features are intentionally excluded
- **Database** — If PostgreSQL environment variables are not configured, the app falls back to SQLite for convenience
- **Attendance** — One record per employee per date; marking again overwrites the previous status
- **Time zone** — All dates are handled in UTC
