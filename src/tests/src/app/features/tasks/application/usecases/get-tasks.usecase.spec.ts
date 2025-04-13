import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetTasksUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/get-tasks.usecase';
import { TaskRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/task.repository';
import { Task } from '../../../../../../../../src/app/features/tasks/domain/models/task.model';

describe('GetTasksUseCase', () => {
  let usecase: GetTasksUseCase;
  let taskRepository: jasmine.SpyObj<TaskRepository>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      completed: false
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      completed: true
    }
  ];

  beforeEach(() => {
    // Create a spy for the TaskRepository
    const taskRepositorySpy = jasmine.createSpyObj('TaskRepository', ['getTasks']);

    TestBed.configureTestingModule({
      providers: [
        GetTasksUseCase,
        { provide: TaskRepository, useValue: taskRepositorySpy }
      ]
    });

    // Inject both the service-to-test and its (spy) dependency
    usecase = TestBed.inject(GetTasksUseCase);
    taskRepository = TestBed.inject(TaskRepository) as jasmine.SpyObj<TaskRepository>;
  });

  it('should be created', () => {
    expect(usecase).toBeTruthy();
  });

  it('should return tasks for a user', (done) => {
    // Arrange
    const userId = 'user1';
    taskRepository.getTasks.and.returnValue(of(mockTasks));

    // Act
    usecase.execute(userId).subscribe(tasks => {
      // Assert
      expect(tasks).toEqual(mockTasks);
      expect(taskRepository.getTasks).toHaveBeenCalledWith(userId);
      done();
    });
  });

  it('should return empty array when no tasks are found', (done) => {
    // Arrange
    const userId = 'user2';
    taskRepository.getTasks.and.returnValue(of([]));

    // Act
    usecase.execute(userId).subscribe(tasks => {
      // Assert
      expect(tasks).toEqual([]);
      expect(taskRepository.getTasks).toHaveBeenCalledWith(userId);
      done();
    });
  });

  it('should propagate errors from the repository', (done) => {
    // Arrange
    const userId = 'user1';
    const error = new Error('Repository error');
    taskRepository.getTasks.and.returnValue(throwError(() => error));

    // Act
    usecase.execute(userId).subscribe({
      next: () => {
        fail('Expected error but got success');
      },
      error: (err) => {
        // Assert
        expect(err).toBe(error);
        expect(taskRepository.getTasks).toHaveBeenCalledWith(userId);
        done();
      }
    });
  });
});
