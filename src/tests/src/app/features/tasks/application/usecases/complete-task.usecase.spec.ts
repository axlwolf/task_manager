import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CompleteTaskUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/complete-task.usecase';
import { TaskRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/task.repository';
import { Task } from '../../../../../../../../src/app/features/tasks/domain/models/task.model';

describe('CompleteTaskUseCase', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: false,
  };

  const mockCompletedTask: Task = {
    ...mockTask,
    completed: true,
  };

  const setup = (config?: {
    mockTaskRepository?: {
      completeTask?: jasmine.Spy;
    };
  }) => {
    // Create a spy for the TaskRepository
    const taskRepositorySpy = jasmine.createSpyObj('TaskRepository', [
      'completeTask',
    ]);

    // Configure the spy if provided in config
    if (config?.mockTaskRepository?.completeTask) {
      taskRepositorySpy.completeTask = config.mockTaskRepository.completeTask;
    }

    TestBed.configureTestingModule({
      providers: [
        CompleteTaskUseCase,
        { provide: TaskRepository, useValue: taskRepositorySpy },
      ],
    });

    // Inject both the service-to-test and its (spy) dependency
    const usecase = TestBed.inject(CompleteTaskUseCase);
    const taskRepository = TestBed.inject(
      TaskRepository
    ) as jasmine.SpyObj<TaskRepository>;

    return { usecase, taskRepository };
  };

  it('should be created', () => {
    const { usecase } = setup();
    expect(usecase).toBeTruthy();
  });

  it('should mark a task as completed', (done) => {
    // Arrange
    const taskId = '1';
    const completeTaskSpy = jasmine
      .createSpy('completeTask')
      .and.returnValue(of(mockCompletedTask));
    const { usecase, taskRepository } = setup({
      mockTaskRepository: {
        completeTask: completeTaskSpy,
      },
    });

    // Act
    usecase.execute(taskId).subscribe((task) => {
      // Assert
      expect(task).toEqual(mockCompletedTask);
      expect(task.completed).toBeTrue();
      expect(taskRepository.completeTask).toHaveBeenCalledWith(taskId);
      done();
    });
  });

  it('should propagate errors from the repository', (done) => {
    // Arrange
    const taskId = '1';
    const error = new Error('Repository error');
    const completeTaskSpy = jasmine
      .createSpy('completeTask')
      .and.returnValue(throwError(() => error));
    const { usecase, taskRepository } = setup({
      mockTaskRepository: {
        completeTask: completeTaskSpy,
      },
    });

    // Act
    usecase.execute(taskId).subscribe({
      next: () => {
        fail('Expected error but got success');
      },
      error: (err) => {
        // Assert
        expect(err).toBe(error);
        expect(taskRepository.completeTask).toHaveBeenCalledWith(taskId);
        done();
      },
    });
  });

  it('should handle non-existent task ID', (done) => {
    // Arrange
    const nonExistentTaskId = 'non-existent-id';
    const error = new Error('Task not found');
    const completeTaskSpy = jasmine
      .createSpy('completeTask')
      .and.returnValue(throwError(() => error));
    const { usecase, taskRepository } = setup({
      mockTaskRepository: {
        completeTask: completeTaskSpy,
      },
    });

    // Act
    usecase.execute(nonExistentTaskId).subscribe({
      next: () => {
        fail('Expected error but got success');
      },
      error: (err) => {
        // Assert
        expect(err).toBe(error);
        expect(taskRepository.completeTask).toHaveBeenCalledWith(
          nonExistentTaskId
        );
        done();
      },
    });
  });
});
