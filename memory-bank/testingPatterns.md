# EasyTask - Testing Patterns

## Testing Philosophy

Our testing approach focuses on:

1. **Maintainability**: Tests should be easy to maintain and update
2. **Readability**: Tests should clearly communicate what they're testing
3. **Reliability**: Tests should be deterministic and avoid flakiness
4. **Coverage**: Tests should cover critical functionality and edge cases
5. **Isolation**: Tests should be isolated from each other and from external dependencies
6. **Consistency**: Tests should follow consistent patterns and conventions

## Testing Strategy

We follow a comprehensive testing strategy that includes:

1. **Unit Tests**: Testing individual components, services, usecases, and repositories in isolation
2. **Integration Tests**: Testing interactions between multiple components and services
3. **End-to-End Tests**: Testing complete user flows from start to finish

### Implementation Priority

1. **First Phase**: Unit tests for all usecases, services, and critical components
2. **Second Phase**: Integration tests for key user flows
3. **Third Phase**: End-to-End tests for critical user journeys

### Test File Organization

- Test files should be co-located with the files they test
- Use the `.spec.ts` suffix for test files
- For components in the `src` directory, place tests in the same directory
- For components in the root-level `tests` directory, mirror the src structure

## Component Testing

### Overview

Components represent the UI layer of the application and should be tested for correct rendering and interaction. Our testing approach for components focuses on:

1. **Rendering**: Testing that the component renders correctly with different inputs
2. **User Interaction**: Testing that the component responds correctly to user interactions
3. **State Changes**: Testing that the component updates correctly when state changes
4. **Event Emission**: Testing that the component emits expected events
5. **Integration with Services**: Testing that the component correctly interacts with services

### Implementation Plan

1. **Priority Components**:

   - `TasksListComponent`: Displays a list of tasks
   - `TaskCardComponent`: Displays a single task
   - `UserListComponent`: Displays a list of users
   - `TaskDialogFormComponent`: Form for creating/editing tasks
   - `DialogComponent`: Base dialog component

2. **Test Scenarios for Each Component**:
   - Initial rendering
   - Rendering with different inputs
   - User interactions (clicks, inputs, etc.)
   - State changes
   - Event emissions

### Setup Function Pattern

We use a standardized setup function pattern for component tests:

```typescript
// Default test data
const defaultData = {
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

  Object.defineProperty(tasksSpy, "selectedUser", {
    get: () => signal(testData.user).asReadonly(),
  });

  // Configure TestBed
  TestBed.configureTestingModule({
    imports: [ComponentUnderTest, OtherComponents],
    providers: [{ provide: DependencyService, useValue: tasksSpy }],
  });

  // Create component and fixture
  const fixture = TestBed.createComponent(ComponentUnderTest);
  const component = fixture.componentInstance;
  const dependencyService = TestBed.inject(DependencyService);

  fixture.detectChanges();

  return { fixture, component, dependencyService, testData };
};
```

### Example Test Cases

```typescript
describe("ComponentUnderTest", () => {
  it("should create", () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it("should display data from the service", () => {
    const { fixture } = setup();

    const element = fixture.debugElement.query(By.css(".data-element"));
    expect(element.nativeElement.textContent).toContain("Test User");
  });

  it("should show empty state when no data is available", () => {
    // Setup with empty data
    const { fixture } = setup({ tasks: [] });

    const emptyState = fixture.debugElement.query(By.css(".empty-state"));
    expect(emptyState).toBeTruthy();
  });

  it("should call service method when button is clicked", () => {
    const { component, dependencyService } = setup();

    component.onButtonClick();

    expect(dependencyService.serviceMethod).toHaveBeenCalled();
  });
});
```

### Benefits of This Approach

1. **Centralized Configuration**: All component setup is in one place
2. **Customizable Test Data**: Each test can customize the data it needs
3. **Clean Test Cases**: Tests focus on assertions, not setup
4. **Consistent Mocking**: Dependencies are mocked consistently
5. **Reusable Setup**: The setup function can be reused across tests

## Service Testing

### Overview

Services manage state, coordinate between components, and provide shared functionality. Our testing approach for services focuses on:

1. **State Management**: Testing that the service correctly manages and updates state
2. **Method Behavior**: Testing that service methods behave as expected
3. **Event Handling**: Testing that the service correctly responds to events
4. **Dependency Interaction**: Testing that the service correctly interacts with its dependencies

### Implementation Plan

