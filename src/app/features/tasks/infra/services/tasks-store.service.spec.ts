import { TestBed } from '@angular/core/testing';
import { TasksStoreService } from './tasks-store.service';
import { GetTasksUseCase } from '../../application/usecases/get-tasks.usecase';
import { GetUsersUseCase } from '../../application/usecases/get-users.usecase';
import { CreateTaskUseCase } from '../../application/usecases/create-task.usecase';
import { CompleteTaskUseCase } from '../../application/usecases/complete-task.usecase';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import { of, throwError } from 'rxjs';
import { Task } from '../../domain/models/task.model';
import { User } from '../../domain/models/user.model';
import { CreateTaskDto } from '../../application/dtos/task.dto';
import { ViewContainerRef } from '@angular/core';
import { TaskDialogFormComponent } from '../components/task-dialog-form/task-dialog-form.component';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';

describe('TasksStoreService', () => {
  let service: TasksStoreService;
  let getTasksUseCase: jasmine.SpyObj<GetTasksUseCase>;
  let getUsersUseCase: jasmine.SpyObj<GetUsersUseCase>;
  let createTaskUseCase: jasmine.SpyObj<CreateTaskUseCase>;
  let completeTaskUseCase: jasmine.SpyObj<CompleteTaskUseCase>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let viewContainerRef: jasmine.SpyObj<ViewContainerRef>;
  let dialogRef: jasmine.SpyObj<DialogRef>;

  const mockUsers: User[] = [
    { id: 'user1', name: 'User 1', avatar: 'avatar1.png' },
    { id: 'user2', name: 'User 2', avatar: 'avatar2.png' }
  ];

  const mockTasks: Task[] = [
    {
      id: 'task1',
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      completed: false
    },
    {
      id: 'task2',
      title: 'Task 2',
      description: 'Description 2',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      completed: true
    }
  ];

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'New Task',
    description: 'New Description',
    dueDate: new Date('2023-12-31'),
    userId: 'user1'
  };

  const mockNewTask: Task = {
    id: 'task3',
    title: 'New Task',
    description: 'New Description',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: false
  };

  const mockCompletedTask: Task = {
    ...mockTasks[0],
    completed: true
  };

  beforeEach(() => {
    // Create spies
    getTasksUseCase = jasmine.createSpyObj('GetTasksUseCase', ['execute']);
    getUsersUseCase = jasmine.createSpyObj('GetUsersUseCase', ['execute']);
    createTaskUseCase = jasmine.createSpyObj('CreateTaskUseCase', ['execute']);
    completeTaskUseCase = jasmine.createSpyObj('CompleteTaskUseCase', ['execute']);
    dialogService = jasmine.createSpyObj('DialogService', ['open']);
    viewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['clear']);
    dialogRef = jasmine.createSpyObj('DialogRef', ['close'], {
      afterClosed$: of(undefined)
    });

    // Configure default behavior
    getUsersUseCase.execute.and.returnValue(of(mockUsers));
    getTasksUseCase.execute.and.returnValue(of(mockTasks));
    createTaskUseCase.execute.and.returnValue(of(mockNewTask));
    completeTaskUseCase.execute.and.returnValue(of(mockCompletedTask));
    dialogService.open.and.returnValue(dialogRef);

    TestBed.configureTestingModule({
      providers: [
        TasksStoreService,
        { provide: GetTasksUseCase, useValue: getTasksUseCase },
        { provide: GetUsersUseCase, useValue: getUsersUseCase },
        { provide: CreateTaskUseCase, useValue: createTaskUseCase },
        { provide: CompleteTaskUseCase, useValue: completeTaskUseCase },
        { provide: DialogService, useValue: dialogService }
      ]
    });

    service = TestBed.inject(TasksStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users on initialization', () => {
    // Assert
    expect(getUsersUseCase.execute).toHaveBeenCalled();
    expect(service.users()).toEqual(mockUsers);
  });

  it('should select first user and load their tasks on initialization', () => {
    // Assert
    expect(service.selectedUserId()).toBe('user1');
    expect(getTasksUseCase.execute).toHaveBeenCalledWith('user1');
    expect(service.tasks()).toEqual(mockTasks);
  });

  it('should select a user and load their tasks', () => {
    // Act
    service.selectUser('user2');
    
    // Assert
    expect(service.selectedUserId()).toBe('user2');
    expect(getTasksUseCase.execute).toHaveBeenCalledWith('user2');
  });

  it('should create a task', () => {
    // Arrange
    const initialTasksCount = service.tasks().length;
    
    // Act
    service.createTask(mockCreateTaskDto);
    
    // Assert
    expect(createTaskUseCase.execute).toHaveBeenCalledWith(mockCreateTaskDto);
    expect(service.tasks().length).toBe(initialTasksCount + 1);
    expect(service.tasks()).toContain(mockNewTask);
  });

  it('should handle task creation error', () => {
    // Arrange
    createTaskUseCase.execute.and.returnValue(throwError(() => new Error('Creation failed')));
    const initialTasksCount = service.tasks().length;
    
    // Act
    service.createTask(mockCreateTaskDto);
    
    // Assert
    expect(createTaskUseCase.execute).toHaveBeenCalledWith(mockCreateTaskDto);
    expect(service.tasks().length).toBe(initialTasksCount); // No change in tasks
  });

  it('should complete a task', () => {
    // Act
    service.completeTask('task1');
    
    // Assert
    expect(completeTaskUseCase.execute).toHaveBeenCalledWith('task1');
    
    // Find the task in the updated tasks array
    const updatedTask = service.tasks().find(task => task.id === 'task1');
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.completed).toBeTrue();
  });

  it('should handle task completion error', () => {
    // Arrange
    completeTaskUseCase.execute.and.returnValue(throwError(() => new Error('Completion failed')));
    
    // Act
    service.completeTask('task1');
    
    // Assert
    expect(completeTaskUseCase.execute).toHaveBeenCalledWith('task1');
    
    // Task should remain unchanged
    const task = service.tasks().find(t => t.id === 'task1');
    expect(task?.completed).toBeFalse();
  });

  it('should set view container ref', () => {
    // Act
    service.setViewContainerRef(viewContainerRef);
    
    // Assert - we'll test this indirectly through showAddTaskForm
    service.showAddTaskForm();
    expect(dialogService.open).toHaveBeenCalled();
  });

  it('should show add task form dialog', () => {
    // Arrange
    service.setViewContainerRef(viewContainerRef);
    
    // Act
    service.showAddTaskForm();
    
    // Assert
    expect(dialogService.open).toHaveBeenCalledWith(
      TaskDialogFormComponent,
      jasmine.objectContaining({
        title: 'Add Task',
        size: 'md'
      }),
      viewContainerRef
    );
  });

  it('should not show dialog if view container ref is not set', () => {
    // Act
    service.showAddTaskForm();
    
    // Assert
    expect(dialogService.open).not.toHaveBeenCalled();
  });

  it('should compute selected user correctly', () => {
    // Act
    service.selectUser('user2');
    
    // Assert
    expect(service.selectedUser()).toEqual(mockUsers[1]);
  });

  it('should return null for selected user when no user is selected', () => {
    // Arrange - create a new instance without auto-selecting first user
    getUsersUseCase.execute.and.returnValue(of([]));
    const emptyService = TestBed.inject(TasksStoreService);
    
    // Assert
    expect(emptyService.selectedUser()).toBeNull();
  });

  it('should handle loading state correctly', () => {
    // Initially loading should be false after initialization completes
    expect(service.loading()).toBeFalse();
    
    // When loading tasks, loading should be true then false
    getUsersUseCase.execute.and.returnValue(of(mockUsers)); // Reset to avoid side effects
    
    // Act - trigger loading
    service.loadUsers();
    
    // Assert - should be false after observable completes
    expect(service.loading()).toBeFalse();
  });
});
