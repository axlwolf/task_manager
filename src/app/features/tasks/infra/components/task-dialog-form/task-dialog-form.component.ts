import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
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
    <dialog #dialogElement class="task-dialog">
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
          @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched)
          {
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
    </dialog>
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
        display: block;
      }

      .task-dialog {
        padding: 0;
        border: none;
        border-radius: 1rem;
        box-shadow: var(--shadow-lg);
        background-color: transparent;
        color: var(--form-text-color);
        max-width: 90vw;
        width: 500px;
        max-height: 90vh;
        overflow: hidden;
      }

      .task-dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
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
        transition: all 0.3s ease;
        border-left: 3px solid transparent;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .form-input:focus {
        outline: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        border-left: 3px solid var(--color-primary);
        transform: translateY(-2px);
      }

      .form-input.ng-touched.ng-invalid {
        border-left: 3px solid var(--color-danger);
        animation: shakeInput 0.5s ease-in-out;
      }

      @keyframes shakeInput {
        0%,
        100% {
          transform: translateX(0);
        }
        20%,
        60% {
          transform: translateX(-5px);
        }
        40%,
        80% {
          transform: translateX(5px);
        }
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
        border: 1px solid transparent;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .cancel-button:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .cancel-button:active {
        transform: translateY(1px);
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
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }

      .create-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%, -50%);
        transform-origin: 50% 50%;
      }

      .create-button:focus:not(:active)::after {
        animation: ripple 1s ease-out;
      }

      @keyframes ripple {
        0% {
          transform: scale(0, 0);
          opacity: 0.5;
        }
        20% {
          transform: scale(25, 25);
          opacity: 0.3;
        }
        100% {
          opacity: 0;
          transform: scale(40, 40);
        }
      }

      .create-button:hover {
        background-color: var(--color-primary-light);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .create-button:active {
        transform: translateY(1px);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      }

      .create-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
      }

      .create-button.submitting {
        position: relative;
        overflow: hidden;
      }

      .create-button.submitting::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
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

      /* Animation classes */
      .dialog-enter {
        animation: dialogEnter 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)
          forwards;
      }

      .dialog-exit {
        animation: dialogExit 300ms cubic-bezier(0.6, -0.28, 0.735, 0.045)
          forwards;
      }

      @keyframes dialogEnter {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          filter: blur(2px);
        }
        50% {
          opacity: 1;
          transform: scale(1.02) translateY(-5px);
          filter: blur(0);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }
      }

      @keyframes dialogExit {
        0% {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }
        100% {
          opacity: 0;
          transform: scale(0.9) translateY(10px);
          filter: blur(2px);
        }
      }

      .task-dialog::backdrop {
        animation: backdropFade 400ms ease forwards;
      }

      @keyframes backdropFade {
        from {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        to {
          opacity: 1;
          backdrop-filter: blur(2px);
        }
      }
    `,
  ],
})
export class TaskDialogFormComponent implements OnInit, AfterViewInit {
  taskForm!: FormGroup;
  @ViewChild('dialogElement') dialogElement!: ElementRef<HTMLDialogElement>;

  @Output() taskCreated = new EventEmitter<any>();
  @Output() dialogClosed = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly tasksStore = inject(TasksStoreService);
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly animationService = inject(AnimationService);
  private dialogClosing = false;

  ngAfterViewInit(): void {
    // Add animation class when the dialog is shown
    this.dialogElement.nativeElement.addEventListener('show', () => {
      this.dialogElement.nativeElement.classList.add('dialog-enter');

      // Focus the title input after the dialog appears
      setTimeout(() => {
        const titleInput = document.getElementById('title');
        if (titleInput) {
          titleInput.focus();

          // Add a subtle highlight animation to guide the user
          const animation = this.animationService.createHighlightAnimation(
            1000,
            'rgba(var(--primary-rgb), 0.1)'
          );
          this.animationService.playAnimation(
            titleInput as HTMLElement,
            animation
          );
        }
      }, 500); // Wait for the dialog animation to complete
    });

    // Add focus/blur animations to form inputs
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach((input) => {
      input.addEventListener('focus', () => {
        const animation = this.animationService.createPulseAnimation(300, 1.02);
        this.animationService.playAnimation(input as HTMLElement, animation);
      });
    });
  }

  open(): void {
    if (!this.dialogElement) return;

    const dialog = this.dialogElement.nativeElement;

    // Reset animation classes
    dialog.classList.remove('dialog-exit');
    dialog.classList.add('dialog-enter');

    // Show the dialog
    if (!dialog.open) {
      dialog.showModal();
    }
  }

  close(result?: any): void {
    if (!this.dialogElement || this.dialogClosing) return;

    this.dialogClosing = true;
    const dialog = this.dialogElement.nativeElement;

    // Add exit animation
    dialog.classList.remove('dialog-enter');
    dialog.classList.add('dialog-exit');

    // Wait for animation to complete before closing
    setTimeout(() => {
      dialog.close();
      this.dialogClosed.emit();
      this.dialogClosing = false;
      if (result) {
        this.taskCreated.emit(result);
      }
    }, 150); // Match the animation duration
  }

  onCancel(): void {
    this.close();
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

      // Add shake animation to invalid fields
      const invalidFields = document.querySelectorAll('.ng-invalid.ng-touched');
      invalidFields.forEach((field) => {
        const animation = this.animationService.createShakeAnimation(500, 5);
        this.animationService.playAnimation(field as HTMLElement, animation);
      });

      return;
    }

    const formValue = this.taskForm.value;
    const userId = this.tasksStore.selectedUserId();

    if (!userId) {
      console.error('No user selected');
      return;
    }

    // Add loading effect to create button
    const createButton = document.querySelector('.create-button');
    if (createButton) {
      createButton.classList.add('submitting');
      createButton.setAttribute('disabled', 'true');
      (createButton as HTMLElement).style.position = 'relative';
      (createButton as HTMLElement).style.overflow = 'hidden';
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
      // First, add a subtle pulse animation
      const pulseAnimation = this.animationService.createPulseAnimation(
        400,
        1.03
      );
      this.animationService.playAnimation(
        formElement as HTMLElement,
        pulseAnimation
      );

      // Then, add the highlight animation
      setTimeout(() => {
        const highlightAnimation =
          this.animationService.createHighlightAnimation(
            1000,
            'rgba(var(--success-rgb), 0.2)'
          );
        this.animationService.playAnimation(
          formElement as HTMLElement,
          highlightAnimation
        );

        // Close the dialog after the animation completes
        setTimeout(() => this.close(task), 600);
      }, 300);
    } else {
      // If no form element found, just close the dialog
      this.close(task);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