1. **Priority Services**:

   - `TasksStoreService`: Manages task state and coordinates task operations
   - `ThemeService`: Manages theme selection and persistence
   - `DialogService`: Manages dialog creation and lifecycle
   - `AnimationService`: Provides animation capabilities

2. **Test Scenarios for Each Service**:
   - State initialization
   - State updates
   - Method behavior
   - Event handling
   - Error handling

### Testing Pattern

For services, we use an approach similar to components, with a setup function that configures dependencies and returns the service and its mocks:

```typescript
const setup = (args?: {
  store?: {
    merchantId?: number;
    merchantUsers?: OperatorsUIList | null;
    branches?: {
      merchantId: number;
      data: BranchUI[];
    } | null;
  };
  dialogResult?: OperatorWithPasswordUIDto;
}) => {
  // Configuración por defecto
  const defaultConfig = {
    store: {
      merchantId: 123,
      merchantUsers: {
        /* datos por defecto */
      },
      branches: {
        /* datos por defecto */
      },
    },
    dialogResult: {
      hasConfirmation: false,
    },
  };

  // Combinar configuración por defecto con argumentos
  const config = {
    store: {
      selectedMerchantId$: of(args?.store?.merchantId ?? defaultConfig.store.merchantId),
      merchantUsers$: of(args?.store?.merchantUsers ?? defaultConfig.store.merchantUsers),
      merchantBranches$: of(args?.store?.branches ?? defaultConfig.store.branches),
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
      provideMockServices(), // Función helper para proveer mocks comunes
      {
        provide: DependencyService,
        useValue: {
          selectedMerchantId$: config.store.selectedMerchantId$,
          merchantUsers$: config.store.merchantUsers$,
          merchantBranches$: config.store.merchantBranches$,
          setUsers: () => {
            void 0;
          },
        },
      },
      {
        provide: DialogService,
        useValue: {
          open: () => {
            return {
              afterClosed$: of(config.dialogResult),
            };
          },
        },
      },
    ],
  });

  // Obtener servicio y dependencias
  const service = TestBed.inject(ServiceUnderTest);
  const store = TestBed.inject(DependencyService);
  const notifier = TestBed.inject(NotifierService);
  const dialog = TestBed.inject(DialogService);

  // Configurar spies
  const dialogSpy = spyOn(dialog, "open").and.callThrough();
  const notifierErrorSpy = spyOn(notifier, "error").and.callThrough();
  const notifierWarningSpy = spyOn(notifier, "warning").and.callThrough();

  return {
    service,
    store,
    dialogSpy,
    notifierErrorSpy,
    notifierWarningSpy,
  };
};
```

### Ejemplo de tests para servicios

```typescript
describe("ServiceUnderTest", () => {
  it("should be created", () => {
    const { service } = setup();
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(ServiceUnderTest);
  });

  it("should show a notification when operation is cancelled", async () => {
    const { service, dialogSpy, notifierInfoSpy } = setup();
    await service.execute();

    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(notifierInfoSpy).toHaveBeenCalledTimes(1);
    expect(notifierInfoSpy).toHaveBeenCalledWith({
      title: "Operación cancelada",
    });
  });

  it("should handle validation errors", async () => {
    const { service, dialogSpy, errorHandlerSpy } = setup({
      dialogResult: {
        hasConfirmation: true,
        username: "", // Campo inválido para provocar error
      },
    });

    await service.execute();

    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
  });

  it("should successfully process valid data", async () => {
    const { service, dialogSpy, notifierSuccessSpy } = setup({
      dialogResult: {
        hasConfirmation: true,
        username: "validUser",
        password: "validPassword",
        userEmail: "valid@example.com",
        role: "Admin",
      },
    });

    await service.execute();

    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(notifierSuccessSpy).toHaveBeenCalledTimes(1);
  });
});
```

### Beneficios del enfoque para servicios

1. **Configuración centralizada**: La función setup centraliza toda la configuración del servicio y sus dependencias
2. **Datos de prueba personalizables**: Cada test puede personalizar los datos que necesita
3. **Mocking consistente**: Las dependencias se mockean de manera consistente en todos los tests
4. **Spies preconfigurados**: Los spies se configuran en la función setup, facilitando su uso en los tests
5. **Tests enfocados**: Cada test se centra en un escenario específico, con configuraciones específicas

## Use Case Testing

### Overview

Usecases represent the application's business logic and should be thoroughly tested. Our testing approach for usecases focuses on:

