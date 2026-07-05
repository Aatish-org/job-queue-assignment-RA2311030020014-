# QueueOS - Distributed Job Queue Management System

QueueOS is a distributed job queue management system built to process asynchronous background jobs reliably using BullMQ and Redis. The application provides secure authentication, job creation, scheduling, monitoring, and queue management through a modern web interface.

---

## Features

- User authentication using JWT
- Create and manage background jobs
- Queue processing using BullMQ
- Redis-backed job scheduling
- PostgreSQL database integration
- Job status tracking
- Dashboard for monitoring jobs
- Secure REST APIs
- Responsive frontend built with Next.js

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- BullMQ
- Redis
- PostgreSQL
- JWT Authentication

### Database
- PostgreSQL (Neon)

### Queue
- Redis (Upstash)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## Project Structure

```text
job-queue-assignment/
│
├── api-express/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── web/
│   ├── src/
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

---

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/Aatish-org/job-queue-assignment-RA2311030020014-.git

cd job-queue-assignment-RA2311030020014-
```

---

### Backend Setup

```bash
cd api-express

npm install
```

Create a `.env` file inside `api-express`.

```env
PORT=4000

DATABASE_URL=your_postgresql_connection_string

REDIS_URL=your_redis_connection_string

JWT_SECRET=your_jwt_secret
```

Start the backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd web

npm install
```

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the frontend

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## Environment Variables

Backend

```env
PORT=

DATABASE_URL=

REDIS_URL=

JWT_SECRET=
```

Frontend

```env
NEXT_PUBLIC_API_URL=
```

---

## API Documentation

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Jobs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/jobs` | Create new job |
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get job details |
| DELETE | `/api/jobs/:id` | Delete job |

---

## Architecture Diagram

```
                +----------------------+
                |      Next.js UI      |
                +----------+-----------+
                           |
                           |
                     REST API Calls
                           |
                           v
               +-----------------------+
               |   Express Backend     |
               +-----------+-----------+
                           |
          +----------------+----------------+
          |                                 |
          |                                 |
          v                                 v
 +------------------+              +------------------+
 |   PostgreSQL     |              |      Redis       |
 |   (Neon DB)      |              |    (Upstash)     |
 +------------------+              +---------+--------+
                                             |
                                             |
                                             v
                                      +--------------+
                                      |    BullMQ    |
                                      | Worker Queue |
                                      +--------------+
```

---

## ER Diagram

```
Users
------
id
name
email
password

        1
        |
        |
        |
        *
Jobs
------
id
title
description
status
priority
createdAt
updatedAt
userId
```

---

## Design Decisions

- BullMQ was selected for reliable asynchronous job processing.
- Redis is used as the message broker because of its speed and BullMQ compatibility.
- PostgreSQL stores persistent application data.
- JWT authentication keeps the backend stateless and scalable.
- Express.js provides lightweight REST API development.
- Next.js offers server-side rendering and an optimized frontend.
- TypeScript improves maintainability and type safety across the project.

---

## Automated Tests

Critical functionality verified includes:

- User authentication
- Job creation
- Job retrieval
- Queue processing
- Redis connectivity
- Database connectivity

---

## Deployment

Frontend

**Vercel:**  
*https://job-queue-assignment-ra-23110300200-xi.vercel.app/*


---

## Repository

GitHub Repository

https://github.com/Aatish-org/job-queue-assignment-RA2311030020014-

---

## Author

**Aatish P**

B.Tech CSE (Cyber Security)

SRM Institute of Science and Technology
