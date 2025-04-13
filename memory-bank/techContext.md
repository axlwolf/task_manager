# EasyTask - Technical Context

## Technologies Used

### Core Framework

- **Angular 18**: Latest version of the Angular framework
  - Standalone components
  - Built-in control flow with @if and @for (no CommonModule needed)
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
- **Phosphor Icons**: SVG icon library
  - 6,000+ high-quality icons
  - Support for microinteractions
  - Multiple weights (regular, bold, fill, etc.)
  - Angular-specific package (@phosphor-icons/angular)
- **Dialog System**: Native HTML dialog element with Angular service
  - Accessible modal dialogs
  - Service-based API for programmatic dialog creation
  - Support for custom content components
  - Smooth animations and microinteractions
- **CSS Variables**: For theming support
  - Multiple theme options:
    - Purple (Default)
    - Dark Premium
    - Armonía Oceánica
    - Neo-Digital
    - Gradientes Suaves
    - Turquesa Fresco
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
│   │   ├── home/           # Home feature (simple welcome page)
│   │   └── tasks/          # Tasks feature
│   │       ├── domain/     # Domain layer (models, interfaces)
│   │       ├── application/ # Application layer (use cases)
│   │       └── infra/      # Infrastructure layer
│   │           ├── components/  # Feature-specific components
│   │           │   ├── add-task-button/
│   │           │   ├── task-card/
│   │           │   ├── task-dialog-form/ # Task form as dialog
│   │           │   ├── tasks-list/
│   │           │   └── user-list/
│   │           ├── pages/      # Page components
│   │           ├── services/    # Implementation services
│   │           └── repositories/ # Repository implementations
│   ├── shared/             # Truly shared components
│   │   ├── components/     # Shared UI components
│   │   │   ├── dialog/      # Dialog system components
│   │   │   │   ├── dialog.component.ts
│   │   │   │   ├── dialog.service.ts
│   │   │   │   └── dialog-ref.ts
│   │   │   ├── header/      # Application header
│   │   │   ├── icon/        # Icon component
│   │   │   └── theme-switcher/ # Theme selection component
│   │   ├── directives/     # Animation directives
│   │   ├── services/       # Shared services (animation, theme)
│   │   └── pipes/          # Shared pipes (truncate)
│   └── layouts/            # Layout components
├── assets/                 # Static assets
├── tests/                  # Test files
└── memory-bank/           # Project documentation
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

### Testing Framework

- Unit tests with Jasmine and Karma
- Component testing with Angular Testing Library
- E2E testing with Cypress (future implementation)

### Component Testing Pattern

We use a standardized setup function pattern for component tests:

```typescript
// Default test data
const defaultData = {
  // Define default test data here
  user: { id: "1", name: "Test User" } as User,
  tasks: [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      dueDate: new Date(),
      userId: "1",
      completed: false,
    },
  ] as Task[],
};

// Setup function for creating component with custom configuration
const setup = (config?: { tasks?: Task[]; user?: User | null }) => {
  // Merge default data with custom config
  const testData = {
    tasks: config?.tasks ?? [...defaultData.tasks],
    user: config?.user ?? { ...defaultData.user },
  };

  // Create mocks for dependencies
  const tasksSpy = jasmine.createSpyObj("TasksStoreService", ["showAddTaskForm"]);

  // Configure mocks with test data
  Object.defineProperty(tasksSpy, "tasks", {
    get: () => signal(testData.tasks).asReadonly(),
  });

  // Configure TestBed
  TestBed.configureTestingModule({
    imports: [ComponentUnderTest, OtherComponents],
    providers: [{ provide: DependencyService, useValue: mockService }],
  });

  // Create component and fixture
  const fixture = TestBed.createComponent(ComponentUnderTest);
  const component = fixture.componentInstance;
  const dependencyService = TestBed.inject(DependencyService);

  fixture.detectChanges();

  return { fixture, component, dependencyService, testData };
};

// Example test
it("should show empty state when no data is available", () => {
  // Setup with empty data
  const { fixture } = setup({ tasks: [] });

  // Test assertions
  const emptyState = fixture.debugElement.query(By.css(".empty-state"));
  expect(emptyState).toBeTruthy();
});
```

This pattern provides several benefits:

1. **Centralized Configuration**: All component setup is in one place
2. **Customizable Test Data**: Each test can customize the data it needs
3. **Clean Test Cases**: Tests focus on assertions, not setup
4. **Consistent Mocking**: Dependencies are mocked consistently
5. **Reusable Setup**: The setup function can be reused across tests

### Service Testing Pattern

Para los servicios, utilizamos un enfoque similar:

```typescript
const setup = (args?: {
  // Configuración personalizable
  store?: {
    merchantId?: number;
    users?: UserList | null;
  };
  dialogResult?: DialogResultDto;
}) => {
  // Configuración por defecto
  const defaultConfig = {
    store: {
      merchantId: 123,
      users: {
        /* datos por defecto */
      },
    },
    dialogResult: {
      hasConfirmation: false,
    },
  };

  // Combinar configuración
  const config = {
    store: {
      selectedId$: of(args?.store?.merchantId ?? defaultConfig.store.merchantId),
      users$: of(args?.store?.users ?? defaultConfig.store.users),
    },
    dialogResult: {
      ...defaultConfig.dialogResult,
      ...args?.dialogResult,
    },
  };

  // Configurar TestBed
  TestBed.configureTestingModule({
    providers: [
      ServiceUnderTest,
      provideMockServices(), // Helper para mocks comunes
      {
        provide: StoreService,
        useValue: {
          selectedId$: config.store.selectedId$,
          users$: config.store.users$,
          setUsers: jasmine.createSpy("setUsers"),
        },
      },
      {
        provide: DialogService,
        useValue: {
          open: () => ({
            afterClosed$: of(config.dialogResult),
          }),
        },
      },
    ],
  });

  // Obtener servicio y dependencias
  const service = TestBed.inject(ServiceUnderTest);
  const store = TestBed.inject(StoreService);
  const dialog = TestBed.inject(DialogService);
  const notifier = TestBed.inject(NotifierService);

  // Configurar spies
  const dialogSpy = spyOn(dialog, "open").and.callThrough();
  const notifierSpy = spyOn(notifier, "success").and.callThrough();

  return {
    service,
    store,
    dialogSpy,
    notifierSpy,
  };
};
```

