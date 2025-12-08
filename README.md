# Task Manager Application

A full-stack task management application with a RESTful API backend and a modern React frontend featuring a Kanban board interface.

## Features

### Backend
- RESTful API with full CRUD operations
- Task statistics and aggregations
- SQLite database with better-sqlite3
- Input validation with Zod
- Structured logging with Winston
- Comprehensive test coverage with Jest

### Frontend
- **Kanban Board Layout** - Visual task organization with 3 columns (Pending, In Progress, Completed)
- **Sorting Controls** - Sort tasks by date or priority in each column
- **Task Statistics Dashboard** - Visual charts showing completion rates and task distribution
- **Full CRUD Operations** - Create, read, update, and delete tasks
- **Status-Based Styling** - Color-coded cards with gradients and borders
- **Responsive Design** - Mobile-friendly interface that adapts to all screen sizes

## Project Structure

```
task-manager-api/
├── backend/          # Node.js + TypeScript REST API
│   ├── src/         # Backend source code
│   │   ├── domain/          # Domain models and interfaces
│   │   ├── application/     # Use cases and business logic
│   │   ├── infrastructure/  # Database and external services
│   │   └── presentation/    # HTTP controllers and routes
│   ├── data/        # SQLite database files
│   ├── tests/       # Unit and integration tests
│   └── package.json # Backend dependencies
├── frontend/         # React + TypeScript + Vite
│   ├── src/         # Frontend source code
│   │   ├── components/      # React components (KanbanColumn, TaskCard, TaskForm, TaskStats)
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript interfaces
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

### Running Tests (Backend)

```bash
cd backend
npm test                  # Run all tests
npm run test:coverage    # Run tests with coverage report
```

### API Endpoints

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "priority": "medium"
  }
  ```
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /tasks/stats` - Get task statistics (aggregated by status and priority)

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **SQLite** (better-sqlite3) - Embedded database
- **Winston** - Logging library
- **Zod** - Schema validation
- **Jest** - Testing framework

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients, animations, and responsive design

## Architecture

### Backend (Clean Architecture)
The backend follows clean architecture principles with clear separation of concerns:
- **Domain Layer** - Core business entities and interfaces
- **Application Layer** - Use cases and business logic
- **Infrastructure Layer** - Database, external services
- **Presentation Layer** - HTTP controllers and routes

### Frontend (Component-Based)
The frontend uses a component-based architecture:
- **KanbanColumn** - Displays tasks for a specific status with sorting
- **TaskCard** - Individual task display with edit/delete actions
- **TaskForm** - Modal form for creating/editing tasks
- **TaskStats** - Dashboard with completion ring and bar charts

## Color Scheme

The application uses a consistent color scheme across all components:
- **Pending Status** - Orange/Yellow (#ffa726)
- **In Progress Status** - Green (#66bb6a)
- **Completed Status** - Blue (#42a5f5)
- **Low Priority** - Blue (#1976d2)
- **Medium Priority** - Purple (#8e24aa)
- **High Priority** - Red (#c62828)

## License

MIT
