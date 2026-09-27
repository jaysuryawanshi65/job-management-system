\# Job Management System



A full-stack Job Management \& Recruitment System built with \*\*ASP.NET Core Web API, React.js, PostgreSQL, JWT Authentication, Entity Framework Core, and Docker\*\*.



The platform provides separate workflows for \*\*Administrators, Recruiters, and Job Seekers\*\*, allowing companies to create jobs, candidates to apply for jobs, recruiters to manage applications, and administrators to manage the overall platform.



\---

\## 🖥️ UI Preview



\### Home Page



!\[JobPortal Home Page](screenshots/home-page.png)



\## 🚀 Features



\### 🔐 Authentication \& Authorization



\- User registration and login

\- JWT-based authentication

\- Role-based authorization

\- Supported roles:

&#x20; - ADMIN

&#x20; - RECRUITER

&#x20; - JOB\_SEEKER

\- BCrypt password hashing

\- Active/inactive user management

\- Protected API endpoints



\### 👨‍💼 Admin



\- Admin dashboard

\- View all users

\- View registered companies

\- View available jobs

\- View job applications

\- Activate/deactivate users

\- Prevent admin account deactivation

\- Platform-level management



\### 🏢 Recruiter



\- Recruiter dashboard

\- Create companies

\- Manage companies

\- Create job postings

\- Edit job postings

\- Manage job listings

\- View job applications

\- Update application status

\- View applicant resumes



\### 👨‍💻 Job Seeker



\- Browse available jobs

\- View job details

\- Apply for jobs

\- Upload resume

\- Add cover letter

\- View submitted applications

\- Track application status



\### 📄 Resume Management



\- Upload resumes in PDF/DOC/DOCX format

\- Maximum file size: 5 MB

\- Resume linked to job seeker profile

\- Recruiters can view applicant resumes



\---



\## 🛠️ Tech Stack



\### Backend



\- ASP.NET Core Web API

\- .NET 10

\- Entity Framework Core

\- PostgreSQL

\- JWT Authentication

\- BCrypt

\- Swagger / OpenAPI



\### Frontend



\- React.js

\- Vite

\- JavaScript

\- CSS



\### DevOps / Tools



\- Docker

\- Docker Compose

\- Git

\- GitHub



\---



\## 🏗️ Project Architecture



```text

job-management-system/

│

├── backend/

│   ├── JobManagement.API/

│   │   ├── Controllers/

│   │   ├── Data/

│   │   ├── DTOs/

│   │   ├── Migrations/

│   │   ├── Models/

│   │   ├── Services/

│   │   ├── Uploads/

│   │   ├── Program.cs

│   │   ├── appsettings.json

│   │   └── JobManagement.API.csproj

│   │

│   └── docker-compose.yml

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── styles/

│   │   ├── assets/

│   │   ├── api.js

│   │   ├── App.jsx

│   │   └── main.jsx

│   │

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

