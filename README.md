# Healthcare Platform (Microservices Architecture)

A production-ready Full-Stack Healthcare & Wellness Booking Application.

## Tech Stack
* **Frontend:** Next.js 15, React, Tailwind CSS, shadcn/ui.
* **Backend:** Node.js, Express, TypeScript, Prisma (v6), Socket.io.
* **Database:** PostgreSQL.
* **Orchestration:** Docker, docker-compose.

## Pre-requisites
* Node.js v20+
* Docker & Docker Compose
* PostgreSQL (or rely on dockerized pg)

## Running Locally (Docker)

The fastest way to run the entire stack is via docker-compose:

```bash
docker-compose up --build
```
This starts:
1. PostgreSQL database on port 5432
2. Redis on port 6379
3. Backend API on port 5000 (accessible via http://localhost:5000)
4. Frontend App on port 3000 (accessible via http://localhost:3000)

## Running Locally (Manual)

### Backend
```bash
cd backend
npm install
# Set up .env with DATABASE_URL
npx prisma generate
npx prisma db push
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm install
# Ensure NEXT_PUBLIC_API_URL is set in .env.local
npm run dev
```

## Features Complete
* Home Landing page with stunning UI animations.
* Search flow with sample data.
* Real-time Booking simulation with lock mechanisms.
* Prisma DB schema for RBAC (Patient, Doctor, Admin).
* Setup for AI heuristics based recommendation system.