Este patrón facilita la prueba de servicios con múltiples dependencias y configuraciones.

### Use Case Testing Pattern

Para los casos de uso, utilizamos un enfoque basado en TestBed con foco en la validación y manejo de errores:

```typescript
describe("UpdateTaskUseCase", () => {
  let usecase: UpdateTaskUseCase;
  let repository: jasmine.SpyObj<TaskRepository>;
  let showLoaderSpy: jasmine.Spy;
  let hideLoaderSpy: jasmine.Spy;
  let handleErrorSpy: jasmine.Spy;
  let successNotifierSpy: jasmine.Spy;

  // Datos de prueba
  const taskData = {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    dueDate: new Date(),
    userId: "1",
    completed: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdateTaskUseCase,
        // Proveedores para servicios comunes
        provideLoaderTesting(),
        provideNotifierTesting(),
        provideErrorHandlerTesting(),
        // Mock del repositorio
        {
          provide: TaskRepository,
          useValue: jasmine.createSpyObj("TaskRepository", ["updateTask"]),
        },
      ],
    });

    // Obtener el caso de uso y sus dependencias
    usecase = TestBed.inject(UpdateTaskUseCase);
    repository = TestBed.inject(TaskRepository) as jasmine.SpyObj<TaskRepository>;

    // Configurar spies para los servicios comunes
    const loader = TestBed.inject(LoaderService);
    showLoaderSpy = spyOn(loader, "show").and.callThrough();
    hideLoaderSpy = spyOn(loader, "hide").and.callThrough();

    const notifier = TestBed.inject(NotifierService);
    successNotifierSpy = spyOn(notifier, "success").and.callThrough();

    const errorHandler = TestBed.inject(ErrorHandler);
    handleErrorSpy = spyOn(errorHandler, "handle").and.callThrough();
  });

  it("should update the task successfully", fakeAsync(() => {
    // Configurar el repositorio para que devuelva éxito
    repository.updateTask.and.returnValue(of(taskData));

    let result: any;

    usecase.execute(taskData).subscribe({
      next: (response) => {
        result = response;
      },
      error: fail,
    });

    tick();

    expect(result).toEqual(taskData);
    expect(showLoaderSpy).toHaveBeenCalledTimes(1);
    expect(hideLoaderSpy).toHaveBeenCalledTimes(1);
    expect(successNotifierSpy).toHaveBeenCalledTimes(1);
    expect(repository.updateTask).toHaveBeenCalledWith(taskData);
  }));
});
```

Este enfoque permite probar de manera exhaustiva la lógica de negocio, la validación de datos y el manejo de errores en los casos de uso.

### Repository Testing Pattern

Para los repositorios, utilizamos HttpTestingController para simular las interacciones HTTP:

```typescript
describe("TaskRepositoryImpl", () => {
  let httpController: HttpTestingController;
  let repository: TaskRepositoryImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskRepositoryImpl, { provide: ENVIRONMENT, useValue: { apiBaseUrl: "https://api.example.com" } }, provideHttpClient(), provideHttpClientTesting()],
    });

    httpController = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(TaskRepositoryImpl);
  });

  afterEach(() => {
    httpController.verify(); // Verificar que no haya solicitudes pendientes
  });

  it("should retrieve tasks successfully", () => {
    const userId = "123";
    const expectedTasks = [{ id: "1", title: "Task 1", userId: "123" }];

    repository.getTasks(userId).subscribe({
      next: (tasks) => {
        expect(tasks).toEqual(expectedTasks);
      },
      error: fail,
    });

    // Capturar y responder a la solicitud HTTP
    const req = httpController.expectOne(`https://api.example.com/users/${userId}/tasks`);
    expect(req.request.method).toBe("GET");
    req.flush(expectedTasks); // Simular respuesta exitosa
  });

  it("should handle server errors", () => {
    const userId = "123";

    repository.getTasks(userId).subscribe({
      next: fail,
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    // Simular error del servidor
    const req = httpController.expectOne(`https://api.example.com/users/${userId}/tasks`);
    req.flush("Server error", { status: 500, statusText: "Server Error" });
  });
});
```

Este enfoque permite probar de manera aislada las interacciones con el backend, verificando URLs, métodos HTTP, parámetros y manejo de respuestas.

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
  - Dialog components: `.task-dialog`, `.dialog-title`, `.dialog-body`, etc.

- **Avoid Inline Styles**: Never use inline styles in templates

  ```html
  <!-- BAD -->
  <div style="color: var(--color-text-primary);">Content</div>

  <!-- GOOD -->
  <div class="task-description">Content</div>
  ```

- **Combine Tailwind with Theme Classes**: Use Tailwind for layout and theme classes for colors/styling

- **Use CSS Variables for Theming**: Define and use CSS variables for colors, spacing, and other theme properties

  ```css
  :host {
    --form-bg-color: var(--color-primary-dark);
    --form-text-color: white;
  }
  ```

- **Add Animation Classes**: Use consistent animation classes for microinteractions

  ```css
  .dialog-enter {
    animation: dialogEnter var(--animation-duration-normal) var(--animation-timing-ease-out) forwards;
  }
  ```

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
