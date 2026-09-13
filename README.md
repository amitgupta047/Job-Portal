# 💼 Job Portal

A full-stack **MERN Job Portal** that connects candidates and recruiters through a modern job recruitment platform.

## 🚀 Features

### 👨‍💻 Candidate

* Register and Login
* Browse available jobs
* Search jobs by title/company
* Filter jobs by location, job type, salary and skills
* View detailed job information
* Apply for jobs
* Upload resume while applying
* Track application status
* Save and unsave jobs
* View saved jobs
* Manage candidate profile
* Upload profile picture
* Upload/update resume
* View notifications
* Track application progress

### 🧑‍💼 Recruiter

* Recruiter registration and login
* Create new jobs
* Edit existing jobs
* Delete jobs
* Open/close job applications
* View job applicants
* Search and filter applicants
* Update application status
* View candidate profiles
* View recruiter analytics
* View job-wise analytics
* Track hiring funnel and selection rate

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* bcrypt

### Database

* MongoDB

## 📁 Project Structure

```text
job portal Application/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/job-portal.git
cd job-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:8001
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

## 🔐 Authentication

The application uses **JWT-based authentication**.

There are two main roles:

* `candidate`
* `recruiter`

Protected routes are accessible according to the user's role.

## 📌 Application Status Flow

```text
Applied
   ↓
Shortlisted
   ↓
Interview
   ↓
Selected
```

An application can also be:

```text
Applied → Rejected
Shortlisted → Rejected
Interview → Rejected
```

## 📊 Recruiter Analytics

Recruiters can track:

* Total Jobs
* Total Applications
* Applied Candidates
* Shortlisted Candidates
* Interview Candidates
* Selected Candidates
* Rejected Candidates
* Selection Rate
* Rejection Rate
* Job-wise Applications
* Hiring Funnel

## 🔔 Notifications

Candidates receive notifications when their application status changes to:

* Shortlisted
* Interview
* Selected
* Rejected

## 💾 Saved Jobs

Candidates can:

* Save jobs
* Unsave jobs
* View all saved jobs
* Check saved status without making unnecessary API requests

## 🔒 Security

The project includes:

* JWT authentication
* Password hashing
* Role-based authorization
* Protected API routes
* Recruiter-only routes
* Candidate-only routes
* Resume file validation
* Profile image validation
* Environment variables for sensitive configuration

## 🧪 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
PATCH  /api/jobs/:id/status
```

### Applications

```text
POST /api/applications/apply/:jobId
GET  /api/applications/my-applications
GET  /api/applications/job/:jobId
PUT  /api/applications/:applicationId/status
```

### Saved Jobs

```text
GET    /api/saved-jobs
POST   /api/saved-jobs/:jobId
DELETE /api/saved-jobs/:jobId
```

### Profile

```text
GET  /api/profile
PUT  /api/profile
```

### Notifications

```text
GET    /api/notifications
PUT    /api/notifications/read-all
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id
```

## 🎯 Future Improvements

* Email notifications
* Advanced job recommendations
* Resume parsing
* AI-powered job matching
* Cloud resume storage
* Admin dashboard
* Production deployment
* Advanced analytics
* Interview scheduling

## 👨‍💻 Author

**Amit Gupta**

B.Tech Computer Science & Engineering
Babu Banarasi Das University (BBDU)

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.
