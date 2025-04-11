# 📊 EasyTask - Enterprise Task Management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT "MIT License")
![GitHub repo size](https://img.shields.io/github/repo-size/flanuza/angular-v18-starter)
[![Active](http://img.shields.io/badge/Status-Active-green.svg)](https://github.com/flanuza/angular-v18-starter)
[![Generic badge](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.typescriptlang.org/)
[![Generic badge](https://img.shields.io/badge/framework-angular%2018-red.svg)](https://angular.io/)
[![Generic badge](https://img.shields.io/badge/themes-7%20themes-purple.svg)](https://github.com/flanuza/angular-v18-starter#themes)
[![Generic badge](https://img.shields.io/badge/last%20updated-07--2024-blue)](https://github.com/flanuza/angular-v18-starter)

![EasyTask Logo](src/assets/logo.svg)

EasyTask is a modern task management application built with Angular 18, designed to help teams manage their tasks efficiently. This project demonstrates the implementation of Clean Architecture principles in an Angular application.

## Features

- **User Management**: View and select users to manage their tasks
- **Task Management**: Create, view, and complete tasks
- **Modern UI**: Clean and responsive interface built with Tailwind CSS
- **Reactive State Management**: Using Angular Signals for efficient state management
- **Theme System**: Multiple themes with CSS variables and Angular service

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
- **CSS Variables**: For theming support

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

## Themes

EasyTask comes with 7 beautiful themes that can be switched at runtime:

![EasyTask Themes](src/assets/theme-showcase.svg)

1. **Purple (Default)** - The classic EasyTask theme with purple accents
2. **Dark Premium** - A dark theme with purple/lila accents
   - Dark background (#121212)
   - Accent color: #A66CFF
3. **Armonía Oceánica** - A harmonious ocean-inspired theme
   - Soft blue background (#F0F9FF)
   - Accent colors: #0EA5E9 (sky blue) and #0369A1 (deep blue)
4. **Productividad Natural** - Nature-inspired productivity theme
   - Beige background (#F5F1E8)
   - Accent colors: #2D4F3A (forest green) and #E2A890 (terracotta)
5. **Neo-Digital** - Modern tech-inspired theme
   - Dark blue background (#192A51)
   - Accent colors: #00B7C2 (turquoise) and #FF6B6B (coral)
6. **Gradientes Suaves** - Soft gradient backgrounds
   - Gradient background from purple to blue
   - Accent color: #FD8A8A (peach pink)
7. **Turquesa Fresco** - Fresh mobile app inspired theme
   - Light blue background (#F5FCFC)
   - Primary color: #2BBFB0 (turquoise)
   - Accent color: #F2994A (orange)

Themes are managed by the `ThemeService` and can be switched using the theme selector in the application header.

### Using the Theme Service

The theme system is implemented using CSS variables and an Angular service. To use it in your components:

```typescript
import { Component, inject } from "@angular/core";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: "app-my-component",
  template: `
    <div>
      <p>Current theme: {{ themeService.currentTheme() }}</p>
      <button (click)="themeService.setTheme('theme-dark')">Switch to Dark</button>
    </div>
  `,
})
export class MyComponent {
  protected readonly themeService = inject(ThemeService);
}
```

The `ThemeService` provides:

- `currentTheme()` - A signal with the current theme name
- `setTheme(themeName)` - Method to change the current theme
- `getThemes()` - Method to get all available themes
- `loadTheme()` - Method to load the theme from localStorage

## Development

### Development server

Run `ng serve` for a dev server. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
