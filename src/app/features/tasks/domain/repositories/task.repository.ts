import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export abstract class TaskRepository {
  abstract getTasks(userId: string): Observable<Task[]>;
  abstract getTaskById(taskId: string): Observable<Task>;
  abstract createTask(task: Omit<Task, 'id'>): Observable<Task>;
  abstract updateTask(taskId: string, task: Partial<Task>): Observable<Task>;
  abstract deleteTask(taskId: string): Observable<void>;
  abstract completeTask(taskId: string): Observable<Task>;
}