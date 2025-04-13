import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CreateTaskUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/create-task.usecase';
import { TaskRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/task.repository';
import { Task } from '../../../../../../../../src/app/features/tasks/domain/models/task.model';
import { CreateTaskDto } from '../../../../../../../../src/app/features/tasks/application/dtos/task.dto';

describe('CreateTaskUseCase', () => {
  let usecase: CreateTaskUseCase;
  let taskRepository: jasmine.SpyObj<TaskRepository>;

  const mockTask: Task = {
    id: '1',
    title: 'New Task',
    description: 'New Description',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: false
  };

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'New Task',
    description: 'New Description',
    dueDate: '2023-12-31',
    userId: 'user1'
  };

  beforeEach(() => {
    // Create a spy for the TaskRepository
    const taskRepositorySpy = jasmine.createSpyObj('TaskRepository', ['createTask']);

    TestBed.configureTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TaskRepository, useValue: taskRepositorySpy }
      ]
    });

    // Inject both the service-to-test and its (spy) dependency
    usecase = TestBed.inject(CreateTaskUseCase);
    taskRepository = TestBed.inject(TaskRepository) as jasmine.SpyObj<TaskRepository>;
  });

  it('should be created', () => {
    expect(usecase).toBeTruthy();
  });

  it('should create a task with the provided data', (done) => {
    // Arrange
    taskRepository.createTask.and.returnValue(of(mockTask));

    // Act
    usecase.execute(mockCreateTaskDto).subscribe(task => {
      // Assert
      expect(task).toEqual(mockTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith({
        title: mockCreateTaskDto.title,
        description: mockCreateTaskDto.description,
        dueDate: new Date(mockCreateTaskDto.dueDate),
        userId: mockCreateTaskDto.userId,
        completed: false
      });
      done();
    });
  });

  it('should convert string date to Date object', (done) => {
    // Arrange
    taskRepository.createTask.and.returnValue(of(mockTask));
    const dtoWithStringDate: CreateTaskDto = {
      ...mockCreateTaskDto,
      dueDate: '2023-12-31'
    };

    // Act
    usecase.execute(dtoWithStringDate).subscribe(() => {
      // Assert
      const expectedDate = new Date('2023-12-31');
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        jasmine.objectContaining({
          dueDate: jasmine.any(Date)
        })
      );
      
      // Get the actual argument passed to createTask
      const actualArg = taskRepository.createTask.calls.mostRecent().args[0];
      expect(actualArg.dueDate.getTime()).toEqual(expectedDate.getTime());
      done();
    });
  });

  it('should handle Date object in DTO', (done) => {
    // Arrange
    taskRepository.createTask.and.returnValue(of(mockTask));
    const dateObject = new Date('2023-12-31');
    const dtoWithDateObject: CreateTaskDto = {
      ...mockCreateTaskDto,
      dueDate: dateObject
    };

    // Act
    usecase.execute(dtoWithDateObject).subscribe(() => {
      // Assert
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        jasmine.objectContaining({
          dueDate: jasmine.any(Date)
        })
      );
      
      // Get the actual argument passed to createTask
      const actualArg = taskRepository.createTask.calls.mostRecent().args[0];
      expect(actualArg.dueDate).toEqual(dateObject);
      done();
    });
  });

  it('should propagate errors from the repository', (done) => {
    // Arrange
    const error = new Error('Repository error');
    taskRepository.createTask.and.returnValue(throwError(() => error));

    // Act
    usecase.execute(mockCreateTaskDto).subscribe({
      next: () => {
        fail('Expected error but got success');
      },
      error: (err) => {
        // Assert
        expect(err).toBe(error);
        expect(taskRepository.createTask).toHaveBeenCalled();
        done();
      }
    });
  });
});
