import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { CreateTaskDto } from '../../../application/dtos/task.dto';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div
      class="card"
      style="background-color: var(--color-form-bg); border-color: var(--color-form-border);"
    >
      <h2
        class="text-2xl font-bold mb-6 flex items-center"
        style="color: var(--color-text-accent);"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add New Task
      </h2>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Title Field -->
        <div class="form-group">
          <label for="title" class="form-label">Task Title</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            class="form-input"
            placeholder="Enter a descriptive title"
          />
          @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched)
          {
          <p class="form-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Title is required
          </p>
          }
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            class="form-input"
            placeholder="Describe the task in detail"
          ></textarea>
          @if (taskForm.get('description')?.invalid &&
          taskForm.get('description')?.touched) {
          <p class="form-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Description is required
          </p>
          }
        </div>

        <!-- Due Date Field -->
        <div class="form-group">
          <label for="dueDate" class="form-label">Due Date</label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style="color: var(--color-primary-500);"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="date"
              id="dueDate"
              formControlName="dueDate"
              class="form-input pl-10"
            />
          </div>
          @if (taskForm.get('dueDate')?.invalid &&
          taskForm.get('dueDate')?.touched) {
          <p class="form-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Due date is required
          </p>
          }
        </div>

        <!-- Form Actions -->
        <div
          class="flex justify-end space-x-4 pt-4"
          style="border-top: 1px solid var(--color-border-accent);"
        >
          <app-button
            variant="secondary"
            type="button"
            (buttonClick)="onCancel()"
          >
            Cancel
          </app-button>
          <app-button
            variant="primary"
            type="submit"
            [disabled]="taskForm.invalid"
          >
            Add Task
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class TaskFormComponent {
  private readonly tasksStore = inject(TasksStoreService);
  private readonly fb = inject(FormBuilder);

  taskForm: FormGroup;

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.tasksStore.selectedUserId()) {
      const taskDto: CreateTaskDto = {
        ...this.taskForm.value,
        userId: this.tasksStore.selectedUserId()!,
      };

      this.tasksStore.createTask(taskDto);
    }
  }

  onCancel(): void {
    this.tasksStore.hideTaskForm();
  }
}
