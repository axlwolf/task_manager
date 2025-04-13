import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

// Import from the actual source paths
import { Task } from '../../../../../../../../app/features/tasks/domain/models/task.model';
import { User } from '../../../../../../../../app/features/tasks/domain/models/user.model';
import { AddTaskButtonComponent } from '../../../../../../../../app/features/tasks/infra/components/add-task-button/add-task-button.component';
import { TaskCardComponent } from '../../../../../../../../app/features/tasks/infra/components/task-card/task-card.component';
import { TasksListComponent } from '../../../../../../../../app/features/tasks/infra/components/tasks-list/tasks-list.component';
import { TasksStoreService } from '../../../../../../../../app/features/tasks/infra/services/tasks-store.service';

// Default test data
const defaultData = {
  user: { id: '1', name: 'Test User' } as User,
  tasks: [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date(),
      userId: '1',
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

  // Create mock for TasksStoreService
  const tasksSpy = jasmine.createSpyObj('TasksStoreService', [
    'showAddTaskForm',
  ]);

  // Add signal properties to the spy
  Object.defineProperty(tasksSpy, 'tasks', {
    get: () => signal(testData.tasks).asReadonly(),
  });

  Object.defineProperty(tasksSpy, 'selectedUser', {
    get: () => signal(testData.user).asReadonly(),
  });

  // Configure TestBed
  TestBed.configureTestingModule({
    imports: [TasksListComponent, TaskCardComponent, AddTaskButtonComponent],
    providers: [{ provide: TasksStoreService, useValue: tasksSpy }],
  });

  // Create component and fixture
  const fixture = TestBed.createComponent(TasksListComponent);
  const component = fixture.componentInstance;
  const tasksStore = TestBed.inject(TasksStoreService);

  fixture.detectChanges();

  return { fixture, component, tasksStore, testData };
};

describe('TasksListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAnimations()],
    }).compileComponents();
  });

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should display the user name in the title', () => {
    const { fixture } = setup();

    const titleElement = fixture.nativeElement.querySelector(
      '.tasks-header-title'
    );
    expect(titleElement.textContent).toContain('Test User');
  });

  it('should display tasks from the store', () => {
    const { fixture } = setup();

    const taskElements = fixture.debugElement.queryAll(By.css('app-task-card'));
    expect(taskElements.length).toBe(1);
  });

  it('should show empty state when no tasks are available', () => {
    // Setup with empty tasks array
    const { fixture } = setup({ tasks: [] });

    // Find the empty state container
    const emptyContainer = fixture.debugElement.query(
      By.css('.tasks-empty-container')
    );
    expect(emptyContainer).toBeTruthy();

    // Check the text content
    expect(emptyContainer.nativeElement.textContent.trim()).toContain(
      'No tasks available'
    );
  });

  it('should call showAddTaskForm when add task button is clicked', () => {
    const { component, tasksStore } = setup();

    // Trigger the onAddTask method
    component.onAddTask();

    // Verify the service method was called
    expect(tasksStore.showAddTaskForm).toHaveBeenCalled();
  });

  it('should emit taskCompleted event when a task is completed', () => {
    const { component } = setup();

    // Spy on the output event
    spyOn(component.taskCompleted, 'emit');

    // Call the method with a task ID
    component.onTaskCompleted('1');

    // Verify the event was emitted with the correct ID
    expect(component.taskCompleted.emit).toHaveBeenCalledWith('1');
  });
});
