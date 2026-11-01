# Riyadvi Premium Digital Solutions Website

A full-stack React, Three.js and Express website for the Riyadvi Software Technologies interview assignment.

## Prerequisites
- Node.js 20.x and npm
- MongoDB Atlas or a local MongoDB instance

## Windows PowerShell setup

### Frontend
```powershell
cd C:\Users\rajiq\Downloads\riyadvi-website\frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The frontend runs at http://localhost:5173.

### Backend
Open a second terminal:
```powershell
cd C:\Users\rajiq\Downloads\riyadvi-website\backend
Copy-Item .env.example .env
npm install
npm run dev
```

The backend runs at http://localhost:5000.

Configure `backend/.env` with your own MongoDB Atlas URI, JWT secret and admin login. Do not commit real secrets.

## Test the backend
```powershell
curl http://localhost:5000/api/health
```

## Routes
Services, dynamic portfolio articles, individual blog articles and careers are routed under `/services`, `/portfolio`, `/blog` and `/careers`.

Key pages include `/business-health-checkup`, `/software-project-planning-guide`, `/contact`, `/admin/login` and `/admin`.

## Live MongoDB behavior
Form APIs use real Mongoose models and fail clearly with HTTP 503 when MongoDB is disconnected. The admin dashboard only displays database counts from MongoDB.

## Deployment
- Frontend: Vercel; configure `VITE_API_URL`
- Backend: Render; configure environment variables and persistent uploads if using file storage
- Database: MongoDB Atlas

## AI Tools Used
### GitHub Copilot
- **Purpose:** Accelerated component, routing, API and documentation implementation.
- **Example prompt:** “Create a premium futuristic black-and-gold React website with Three.js experiences and a complete Express/MongoDB backend.”
- **Generated:** Initial project structure, pages, 3D scenes, forms and REST APIs.
- **Manual changes:** Tailored brand design, content, validation, database behavior, responsive rules, scoring logic and project configuration.
- **Why selected:** Fast iteration directly inside VS Code while preserving developer control and debugging.
