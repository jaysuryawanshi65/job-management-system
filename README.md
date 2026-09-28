# Job Management System

[![CI](https://github.com/jaysuryawanshi65/job-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/jaysuryawanshi65/job-management-system/actions/workflows/ci.yml)

A full-stack Job Management & Recruitment System built with **ASP.NET Core Web API, React.js, PostgreSQL, Entity Framework Core, JWT Authentication, and Docker**.

## Features

### Authentication & Authorization
- User registration and login
- JWT authentication
- Role-based authorization
- Roles: `ADMIN`, `RECRUITER`, `JOB_SEEKER`
- BCrypt password hashing
- Active/inactive user management
- Protected frontend routes

### Admin
- Dashboard
- View users, companies, jobs, and applications
- Activate/deactivate non-admin users
- Admin account protection

### Recruiter
- Recruiter dashboard
- Create and manage companies
- Create/edit/deactivate jobs
- View applicants
- Update application status
- View applicant resumes

### Job Seeker
- Browse and filter jobs
- View job details
- Apply with a cover letter
- Upload resume (PDF/DOC/DOCX, max 5 MB)
- Track application status

## Tech Stack

**Backend**
- .NET 10 / ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT
- BCrypt
- Swagger / OpenAPI

**Frontend**
- React 19
- Vite
- Axios
- React Router

**DevOps**
- Docker
- Docker Compose
- GitHub Actions

## Project Structure

```text
job-management-system/
├── backend/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── JobManagement.API/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Migrations/
│       ├── Models/
│       ├── services/
│       ├── Dockerfile
│       ├── .dockerignore
│       └── Program.cs
├── frontend/
│   ├── .env.example
│   └── src/
├── .github/workflows/ci.yml
└── README.md
```

## Local Setup

### 1. Backend environment

Copy:

```powershell
Copy-Item backend\.env.example backend\.env
```

Set real values in `backend/.env`:

```env
POSTGRES_DB=job_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-postgres-password
JWT_KEY=your-random-secret-at-least-32-characters
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
```

Do **not** commit `.env`.

### 2. Start PostgreSQL + API with Docker

From the `backend` directory:

```powershell
docker compose up -d --build
```

The services will be:

- PostgreSQL: `localhost:5433`
- API: `http://localhost:8082`
- Swagger: `http://localhost:8082/swagger`
- Health: `http://localhost:8082/health`

The API automatically applies EF Core migrations on startup.

If `ADMIN_*` values are configured and no admin exists, the API creates the initial admin account automatically.

### 3. Frontend

From `frontend`:

```powershell
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

For a different API URL, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8082/api
```

### 4. End-to-end flow

1. Register/login as `RECRUITER`.
2. Create a company.
3. Create a job.
4. Logout.
5. Register/login as `JOB_SEEKER`.
6. Browse jobs.
7. Open job details.
8. Upload a resume from the dashboard.
9. Apply with a cover letter.
10. Open My Applications.
11. Login as recruiter and update the application status.
12. Verify the job seeker dashboard counters.

## API

Main API areas:

```text
/api/Auth
/api/Users
/api/Admin
/api/Company
/api/Job
/api/JobApplication
/api/JobSeeker
/api/Recruiter
/api/Resume
```

Swagger provides interactive API documentation and JWT authorization.

## Docker

The backend Dockerfile uses a multi-stage build:

```text
.NET SDK image
      ↓
dotnet publish
      ↓
.NET ASP.NET runtime image
```

`backend/docker-compose.yml` runs PostgreSQL and the API together.

## Deployment Notes

For a cloud deployment:

- Use a managed PostgreSQL database or a persistent PostgreSQL service.
- Set `ConnectionStrings__DefaultConnection` as a secret environment variable.
- Set `Jwt__Key` as a secret environment variable.
- Set `Admin__Username`, `Admin__Email`, and `Admin__Password` if an initial admin is required.
- Set `VITE_API_BASE_URL` in the frontend hosting platform to the deployed API URL plus `/api`.
- Configure `Cors__AllowedOrigins__0` (or equivalent JSON environment configuration) to the deployed frontend origin.
- Do not put passwords, JWT keys, or database credentials in source control.

## CI

GitHub Actions builds:

- ASP.NET Core backend
- React/Vite frontend

on pushes and pull requests targeting `main`.

## License

For educational and portfolio use.
