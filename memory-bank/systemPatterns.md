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
  abstract createTask(task: Omit<Task, 'id'>): Observable<Task>;
  abstract completeTask(taskId: string): Observable<Task>;
}

// Infrastructure Layer - Repository Implementation
@Injectable({ providedIn: 'root' })
export class TaskImplRepository extends TaskRepository {
  // Implementation details...
}
```

### 2. Use Case Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  execute(userId: string): Observable<Task[]> {
    return this.taskRepository.getTasks(userId);
  }
}
```

### 3. Store Pattern with Signals
```typescript
@Injectable({ providedIn: 'root' })
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