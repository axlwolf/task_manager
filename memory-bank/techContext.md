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
  - Custom design system

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
│   │       ├── domain/     # Domain layer
│   │       ├── application/ # Application layer
│   │       └── infra/      # Infrastructure layer
│   ├── shared/             # Shared components, directives, pipes
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