# EasyTask - System Patterns

## System Architecture

EasyTask follows Clean Architecture principles, separating the application into three main layers:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Domain Layer                                           │
│  ├── Models (entities)                                  │
│  └── Repository Interfaces                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Application Layer                                      │
│  ├── Use Cases                                          │
│  └── DTOs                                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Infrastructure Layer                                   │
│  ├── UI Components                                      │
│  ├── Services                                           │
│  ├── Repository Implementations                         │
│  └── External Integrations                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

1. **Domain Layer**

   - Contains business entities (Task, User)
   - Defines repository interfaces
   - Has no dependencies on other layers or frameworks

2. **Application Layer**

   - Contains use cases that orchestrate the flow of data
   - Depends only on the domain layer
   - Implements business logic

3. **Infrastructure Layer**
   - Contains UI components, services, and repository implementations
   - Depends on both domain and application layers
   - Handles framework-specific concerns

## Key Technical Decisions

### 1. Standalone Components

All Angular components are implemented as standalone components, avoiding NgModules for better tree-shaking and simpler dependency management.

### 2. Signal-based State Management

Using Angular Signals for reactive state management instead of NgRx or other state management libraries, providing:

- Simpler API with less boilerplate
- Fine-grained reactivity
- Better performance for this scale of application

### 3. Repository Pattern

Implementing the repository pattern to:

- Abstract data access logic
- Enable easy switching between data sources
- Facilitate testing with mock implementations

### 4. Dependency Injection

Using Angular's dependency injection system to:

- Provide concrete implementations for abstract repositories
- Enable loose coupling between components
- Facilitate testing with mock services

## Design Patterns in Use

### 1. Repository Pattern

```typescript
// Domain Layer - Repository Interface
export abstract class TaskRepository {
  abstract getTasks(userId: string): Observable<Task[]>;
  abstract createTask(task: Omit<Task, "id">): Observable<Task>;
  abstract completeTask(taskId: string): Observable<Task>;
}

// Infrastructure Layer - Repository Implementation
@Injectable({ providedIn: "root" })
export class TaskImplRepository extends TaskRepository {
  // Implementation details...
}
```

### 2. Use Case Pattern

```typescript
@Injectable({ providedIn: "root" })
export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  execute(userId: string): Observable<Task[]> {
    return this.taskRepository.getTasks(userId);
  }
}
```

### 3. Store Pattern with Signals

```typescript
@Injectable({ providedIn: "root" })
export class TasksStoreService {
  // State
  private readonly tasksSignal = signal<Task[]>([]);

  // Selectors
  readonly tasks = this.tasksSignal.asReadonly();

  // Actions
  loadTasks(userId: string): void {
    // Implementation...
  }
}
```

### 4. Presenter/Container Pattern

- Container components handle data fetching and state management
- Presenter components are purely presentational with inputs and outputs

## Component Relationships

