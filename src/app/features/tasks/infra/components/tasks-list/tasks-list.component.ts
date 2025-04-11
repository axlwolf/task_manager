import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksStoreService } from '../../services/tasks-store.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { AddTaskButtonComponent } from '../add-task-button/add-task-button.component';
import { Task } from '../../../domain/models/task.model';
import { User } from '../../../domain/models/user.model';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, AddTaskButtonComponent],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  protected readonly tasksStore = inject(TasksStoreService);

  // Inputs para hacer el componente más independiente del store
  @Input() tasks: Task[] = [];
  @Input() selectedUser: User | null = null;

  // Outputs para eventos
  @Output() addTask = new EventEmitter<void>();
  @Output() taskCompleted = new EventEmitter<string>();

  // Getters para usar inputs o store según disponibilidad
  get displayTasks(): Task[] {
    return this.tasks.length > 0 ? this.tasks : this.tasksStore.tasks();
  }

  get displayUser(): User | null {
    return this.selectedUser || this.tasksStore.selectedUser();
  }

  onAddTask(): void {
    if (this.addTask.observed) {
      this.addTask.emit();
    } else {
      this.tasksStore.showAddTaskForm();
    }
  }

  onTaskCompleted(taskId: string): void {
    this.taskCompleted.emit(taskId);
  }
}
