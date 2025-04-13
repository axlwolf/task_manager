import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetTasksUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/get-tasks.usecase';
import { TaskRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/task.repository';
import { Task } from '../../../../../../../../src/app/features/tasks/domain/models/task.model';

describe('GetTasksUseCase', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      completed: false,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      dueDate: new Date('2023-12-31'),
      userId: 'user1',
      completed: true,
    },
  ];

  const setup = (config?: {
    mockTaskRepository?: {
      getTasks?: jasmine.Spy;
    };
  }) => {
    // Create a spy for the TaskRepository
    const taskRepositorySpy = jasmine.createSpyObj('TaskRepository', [
      'getTasks',
    ]);

    // Configure the spy if provided in config
    if (config?.mockTaskRepository?.getTasks) {
      taskRepositorySpy.getTasks = config.mockTaskRepository.getTasks;
    }

    TestBed.configureTestingModule({
      providers: [
        GetTasksUseCase,
        { provide: TaskRepository, useValue: taskRepositorySpy },
      ],
    });

    // Inject both the service-to-test and its (spy) dependency
    const usecase = TestBed.inject(GetTasksUseCase);
    const taskRepository = TestBed.inject(
      TaskRepository
    ) as jasmine.SpyObj<TaskRepository>;

    return { usecase, taskRepository };
  };

  it('should be created', () => {
    const { usecase } = setup();
    expect(usecase).toBeTruthy();
  });

  it('should return tasks for a user', (done) => {
    // Arrange
    const userId = 'user1';
    const taskRepositorySpy = jasmine
      .createSpy('getTasks')
      .and.returnValue(of(mockTasks));
    const { usecase, taskRepository } = setup({
      mockTaskRepository: {
        getTasks: taskRepositorySpy,
      },
    });

    // Act
    usecase.execute(userId).subscribe((tasks) => {
      // Assert
      expect(tasks).toEqual(mockTasks);
      expect(taskRepository.getTasks).toHaveBeenCalledWith(userId);
      done();
    });
  });

  it('should return empty array when no tasks are found', (done) => {
    // Arrange
    const userId = 'user2';
    const taskRepositorySpy = jasmine
      .createSpy('getTasks')
      .and.returnValue(of([]));
    const { usecase, taskRepository } = setup({
      mockTaskRepository: {
        getTasks: taskRepositorySpy,
      },
    });

    // Act
    usecase.execute(userId).subscribe((tasks) => {
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
    const taskRepositorySpy = jasmine
      .createSpy('getTasks')
      .and.returnValue(throwError(() => error));
    const { usecase, taskRepository } = setup({
      mockTaskRepository: {
        getTasks: taskRepositorySpy,
      },
    });

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
      },
    });
  });
});
