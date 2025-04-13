import {
  Component,
  inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
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
    </form>
  `,
  styles: [
    `
      :host {
        --form-bg-color: transparent;
        --form-text-color: var(--color-text-primary);
        --form-input-bg: #e0d8ee;
        --form-input-text: #333;
        --form-button-bg: #b69edf;
        --form-button-text: #333;
        display: block;
      }

      .task-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
        color: var(--form-text-color);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0;
      }

      .form-label {
        font-size: 1rem;
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

  // Referencia al diálogo proporcionada por el DialogService
  public dialogRef!: DialogRef;

  @Output() taskCreated = new EventEmitter<any>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly tasksStore = inject(TasksStoreService);
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly animationService = inject(AnimationService);

  ngOnInit(): void {
    this.initForm();

    // Focus en el campo de título cuando se abre el diálogo
    setTimeout(() => {
      const titleInput = document.getElementById('title');
      if (titleInput) {
        titleInput.focus();

        // Animar para guiar al usuario
        const animation = this.animationService.createHighlightAnimation(
          1000,
          'rgba(var(--primary-rgb), 0.1)'
        );
        this.animationService.playAnimation(
          titleInput as HTMLElement,
          animation
        );
      }
    }, 300);
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
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.taskForm.controls).forEach((key) => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });

      // Animación de sacudida para campos inválidos
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

    const task = {
      title: formValue.title,
      description: formValue.description,
      dueDate: new Date(formValue.dueDate),
      userId,
      completed: false,
    };

    // Crear la tarea usando el servicio del store directamente
    this.tasksStore.createTask(task);

    // Emitir el evento y cerrar el diálogo
    this.taskCreated.emit(task);
    this.dialogRef.close(task);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
