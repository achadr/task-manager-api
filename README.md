# Task Manager Application

A full-stack task management application with a RESTful API backend and a React frontend.

## Project Structure

```
task-manager-api/
├── backend/          # Node.js + TypeScript REST API
│   ├── src/         # Backend source code
│   ├── data/        # SQLite database files
│   └── package.json # Backend dependencies
├── frontend/         # React + TypeScript + Vite
│   ├── src/         # Frontend source code
│   └── package.json # Frontend dependencies
└── README.md        # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Backend Setup

The backend is a REST API built with Node.js, TypeScript, Express, and SQLite.

```bash
cd backend
npm install
npm run dev
```

Backend will run on http://localhost:3000

### Frontend Setup

The frontend is built with React, TypeScript, and Vite.

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

The frontend is configured to proxy API requests to the backend automatically.

## Development

### Running Both Servers

You need two terminal windows:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### API Endpoints

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /tasks/stats` - Get task statistics

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- SQLite (better-sqlite3)
- Winston (logging)
- Zod (validation)
- Jest (testing)

### Frontend
- React 18
- TypeScript
- Vite
- CSS3

## License

MIT
