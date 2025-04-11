import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../../domain/models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TASKS } from '../../../../core/data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class TaskImplRepository extends TaskRepository {
  private tasks: Task[] = [...TASKS];

  getTasks(userId: string): Observable<Task[]> {
    return of(this.tasks.filter(task => task.userId === userId));
  }

  getTaskById(taskId: string): Observable<Task> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    return of(task);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false
    };
    this.tasks.push(newTask);
    return of(newTask);
  }

  updateTask(taskId: string, taskUpdate: Partial<Task>): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskUpdate
    };
    
    this.tasks[index] = updatedTask;
    return of(updatedTask);
  }

  deleteTask(taskId: string): Observable<void> {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
    return of(void 0);
  }

  completeTask(taskId: string): Observable<Task> {
    return this.updateTask(taskId, { completed: true });
  }
}