```
┌─────────────────────────────────────────────────────────┐
│ MainLayoutComponent                                     │
│ ┌─────────────────┐ ┌───────────────────────────────┐  │
│ │                 │ │                               │  │
│ │  HeaderComponent│ │  TasksPageComponent           │  │
│ │                 │ │  ┌────────────┐ ┌──────────┐  │  │
│ └─────────────────┘ │  │            │ │          │  │  │
│                     │  │ UserList   │ │ TaskList │  │  │
│                     │  │ Component  │ │ Component│  │  │
│                     │  │            │ │          │  │  │
│                     │  └────────────┘ └──────────┘  │  │
│                     │                               │  │
│                     └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User Interaction**

   - User selects a user from the UserListComponent
   - UserListComponent emits a userSelected event

2. **State Update**

   - TasksStoreService updates the selectedUserId state
   - TasksStoreService loads tasks for the selected user

3. **UI Update**
   - Components reactively update based on signal changes
   - TaskListComponent displays tasks for the selected user

## Error Handling Strategy

- Use cases return Observables that can emit errors
- Infrastructure layer handles error presentation
- Global error handling for unexpected errors

## Performance Considerations

- Lazy loading of features
- Efficient change detection with signals
- Minimal component re-rendering

## Development Workflow

### Trunk-Based Development

EasyTask follows Trunk-Based Development (TBD) principles for version control:

- Development primarily happens on a single branch (`main`)
- Features are developed in short-lived feature branches
- Changes are integrated frequently to the trunk (daily or more often)
- The trunk is always kept in a deployable state
- Feature flags are used to hide incomplete features

#### Workflow Steps

1. **Feature Development**

   - Create a feature branch from the trunk

   ```bash
   git checkout main
   git pull
   git checkout -b feature/descriptive-name
   ```

   - Develop in small, incremental changes
   - Commit frequently with descriptive messages

2. **Keeping Current**

   - Regularly update feature branches with changes from trunk

   ```bash
   git checkout main
   git pull
   git checkout feature/descriptive-name
   git rebase main
   ```

   - Resolve conflicts in the feature branch, not in trunk

3. **Integration**

   - Create a Pull Request for code review
   - Ensure tests pass before merging
   - After approval, merge to trunk
   - Delete the feature branch after merging

4. **Branch Naming Conventions**

   - Feature branches: `feature/descriptive-name`
   - Bug fixes: `fix/bug-description`
   - Refactoring: `refactor/description`
   - Documentation: `docs/description`

5. **Commit Message Format**

   - Follow conventional commits with cardinal numbering
   - Format: `type: description (#number)`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Example: `feat: add theme switcher component (#42)`
   - Maintain sequential numbering across all commits
   - Continue the established numbering convention from previous commits

### Feature Flags

For integrating incomplete features without affecting users, we use a dedicated FeatureFlagService:

```typescript
@Injectable({
  providedIn: "root",
})
export class FeatureFlagService {
  private flags = signal<Record<string, boolean>>({
    // Default flags
    "new-task-dialog": true,
    "task-filtering": false,
    "user-management": false,
  });

  isEnabled(flagName: string): boolean {
    return this.flags()[flagName] ?? false;
  }

  enable(flagName: string): void {
    this.flags.update((flags) => ({ ...flags, [flagName]: true }));
  }

  disable(flagName: string): void {
    this.flags.update((flags) => ({ ...flags, [flagName]: false }));
  }
}
```

Usage in components:

```typescript
@Component({
  selector: "app-my-feature",
  template: `
    @if (featureEnabled()) {
    <div>New Feature Content</div>
    } @else {
    <div>Old Feature Content</div>
    }
  `,
})
export class MyFeatureComponent {
  private featureFlagService = inject(FeatureFlagService);

  featureEnabled = computed(() => this.featureFlagService.isEnabled("my-feature-flag"));
}
```

This approach allows us to:

1. Merge incomplete features into the trunk
2. Toggle features on/off without code changes
3. Test both old and new implementations
4. Gradually roll out features to users

## Coding Patterns and Standards

### Angular 18 Patterns

- **Built-in Control Flow**:

  - Use @if instead of \*ngIf for conditional rendering
  - Use @for instead of \*ngFor for iterating over collections
  - Avoid importing CommonModule in standalone components
  - Leverage Angular 18's improved template syntax

### Component Design Patterns

- **Presentational and Container Components**:

  - Container components manage state and inject services
  - Presentational components receive data via inputs and emit events

- **Component Composition**:

  - Break down complex UIs into smaller, reusable components
  - Use content projection for flexible component templates

- **Icon System**:

  - Use Phosphor Icons for consistent iconography
  - Implement microinteractions through animation service and directives
  - Wrap icons in custom components for reusability
  - Use semantic icon names that describe their purpose

- **Dialog System Pattern**:
  - Use HTML5 dialog element for accessibility and native behavior
  - Abstract dialog functionality into reusable components
  - Implement microinteractions for opening/closing animations
  - Use service-based approach with DialogService for programmatic dialog creation
  - Provide consistent API through DialogRef for communication with the dialog content
  - Support custom content components through dynamic component creation
  - Configurable dialog size, title, and buttons
  - Accessibility features including proper ARIA attributes and keyboard navigation

### Testing Patterns

- **Feature Flag Testing Pattern**:

  - Test components with feature flags both enabled and disabled
  - Mock the FeatureFlagService in tests
  - Use a setup function that configures feature flags

  ```typescript
  const setup = (config?: { flags?: Record<string, boolean> }) => {
    // Default configuration
    const defaultConfig = {
      flags: {
        "new-task-dialog": true,
        "task-filtering": false,
      },
    };

    // Merge with provided config
    const testConfig = {
      flags: { ...defaultConfig.flags, ...config?.flags },
    };

    // Create spy for FeatureFlagService
    const featureFlagSpy = jasmine.createSpyObj("FeatureFlagService", ["isEnabled"]);

    // Configure the spy to return values based on the test config
    featureFlagSpy.isEnabled.and.callFake((flagName: string) => testConfig.flags[flagName] ?? false);

    // Configure TestBed
    TestBed.configureTestingModule({
      imports: [ComponentUnderTest],
      providers: [{ provide: FeatureFlagService, useValue: featureFlagSpy }],
    });

    // Create component and fixture
    const fixture = TestBed.createComponent(ComponentUnderTest);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    return { fixture, component, featureFlagSpy, testConfig };
  };
  ```

- **Setup Function Pattern**:

  - Use a centralized setup function for component and service tests
  - Configure test data and dependencies in one place
  - Return fixture, component/service, and mocked dependencies

  ```typescript
  const setup = (config?: {
    /* custom config */
  }) => {
    // Configure test data
    // Setup TestBed
    // Create component/service
    return { fixture, component, dependencies };
  };
  ```

- **Default Test Data**:

  - Define default test data at the top of test files
  - Allow tests to override only the data they need
  - Keep test data consistent across test cases

- **Focused Test Cases**:

  - Each test should verify one specific behavior
  - Use descriptive test names that explain what is being tested
  - Keep test assertions focused and minimal

- **Service Testing Pattern**:

  - Similar to component testing, but focused on service behavior
  - Mock all dependencies including stores, dialogs, and notifiers
  - Test different scenarios by configuring the setup function

  ```typescript
  const setup = (args?: {
    // Custom configuration
    store?: {
      /* store config */
    };
    dialogResult?: {
      /* dialog result */
    };
  }) => {
    // Configure TestBed with mocked dependencies
    // Return service and mocked dependencies
    return { service, dependencies, spies };
  };
  ```

- **Use Case Testing Pattern**:

  - Focus on business logic validation and error handling
  - Mock repositories and infrastructure services
  - Use fakeAsync/tick for testing asynchronous code
  - Test validation, error handling, and success scenarios

  ```typescript
  describe("UseCase", () => {
    let usecase: UseCase;
    let repository: jasmine.SpyObj<Repository>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [UseCase, provideCommonTestingServices(), { provide: Repository, useValue: createRepositoryMock() }],
      });

      usecase = TestBed.inject(UseCase);
      repository = TestBed.inject(Repository) as jasmine.SpyObj<Repository>;
      // Configure additional spies
    });

    it("should validate input data", fakeAsync(() => {
      // Test validation logic
    }));

    it("should handle repository errors", fakeAsync(() => {
      // Test error handling
    }));

    it("should process data successfully", fakeAsync(() => {
      // Test success scenario
    }));
  });
  ```

- **Repository Testing Pattern**:

  - Use HttpTestingController to mock HTTP requests
  - Verify correct URLs, methods, and request bodies
  - Simulate successful responses and server errors
  - Verify proper handling of responses and errors

  ```typescript
  describe("Repository", () => {
    let repository: Repository;
    let httpController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [Repository, provideHttpClient(), provideHttpClientTesting()],
      });

      repository = TestBed.inject(Repository);
      httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpController.verify(); // Verify no pending requests
    });

    it("should make correct HTTP request", () => {
      // Test HTTP request parameters
      // Verify URL, method, headers, body
    });

    it("should handle successful response", () => {
      // Test successful response handling
    });

    it("should handle server error", () => {
      // Test error response handling
    });
  });
  ```

### State Management Patterns

- **Signal-based State Management**:

  - Use signals for reactive state
  - Expose read-only signals to consumers
  - Update state through methods

- **Immutable State Updates**:
  - Create new objects when updating state
  - Use spread operator or Object.assign for shallow copies

### Styling Patterns

- **Theme-based Styling**:

  - Use predefined CSS classes for themed components
  - Combine Tailwind utilities with theme classes
  - Avoid inline styles

- **Component Encapsulation**:
  - Use ViewEncapsulation.Emulated for component styles
  - Define shared styles in global stylesheets

### Code Organization

- **Feature-based Structure**:

  - Organize code by feature rather than type
  - Keep related files close together
  - Avoid duplicate components with similar functionality across directories
  - Consolidate similar functionality into single, configurable components
  - Place feature-specific components in feature/infra/components
  - Place truly shared components in shared/components

- **Barrel Files**:

  - Use index.ts files to simplify imports
  - Export public API from feature modules
  - Keep exports up-to-date with actual component availability

- **Clean Directory Structure**:
  - Eliminate empty or redundant directories
  - Maintain consistent naming conventions
  - Follow Clean Architecture principles in directory organization
