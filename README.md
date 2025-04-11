# EasyTask - Enterprise Task Management

![EasyTask Logo](src/assets/logo.svg)

EasyTask is a modern task management application built with Angular 18, designed to help teams manage their tasks efficiently. This project demonstrates the implementation of Clean Architecture principles in an Angular application.

## Features

- **User Management**: View and select users to manage their tasks
- **Task Management**: Create, view, and complete tasks
- **Modern UI**: Clean and responsive interface built with Tailwind CSS
- **Reactive State Management**: Using Angular Signals for efficient state management

## Architecture

This project follows Clean Architecture principles with a clear separation of concerns:

### Domain Layer

- Contains business entities and repository interfaces
- Independent of frameworks and UI

### Application Layer

- Contains use cases that orchestrate the flow of data
- Depends only on the domain layer

### Infrastructure Layer

- Contains implementations of repositories, UI components, and services
- Depends on both domain and application layers

## Project Structure

```
src/app/features/tasks/
├── domain/
│   ├── models/
│   │   ├── task.model.ts
│   │   └── user.model.ts
│   └── repositories/
│       ├── task.repository.ts
│       └── user.repository.ts
├── application/
│   ├── dtos/
│   │   └── task.dto.ts
│   └── usecases/
│       ├── create-task.usecase.ts
│       ├── complete-task.usecase.ts
│       ├── get-tasks.usecase.ts
│       └── get-users.usecase.ts
└── infra/
    ├── components/
    │   ├── add-task-button/
    │   ├── button/
    │   ├── task-card/
    │   ├── task-form/
    │   └── user-list/
    ├── layout/
    │   └── tasks-layout.component.ts
    ├── pages/
    │   └── tasks-page.component.ts
    ├── repositories/
    │   ├── task-impl.repository.ts
    │   └── user-impl.repository.ts
    ├── services/
    │   └── tasks-store.service.ts
    └── tasks.routes.ts
```

## Technologies Used

- **Angular 18**: Latest version of the Angular framework
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **RxJS**: For reactive programming
- **Angular Signals**: For state management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Navigate to `http://localhost:4200/`

## Development

### Development server

Run `ng serve` for a dev server. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
