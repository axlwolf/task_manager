import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../domain/models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskDto } from '../dtos/task.dto';

@Injectable({
  providedIn: 'root',
})
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  execute(createTaskDto: CreateTaskDto): Observable<Task> {
    return this.taskRepository.createTask({
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: new Date(createTaskDto.dueDate),
      userId: createTaskDto.userId,
      completed: false,
    });
  }
}
