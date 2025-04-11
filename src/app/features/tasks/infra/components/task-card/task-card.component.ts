import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../../domain/models/task.model';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, DatePipe, ButtonComponent],
  template: `
    <div
      class="task-card mb-4"
      [ngStyle]="{
        'background-color': 'var(--color-card-bg)',
        'border-color': 'var(--color-card-border)',
        'box-shadow': 'var(--shadow-md)'
      }"
    >
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-2xl font-bold" style="color: var(--color-text-accent);">
          {{ task.title }}
        </h3>
        <span
          class="px-2 py-1 rounded-full text-xs font-medium"
          [ngStyle]="{
            'background-color': task.completed
              ? 'var(--color-success)'
              : 'var(--color-primary-200)',
            color: task.completed ? 'white' : 'var(--color-text-accent)'
          }"
        >
          {{ task.completed ? 'Completed' : 'Active' }}
        </span>
      </div>

      <p class="text-sm mb-4" style="color: var(--color-text-secondary);">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="inline-block h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {{ task.dueDate | date : 'MMM d, yyyy' }}
      </p>

      <p class="mb-6" style="color: var(--color-text-primary);">
        {{ task.description }}
      </p>

      <div class="flex justify-end">
        <app-button
          variant="primary"
          [disabled]="task.completed"
          (buttonClick)="onCompleteTask()"
        >
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
}
