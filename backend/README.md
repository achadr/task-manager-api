# Task Manager API

A REST API for managing tasks, built with Node.js and TypeScript. This project demonstrates clean architecture principles, separating concerns into distinct layers for maintainability and testability.

## Technologies

- Node.js 24
- TypeScript
- Express
- SQLite (via better-sqlite3)
- Jest for testing
- Zod for validation
- Winston for logging
## Getting Started

### Prerequisites

- Node.js 24 or higher
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/task-manager-api.git
cd task-manager-api
```

2. Install dependencies
```bash
npm install
```

3. Create the data directory
```bash
mkdir data
```

4. Start the development server
```bash
npm run dev
```

The server will start at http://localhost:3000

### Available Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start development server with hot reload |
| npm run build | Compile TypeScript to JavaScript |
| npm start | Run the compiled production build |
| npm test | Run all tests |
| npm run test:coverage | Run tests with coverage report |
## Getting Started

### Prerequisites

- Node.js 24 or higher
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/task-manager-api.git
cd task-manager-api
```

2. Install dependencies
```bash
npm install
```

3. Create the data directory
```bash
mkdir data
```

4. Start the development server
```bash
npm run dev
```

The server will start at http://localhost:3000

### Available Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start development server with hot reload |
| npm run build | Compile TypeScript to JavaScript |
| npm start | Run the compiled production build |
| npm test | Run all tests |
| npm run test:coverage | Run tests with coverage report |
## Architecture

This project follows clean architecture principles, organizing code into four distinct layers. Each layer has a single responsibility and dependencies only point inward.
```
src/
├── domain/           Core business logic
├── application/      Use cases and orchestration
├── infrastructure/   External services (database, logging)
└── presentation/     HTTP layer (controllers, routes)
```

### Domain Layer

Contains the core business entities and interfaces. This layer has no external dependencies.

- **Entities**: Task class with properties and business methods like `complete()` and `isOverdue()`
- **Interfaces**: TaskRepository defines the contract for data persistence
- **Errors**: Custom error classes like TaskNotFoundError

### Application Layer

Orchestrates the business logic by coordinating between domain and infrastructure.

- **Services**: TaskService contains the application logic for CRUD operations and statistics
- **DTOs**: Data Transfer Objects define the shape of input and output data

### Infrastructure Layer

Implements the interfaces defined in the domain layer using concrete technologies.

- **Repositories**: SQLiteTaskRepository implements TaskRepository using SQLite
- **Database**: Connection setup and table creation
- **Logging**: Winston logger configuration

### Presentation Layer

Handles HTTP concerns and translates between web requests and application services.

- **Controllers**: Handle request/response, delegate to services
- **Routes**: Define API endpoints and apply middleware
- **Middlewares**: Error handling, request validation
- **Validators**: Zod schemas for input validation

### Dependency Injection

Dependencies are injected manually in the application entry point. This approach was chosen over a DI framework to keep the project simple while still achieving loose coupling and testability.
```typescript
const taskRepository = new SQLiteTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);
```

This makes it easy to swap implementations (for example, replacing SQLite with PostgreSQL) or inject mocks for testing.

## Testing

The project includes both unit tests and integration tests.

### Unit Tests

Unit tests verify individual components in isolation. The TaskService tests use mock repositories to test business logic without a database.
```typescript
mockRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  // ...
};
taskService = new TaskService(mockRepository);
```

### Integration Tests

Integration tests verify the full request/response cycle using Supertest. These tests hit actual endpoints and validate HTTP status codes, response bodies, and error handling.

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Current coverage: 93% statements, 94% lines.