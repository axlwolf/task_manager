import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TasksStoreService } from '../../services/tasks-store.service';
import { CreateTaskUseCase } from '../../../application/usecases/create-task.usecase';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { PulseDirective } from '../../../../../shared/directives/pulse.directive';
import { BounceDirective } from '../../../../../shared/directives/bounce.directive';
import { AnimationService } from '../../../../../shared/services/animation.service';

@Component({
  selector: 'app-task-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    PulseDirective,
    BounceDirective,
  ],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
      <div class="form-group">
        <label for="title" class="form-label">
          <app-icon
            name="edit"
            [size]="16"
            theme="primary"
            class="mr-1"
          ></app-icon>
          Task Title
        </label>
        <input
          type="text"
          id="title"
          formControlName="title"
          class="form-input"
          placeholder="Enter task title"
          appPulse
          [pulseOnFocus]="true"
          #titleInput
        />
        <div
          *ngIf="
            taskForm.get('title')?.invalid && taskForm.get('title')?.touched
          "
          class="form-error"
        >
          <app-icon
            name="alert-circle"
            [size]="16"
            theme="danger"
            class="mr-1"
          ></app-icon>
          Title is required
        </div>
      </div>

      <div class="form-group">
        <label for="description" class="form-label">
          <app-icon
            name="file-text"
            [size]="16"
            theme="primary"
            class="mr-1"
          ></app-icon>
          Description
        </label>
        <textarea
          id="description"
          formControlName="description"
          class="form-input form-textarea"
          placeholder="Enter task description"
          rows="4"
          appPulse
          [pulseOnFocus]="true"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="dueDate" class="form-label">
          <app-icon
            name="calendar"
            [size]="16"
            theme="primary"
            class="mr-1"
          ></app-icon>
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          formControlName="dueDate"
          class="form-input"
          appPulse
          [pulseOnFocus]="true"
        />
        <div
          *ngIf="
            taskForm.get('dueDate')?.invalid && taskForm.get('dueDate')?.touched
          "
          class="form-error"
        >
          <app-icon
            name="alert-circle"
            [size]="16"
            theme="danger"
            class="mr-1"
          ></app-icon>
          Due date is required
        </div>
      </div>

      <div class="form-actions" dialog-footer>
        <button
          type="submit"
          class="form-submit-button"
          [disabled]="taskForm.invalid"
          appBounce
          [bounceOnClick]="true"
        >
          <app-icon
            name="check-circle"
            [size]="16"
            theme="light"
            class="mr-1"
          ></app-icon>
          Add Task
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .task-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .form-group {
        margin-bottom: var(--space-4);
      }

      .form-label {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-accent);
        margin-bottom: var(--space-2);
      }

      .form-input {
        width: 100%;
        padding: var(--space-3) var(--space-4);
        background-color: var(--color-input-bg);
        border: 1px solid var(--color-input-border);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        transition: border-color var(--transition-fast),
          box-shadow var(--transition-fast);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-input-focus);
        box-shadow: 0 0 0 2px var(--color-primary-200);
      }

      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-error {
        margin-top: var(--space-2);
        font-size: 0.875rem;
        color: var(--color-error);
        display: flex;
        align-items: center;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--space-4);
      }

      .form-submit-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-2) var(--space-4);
        background-color: var(--color-primary-600);
        color: var(--color-text-on-primary);
        border: none;
        border-radius: var(--radius-md);
        font-weight: 500;
        cursor: pointer;
        transition: background-color var(--transition-fast);
      }

      .form-submit-button:hover:not(:disabled) {
        background-color: var(--color-primary-700);
      }

      .form-submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class TaskDialogFormComponent implements OnInit {
  taskForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly tasksStore = inject(TasksStoreService);
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly animationService = inject(AnimationService);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const today = new Date();
    const formattedDate = this.formatDate(today);

    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      dueDate: [formattedDate, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.taskForm.controls).forEach((key) => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValue = this.taskForm.value;
    const userId = this.tasksStore.selectedUserId();

    if (!userId) {
      console.error('No user selected');
      return;
    }

    const task = {
      title: formValue.title,
      description: formValue.description,
      dueDate: new Date(formValue.dueDate),
      userId,
      completed: false,
    };

    this.createTaskUseCase.execute(task);

    // Add success animation to the form
    const formElement = document.querySelector('.task-form');
    if (formElement) {
      const animation = this.animationService.createHighlightAnimation(
        1000,
        'rgba(var(--success-rgb), 0.2)'
      );
      this.animationService.playAnimation(
        formElement as HTMLElement,
        animation
      );
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
