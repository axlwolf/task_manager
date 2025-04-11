import { Component, inject, OnInit } from '@angular/core';
// Angular 18 no longer requires CommonModule for control flow directives
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
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';

@Component({
  selector: 'app-task-dialog-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconComponent,
    PulseDirective,
    BounceDirective,
  ],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
      <h1 class="dialog-title">Add Task</h1>

      <div class="form-group">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          id="title"
          formControlName="title"
          class="form-input"
          placeholder="Enter task title"
          appPulse
          #titleInput
        />
        @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
        <div class="form-error">
          <app-icon
            name="alert-circle"
            [size]="16"
            theme="danger"
            class="mr-1"
          ></app-icon>
          Title is required
        </div>
        }
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Summary</label>
        <textarea
          id="description"
          formControlName="description"
          class="form-input form-textarea"
          placeholder="Enter task summary"
          rows="6"
          appPulse
        ></textarea>
      </div>

      <div class="form-group">
        <label for="dueDate" class="form-label">Due Date</label>
        <div class="date-input-container">
          <input
            type="date"
            id="dueDate"
            formControlName="dueDate"
            class="form-input date-input"
            placeholder="dd.mm.yyyy"
            appPulse
          />
          <app-icon
            name="calendar"
            [size]="20"
            theme="secondary"
            class="date-icon"
          ></app-icon>
        </div>
        @if (taskForm.get('dueDate')?.invalid &&
        taskForm.get('dueDate')?.touched) {
        <div class="form-error">
          <app-icon
            name="alert-circle"
            [size]="16"
            theme="danger"
            class="mr-1"
          ></app-icon>
          Due date is required
        </div>
        }
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="cancel-button"
          (click)="onCancel()"
          appPulse
        >
          Cancel
        </button>
        <button
          type="submit"
          class="create-button"
          [disabled]="taskForm.invalid"
          appBounce
          [bounceOnClick]="true"
        >
          Create
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        --form-bg-color: var(--color-primary-dark);
        --form-text-color: white;
        --form-input-bg: #e0d8ee;
        --form-input-text: #333;
        --form-button-bg: #b69edf;
        --form-button-text: #333;
      }

      .task-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
        padding: 2rem;
        background-color: var(--form-bg-color);
        color: var(--form-text-color);
        border-radius: 1rem;
      }

      .dialog-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--form-text-color);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0;
      }

      .form-label {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--form-text-color);
        display: block;
        margin-bottom: 0.5rem;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 0.375rem;
        background-color: var(--form-input-bg);
        color: var(--form-input-text);
        font-size: 1rem;
        transition: box-shadow 0.2s;
      }

      .form-input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
      }

      .form-textarea {
        min-height: 150px;
        resize: none;
      }

      .date-input-container {
        position: relative;
      }

      .date-input {
        width: 100%;
      }

      .date-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }

      .form-error {
        display: flex;
        align-items: center;
        color: #ff6b6b;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }

      .cancel-button {
        padding: 0.75rem 1.5rem;
        background: transparent;
        color: var(--form-text-color);
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .cancel-button:hover {
        opacity: 0.8;
      }

      .create-button {
        padding: 0.75rem 1.5rem;
        background-color: var(--form-button-bg);
        color: var(--form-button-text);
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .create-button:hover {
        opacity: 0.9;
      }

      .create-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .mr-1 {
        margin-right: 0.25rem;
      }

      /* Estilos específicos para el input de fecha */
      input[type='date']::-webkit-calendar-picker-indicator {
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
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
  private readonly dialogRef = inject(DialogRef);

  onCancel(): void {
    this.dialogRef.close();
  }

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

    // Close the dialog after successful submission
    this.dialogRef.close(task);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