1. **Input Validation**: Testing that the usecase properly validates its inputs
2. **Business Logic**: Testing that the usecase correctly implements business rules
3. **Error Handling**: Testing that the usecase properly handles errors
4. **Integration with Repositories**: Testing that the usecase correctly interacts with repositories
5. **Side Effects**: Testing that the usecase triggers expected side effects (notifications, loaders, etc.)

### Implementation Plan

1. **Priority Usecases**:

   - `GetTasksUseCase`: Retrieves tasks for a user
   - `CreateTaskUseCase`: Creates a new task
   - `CompleteTaskUseCase`: Marks a task as complete
   - `GetUsersUseCase`: Retrieves available users

2. **Test Scenarios for Each Usecase**:
   - Happy path (successful execution)
   - Input validation errors
   - Repository errors
   - Edge cases (empty results, etc.)

### Testing Pattern

For usecases, we use a TestBed-based approach that allows us to test business logic in isolation:

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
        // Proveedores para servicios comunes (loader, notifier, error handler)
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

  it("should be created", () => {
    expect(usecase).toBeTruthy();
    expect(usecase).toBeInstanceOf(UpdateTaskUseCase);
  });

  it("should throw an error when the task ID is missing", fakeAsync(() => {
    // Preparar datos de prueba con error
    const invalidTask = { ...taskData, id: undefined } as any;

    // Variable para capturar el error
    let result: any;

    // Ejecutar el caso de uso
    usecase.execute(invalidTask).subscribe({
      next: fail, // Si llega aquí, el test falla
      error: (error) => {
        result = error;
      },
    });

    // Avanzar en el tiempo para que se completen las operaciones asíncronas
    tick();

    // Verificar el resultado
    expect(result).toBeInstanceOf(ValidationError);
    expect(result.message).toBe("Task ID is required");
    expect(showLoaderSpy).toHaveBeenCalledTimes(1);
    expect(hideLoaderSpy).toHaveBeenCalledTimes(1);
    expect(handleErrorSpy).toHaveBeenCalledTimes(1);
    expect(repository.updateTask).not.toHaveBeenCalled();
  }));

  it("should handle repository errors", fakeAsync(() => {
    // Configurar el repositorio para que devuelva un error
    repository.updateTask.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: "Internal Server Error",
          })
      )
    );

    let result: any;

    usecase.execute(taskData).subscribe({
      next: fail,
      error: (error) => {
        result = error;
      },
    });

    tick();

    expect(result).toBeInstanceOf(HttpErrorResponse);
    expect(result.status).toBe(500);
    expect(showLoaderSpy).toHaveBeenCalledTimes(1);
    expect(hideLoaderSpy).toHaveBeenCalledTimes(1);
    expect(handleErrorSpy).toHaveBeenCalledTimes(1);
    expect(repository.updateTask).toHaveBeenCalledTimes(1);
  }));

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
    expect(handleErrorSpy).not.toHaveBeenCalled();
  }));
});
```

### Características del testing de casos de uso

1. **Configuración con TestBed**: Utilizamos TestBed para configurar el caso de uso y sus dependencias
2. **Mocking de dependencias**: Creamos mocks para los repositorios y servicios que utiliza el caso de uso
3. **Pruebas de validación**: Verificamos que el caso de uso valide correctamente los datos de entrada
4. **Pruebas de error**: Verificamos que el caso de uso maneje correctamente los errores del repositorio
5. **Pruebas de éxito**: Verificamos que el caso de uso procese correctamente los datos y devuelva el resultado esperado
6. **Verificación de efectos secundarios**: Comprobamos que se muestren/oculten loaders, se muestren notificaciones, etc.

### Patrones comunes en tests de casos de uso

1. **Uso de fakeAsync/tick**: Para manejar código asíncrono en los tests
2. **Captura de errores**: Uso de `subscribe({ next: fail, error: e => {...} })` para capturar errores
3. **Verificación de llamadas a servicios**: Comprobar que los servicios se llaman con los parámetros correctos
4. **Verificación de flujo de error**: Comprobar que los errores se manejan correctamente
5. **Verificación de flujo exitoso**: Comprobar que el caso de uso devuelve el resultado esperado

## Repository Testing

### Overview

Repositories abstract data access and should be tested for correct interaction with external data sources. Our testing approach for repositories focuses on:

1. **API Interaction**: Testing that the repository correctly interacts with APIs
2. **Data Transformation**: Testing that the repository correctly transforms data
3. **Error Handling**: Testing that the repository properly handles API errors

### Implementation Plan

1. **Priority Repositories**:

   - `TaskImplRepository`: Implements TaskRepository for task data access
   - `UserImplRepository`: Implements UserRepository for user data access

2. **Test Scenarios for Each Repository**:
   - Successful data retrieval
   - Successful data creation/update
   - API errors
   - Data transformation

### Testing Pattern

For repositories, we use HttpTestingController to simulate HTTP interactions:

```typescript
describe("TaskRepositoryImpl", () => {
  let httpController: HttpTestingController;
  let repository: TaskRepositoryImpl;
  let spyHttp: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskRepositoryImpl,
        {
          provide: ENVIRONMENT,
          useValue: {
            apiBaseUrl: "https://api.example.com",
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(TaskRepositoryImpl);
    spyHttp = spyOn(TestBed.inject(HttpClient), "get").and.callThrough();
  });

  afterEach(() => {
    // Verificar que no haya solicitudes pendientes
    httpController.verify();
  });

  it("should be created", () => {
    expect(repository).toBeTruthy();
    expect(repository).toBeInstanceOf(TaskRepositoryImpl);
  });

  it("should retrieve tasks successfully", () => {
    const userId = "123";
    const expectedTasks = [
      {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        dueDate: new Date(),
        userId: "123",
        completed: false,
      },
    ];

    repository.getTasks(userId).subscribe({
      next: (tasks) => {
        expect(tasks).toEqual(expectedTasks);
        expect(spyHttp).toHaveBeenCalledTimes(1);
      },
      error: fail,
    });

    // Capturar y responder a la solicitud HTTP
    const req = httpController.expectOne(`https://api.example.com/users/${userId}/tasks`);

    // Verificar el método HTTP
    expect(req.request.method).toBe("GET");

    // Responder con datos simulados
    req.flush(expectedTasks);
  });

  it("should handle errors when retrieving tasks", () => {
    const userId = "123";
    const errorMessage = "Server error";

    repository.getTasks(userId).subscribe({
      next: fail,
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.status).toBe(500);
        expect(spyHttp).toHaveBeenCalledTimes(1);
      },
    });

    // Capturar y responder a la solicitud HTTP con error
    const req = httpController.expectOne(`https://api.example.com/users/${userId}/tasks`);
    req.flush(errorMessage, { status: 500, statusText: "Server Error" });
  });

  it("should create a task successfully", () => {
    const newTask = {
      title: "New Task",
      description: "New Description",
      dueDate: new Date(),
      userId: "123",
      completed: false,
    };

    const expectedResponse = {
      id: "999",
      ...newTask,
    };

    // Espiar el método post
    const postSpy = spyOn(TestBed.inject(HttpClient), "post").and.callThrough();

    repository.createTask(newTask).subscribe({
      next: (task) => {
        expect(task).toEqual(expectedResponse);
        expect(postSpy).toHaveBeenCalledTimes(1);
      },
      error: fail,
    });

    // Capturar y responder a la solicitud HTTP
    const req = httpController.expectOne(`https://api.example.com/tasks`);

    // Verificar el método HTTP y el cuerpo de la solicitud
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(newTask);

    // Responder con datos simulados
    req.flush(expectedResponse);
  });
});
```

### Características del testing de repositorios

1. **Uso de HttpTestingController**: Permite interceptar y simular respuestas HTTP
2. **Verificación de URLs**: Comprobamos que las URLs de las solicitudes sean correctas
3. **Verificación de métodos HTTP**: Comprobamos que se utilicen los métodos HTTP adecuados (GET, POST, etc.)
4. **Verificación de cuerpos de solicitud**: Para métodos como POST, verificamos que el cuerpo de la solicitud sea correcto
5. **Simulación de respuestas exitosas**: Simulamos respuestas exitosas del servidor
6. **Simulación de errores**: Simulamos errores del servidor para probar el manejo de errores
7. **Verificación de solicitudes pendientes**: Usamos `httpController.verify()` para asegurarnos de que no haya solicitudes sin responder

### Patrones comunes en tests de repositorios

1. **Configuración con TestBed**: Configuramos el repositorio y HttpTestingController con TestBed
2. **Espiar métodos HTTP**: Usamos spyOn para verificar que se llamen los métodos HTTP adecuados
3. **Expectativas de solicitudes**: Usamos `httpController.expectOne()` para capturar solicitudes
4. **Verificación de parámetros de solicitud**: Comprobamos URL, método, cuerpo, etc.
5. **Simulación de respuestas**: Usamos `req.flush()` para simular respuestas del servidor
6. **Verificación de resultados**: Comprobamos que el repositorio devuelva los datos esperados
7. **Verificación de manejo de errores**: Comprobamos que el repositorio maneje correctamente los errores

## Integration Testing

Para las pruebas de integración, probaremos la interacción entre múltiples componentes y servicios en conjunto. La estrategia a implementar incluirá:

### Estrategia de Testing de Integración

1. **Definición de Flujos Críticos**: Identificar los flujos de usuario más importantes para probar:

   - Flujo completo de creación de tareas
   - Flujo de asignación y actualización de tareas
   - Flujo de filtrado y búsqueda de tareas

2. **Enfoque de Testing**:

   - Usar TestBed para configurar múltiples componentes y servicios reales juntos
   - Minimizar los mocks, usando implementaciones reales cuando sea posible
   - Mockear solo las dependencias externas (HTTP, almacenamiento, etc.)

3. **Estructura de Tests**:

```typescript
describe("Task Management Integration", () => {
  let fixture: ComponentFixture<TasksPageComponent>;
  let component: TasksPageComponent;
  let taskService: TasksService;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TasksModule, // Módulo completo con componentes reales
        HttpClientTestingModule,
      ],
      providers: [{ provide: ENVIRONMENT, useValue: { apiBaseUrl: "https://api.example.com" } }],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TasksService);
    httpController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpController.verify();
  });

  it("should load and display tasks", fakeAsync(() => {
    // Simular respuesta HTTP para la carga inicial de tareas
    const req = httpController.expectOne("https://api.example.com/tasks");
    req.flush([{ id: "1", title: "Task 1", completed: false }]);
    tick();
    fixture.detectChanges();

    // Verificar que los componentes muestren las tareas correctamente
    const taskElements = fixture.debugElement.queryAll(By.css("app-task-card"));
    expect(taskElements.length).toBe(1);
    expect(taskElements[0].nativeElement.textContent).toContain("Task 1");
  }));

  it("should create a new task and display it", fakeAsync(() => {
    // Simular la apertura del formulario de creación de tareas
    const addButton = fixture.debugElement.query(By.css(".add-task-button"));
    addButton.triggerEventHandler("click", null);
    fixture.detectChanges();

    // Rellenar y enviar el formulario
    const form = fixture.debugElement.query(By.css("app-task-form"));
    const titleInput = form.query(By.css('input[formControlName="title"]'));
    titleInput.nativeElement.value = "New Integration Task";
    titleInput.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    const submitButton = form.query(By.css('button[type="submit"]'));
    submitButton.triggerEventHandler("click", null);

    // Simular respuesta HTTP para la creación de tarea
    const req = httpController.expectOne("https://api.example.com/tasks");
    expect(req.request.method).toBe("POST");
    expect(req.request.body.title).toBe("New Integration Task");

    req.flush({ id: "2", title: "New Integration Task", completed: false });
    tick();
    fixture.detectChanges();

    // Verificar que la nueva tarea se muestre en la lista
    const taskElements = fixture.debugElement.queryAll(By.css("app-task-card"));
    expect(taskElements.length).toBe(2);
    expect(taskElements[1].nativeElement.textContent).toContain("New Integration Task");
  }));
});
```

4. **Próximos Pasos para Implementación**:
   - Crear una carpeta `integration-tests` en la raíz del proyecto
   - Definir los flujos críticos a probar
   - Implementar tests de integración para cada flujo
   - Configurar un comando npm específico para ejecutar solo tests de integración

## End-to-End Testing

Para las pruebas end-to-end (E2E), utilizaremos Cypress para probar la aplicación completa en un entorno similar al de producción.

### Estrategia de Testing E2E

1. **Configuración de Cypress**:

   - Instalar Cypress como dependencia de desarrollo
   - Configurar entornos de prueba (desarrollo, staging)
   - Establecer comandos personalizados para operaciones comunes

2. **Estructura de Tests**:

```javascript
// cypress/e2e/task-management.cy.js
describe("Task Management", () => {
  beforeEach(() => {
    // Visitar la aplicación y posiblemente autenticarse
    cy.visit("/");
    cy.login("testuser", "password"); // Comando personalizado
  });

  it("should display the task list", () => {
    cy.get(".tasks-container").should("be.visible");
    cy.get(".task-card").should("have.length.at.least", 1);
  });

  it("should create a new task", () => {
    // Abrir formulario
    cy.get(".add-task-button").click();
    cy.get(".task-form").should("be.visible");

    // Rellenar formulario
    cy.get('input[formControlName="title"]').type("E2E Test Task");
    cy.get('textarea[formControlName="description"]').type("Created during E2E testing");

    // Enviar formulario
    cy.get('.task-form button[type="submit"]').click();

    // Verificar que la tarea se ha creado
    cy.get(".task-card").contains("E2E Test Task").should("be.visible");
    cy.get(".success-notification").should("be.visible");
  });

  it("should mark a task as completed", () => {
    // Encontrar la primera tarea no completada
    cy.get(".task-card:not(.completed)").first().as("taskToComplete");

    // Guardar el título para verificación posterior
    cy.get("@taskToComplete").find(".task-title").invoke("text").as("taskTitle");

    // Marcar como completada
    cy.get("@taskToComplete").find(".complete-checkbox").click();

    // Verificar que la tarea ahora está marcada como completada
    cy.get("@taskTitle").then((title) => {
      cy.get(".task-card.completed").contains(title).should("be.visible");
    });
  });

  it("should filter tasks", () => {
    // Verificar número inicial de tareas
    cy.get(".task-card").its("length").as("initialCount");

    // Aplicar filtro de tareas completadas
    cy.get(".filter-completed").click();

    // Verificar que el número de tareas ha cambiado
    cy.get("@initialCount").then((initialCount) => {
      cy.get(".task-card").its("length").should("not.eq", initialCount);
    });

    // Verificar que todas las tareas mostradas están completadas
    cy.get(".task-card").each(($card) => {
      cy.wrap($card).should("have.class", "completed");
    });
  });
});
```

3. **Próximos Pasos para Implementación**:

   - Instalar y configurar Cypress
   - Crear estructura base de tests E2E
   - Implementar comandos personalizados para operaciones comunes
   - Configurar CI/CD para ejecutar tests E2E en cada despliegue
   - Implementar tests para los flujos principales de usuario

4. **Consideraciones Adicionales**:
   - Implementar mecanismos para manejar datos de prueba (seeding)
   - Configurar grabación de video para depuración
   - Establecer estrategias para manejar pruebas flaky (inestables)
   - Considerar pruebas de accesibilidad y rendimiento

## Implementation Roadmap

### Phase 1: Unit Tests (Immediate Priority)

1. **Week 1: Usecase Tests**

   - Implement tests for GetTasksUseCase
   - Implement tests for CreateTaskUseCase
   - Implement tests for CompleteTaskUseCase
   - Implement tests for GetUsersUseCase

2. **Week 2: Service Tests**

   - Implement tests for TasksStoreService
   - Implement tests for ThemeService
   - Implement tests for DialogService
   - Implement tests for AnimationService

3. **Week 3: Repository Tests**

   - Implement tests for TaskImplRepository
   - Implement tests for UserImplRepository

4. **Week 4: Component Tests**
   - Implement tests for TasksListComponent
   - Implement tests for TaskCardComponent
   - Implement tests for UserListComponent
   - Implement tests for TaskDialogFormComponent
   - Implement tests for DialogComponent

### Phase 2: Integration Tests

1. **Week 5: Setup Integration Testing Infrastructure**

   - Configure TestBed for integration testing
   - Create helper functions for integration testing

2. **Week 6-7: Implement Integration Tests**
   - Task creation flow
   - Task completion flow
   - User selection flow

### Phase 3: End-to-End Tests

1. **Week 8: Setup Cypress**

   - Install and configure Cypress
   - Create helper functions and commands

2. **Week 9-10: Implement E2E Tests**
   - Task management flow
   - User selection flow
   - Theme switching flow

## Test Organization

### File Structure

- Test files should be co-located with the files they test
- Use the `.spec.ts` suffix for test files
- For components in the `src` directory, place tests in the same directory
- For components in the root-level `tests` directory, mirror the src structure

### Naming Conventions

- Test descriptions should clearly state what is being tested
- Use the format "should [expected behavior] when [condition]"
- Group related tests in nested describe blocks

## Best Practices

1. **Test in Isolation**: Mock dependencies to isolate the unit under test
2. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
3. **Keep Tests Simple**: Each test should verify one specific behavior
4. **Use Descriptive Names**: Test names should explain what is being tested
5. **Avoid Test Interdependence**: Tests should not depend on each other
6. **Clean Up After Tests**: Reset state between tests to avoid interference
7. **Test Edge Cases**: Include tests for boundary conditions and error scenarios
8. **Maintain Tests**: Update tests when the code changes
9. **Follow AAA Pattern**: Arrange, Act, Assert
10. **Use Test Doubles Appropriately**: Know when to use spies, stubs, mocks, or fakes
