# EasyTask - Technical Context

## Technologies Used

### Core Framework

- **Angular 18**: Latest version of the Angular framework
  - Standalone components
  - Angular Signals for state management
  - Improved performance and developer experience

### Language

- **TypeScript 5.4+**: Strongly typed superset of JavaScript
  - Strict type checking enabled
  - Interface-driven development
  - Advanced type features

### UI and Styling

- **Tailwind CSS**: Utility-first CSS framework
  - Responsive design utilities
  - Component styling
- **CSS Variables**: For theming support
  - Multiple theme options:
    - Purple (Default)
    - Dark Premium
    - Armonía Oceánica
    - Productividad Natural
    - Neo-Digital
    - Gradientes Suaves
  - Consistent color palette
  - Standardized spacing and typography
  - Angular-based theme service and component
  - Theme persistence with localStorage
  - Predefined CSS classes for themed components:
    - `.task-card`, `.task-title`, `.task-description`, etc. for task components
    - `.app-button`, `.app-button-primary`, etc. for buttons
    - `.tasks-header-container`, `.tasks-empty-container`, etc. for page layouts
  - **IMPORTANT**: Always use these predefined classes instead of inline styles

### State Management

- **Angular Signals**: First-party reactive state management
  - Fine-grained reactivity
  - Computed values
  - Integration with Angular change detection

### Reactive Programming

- **RxJS**: Library for reactive programming
  - Observable pattern for async operations
  - Operators for data transformation
  - Integration with Angular services and components

### Build Tools

- **Angular CLI**: Command-line interface for Angular
  - Project scaffolding
  - Development server
  - Build optimization

## Development Setup

### Prerequisites

- Node.js v18+
- npm v9+
- Angular CLI v18+

### Local Development

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test
```

### Project Structure

```
src/
├── app/
│   ├── core/               # Core services, guards, interceptors
│   ├── features/           # Feature modules
│   │   └── tasks/          # Tasks feature
│   │       ├── domain/     # Domain layer (models, interfaces)
│   │       ├── application/ # Application layer (use cases)
│   │       └── infra/      # Infrastructure layer
│   │           ├── components/  # Feature-specific components
│   │           ├── pages/      # Page components
│   │           ├── services/    # Implementation services
│   │           └── repositories/ # Repository implementations
│   ├── shared/             # Truly shared components (header, logo, theme-switcher)
│   └── layouts/            # Layout components
├── assets/                 # Static assets
└── styles/                 # Global styles
```

## Technical Constraints

### Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support required
- Mobile browser support (iOS Safari, Android Chrome)

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance Score: > 90

### Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility

### Security Considerations

- XSS protection
- CSRF protection
- Secure authentication (future implementation)

## Dependencies

### Production Dependencies

- @angular/core, common, forms, router
- @angular/platform-browser
- rxjs
- tailwindcss
- zone.js

### Development Dependencies

- @angular-devkit/build-angular
- @angular/cli
- @angular/compiler-cli
- typescript
- jasmine-core
- karma

## Deployment Strategy

- Static file hosting
- CI/CD pipeline with GitHub Actions (future implementation)
- Environment-specific configuration

## Testing Approach

- Unit tests with Jasmine and Karma
- Component testing with Angular Testing Library
- E2E testing with Cypress (future implementation)

## Monitoring and Analytics

- Error tracking with Sentry (future implementation)
- Performance monitoring with Angular DevTools
- Usage analytics with Google Analytics (future implementation)

## Code Standards

### Styling and Theming Best Practices

- **Use Predefined Theme Classes**: Always use the predefined CSS classes for themed components

  - Task components: `.task-card`, `.task-title`, `.task-description`, etc.
  - Button components: `.app-button`, `.app-button-primary`, etc.
  - Page layouts: `.tasks-header-container`, `.tasks-empty-container`, etc.

- **Avoid Inline Styles**: Never use inline styles in templates

  ```html
  <!-- BAD -->
  <div style="color: var(--color-text-primary);">Content</div>

  <!-- GOOD -->
  <div class="task-description">Content</div>
  ```

- **Combine Tailwind with Theme Classes**: Use Tailwind for layout and theme classes for colors/styling

### Documentation Standards

- **Add JSDoc to All Public Methods and Classes**: Document the purpose, parameters, and return values
  ```typescript
  /**
   * Completes a task with the given ID
   * @param taskId - The unique identifier of the task
   * @returns void
   */
  completeTask(taskId: string): void {
    // Implementation
  }
  ```

### Code Cleanliness

- **No Console Logs in Production Code**: Remove all console.log statements before committing
- **No Commented-Out Code**: Delete commented-out code instead of leaving it in the codebase
- **No TODO Comments**: Create proper issues/tickets instead of TODO comments

### Angular Best Practices

- **Use Signals for State Management**: Prefer signals over subjects/observables for component state
- **Use Standalone Components**: Prefer standalone components over NgModules
- **Use Dependency Injection with inject() Function**: Prefer the inject() function over constructor injection
- **Use OnPush Change Detection**: For better performance in complex components
