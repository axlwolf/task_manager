import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../../domain/models/task.model';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, DatePipe, ButtonComponent, IconComponent],
  template: `
    <div class="task-card mb-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="task-title">
          {{ task.title }}
        </h3>
        <span
          class="task-status-badge"
          [ngClass]="
            task.completed
              ? 'task-status-badge-completed'
              : 'task-status-badge-active'
          "
        >
          {{ task.completed ? 'Completed' : 'Active' }}
        </span>
      </div>

      <p class="task-date">
        <app-icon
          name="calendar"
          [size]="16"
          theme="secondary"
          [animate]="true"
          class="inline-block mr-1"
        >
        </app-icon>
        {{ task.dueDate | date : 'MMM d, yyyy' }}
      </p>

      <p class="task-description">
        {{ task.description }}
      </p>

      <div class="flex justify-end space-x-2">
        <app-icon
          name="edit"
          [size]="20"
          theme="secondary"
          [animate]="true"
          [interactive]="true"
          (click)="onEditTask()"
        ></app-icon>

        <app-icon
          name="trash"
          [size]="20"
          theme="danger"
          [animate]="true"
          [interactive]="true"
          (click)="onDeleteTask()"
        ></app-icon>

        <app-button
          variant="primary"
          [disabled]="task.completed"
          (buttonClick)="onCompleteTask()"
        >
          <app-icon
            name="check-circle"
            [size]="16"
            theme="light"
            class="inline-block mr-1"
          ></app-icon>
          {{ task.completed ? 'Completed' : 'Complete' }}
        </app-button>
      </div>
    </div>
  `,
  styles: [],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  private readonly tasksStore = inject(TasksStoreService);

  onCompleteTask(): void {
    this.tasksStore.completeTask(this.task.id);
  }

  onEditTask(): void {
    // This will be implemented in a future update
    console.log('Edit task:', this.task.id);
  }

  onDeleteTask(): void {
    // This will be implemented in a future update
    console.log('Delete task:', this.task.id);
  }
}
