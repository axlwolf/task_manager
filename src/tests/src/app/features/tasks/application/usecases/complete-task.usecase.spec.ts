import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CompleteTaskUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/complete-task.usecase';
import { TaskRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/task.repository';
import { Task } from '../../../../../../../../src/app/features/tasks/domain/models/task.model';

describe('CompleteTaskUseCase', () => {
  let usecase: CompleteTaskUseCase;
  let taskRepository: jasmine.SpyObj<TaskRepository>;

  const mockTask: Task = {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: false
  };

  const mockCompletedTask: Task = {
    ...mockTask,
    completed: true
  };

  beforeEach(() => {
    // Create a spy for the TaskRepository
    const taskRepositorySpy = jasmine.createSpyObj('TaskRepository', ['completeTask']);

    TestBed.configureTestingModule({
      providers: [
        CompleteTaskUseCase,
        { provide: TaskRepository, useValue: taskRepositorySpy }
      ]
    });

    // Inject both the service-to-test and its (spy) dependency
    usecase = TestBed.inject(CompleteTaskUseCase);
    taskRepository = TestBed.inject(TaskRepository) as jasmine.SpyObj<TaskRepository>;
  });

  it('should be created', () => {
    expect(usecase).toBeTruthy();
  });

  it('should mark a task as completed', (done) => {
    // Arrange
    const taskId = '1';
    taskRepository.completeTask.and.returnValue(of(mockCompletedTask));

    // Act
    usecase.execute(taskId).subscribe(task => {
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
    taskRepository.completeTask.and.returnValue(throwError(() => error));

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
      }
    });
  });

  it('should handle non-existent task ID', (done) => {
    // Arrange
    const nonExistentTaskId = 'non-existent-id';
    const error = new Error('Task not found');
    taskRepository.completeTask.and.returnValue(throwError(() => error));

    // Act
    usecase.execute(nonExistentTaskId).subscribe({
      next: () => {
        fail('Expected error but got success');
      },
      error: (err) => {
        // Assert
        expect(err).toBe(error);
        expect(taskRepository.completeTask).toHaveBeenCalledWith(nonExistentTaskId);
        done();
      }
    });
  });
});
