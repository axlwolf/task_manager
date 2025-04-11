import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../domain/models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable({
  providedIn: 'root',
})
export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  execute(userId: string): Observable<Task[]> {
    return this.taskRepository.getTasks(userId);
  }
}
