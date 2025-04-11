import {
  Injectable,
  DestroyRef,
  computed,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { Task } from '../../domain/models/task.model';
import { User } from '../../domain/models/user.model';
import { GetTasksUseCase } from '../../application/usecases/get-tasks.usecase';
import { GetUsersUseCase } from '../../application/usecases/get-users.usecase';
import { CreateTaskUseCase } from '../../application/usecases/create-task.usecase';
import { CompleteTaskUseCase } from '../../application/usecases/complete-task.usecase';
import { CreateTaskDto } from '../../application/dtos/task.dto';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import { TaskDialogFormComponent } from '../components/task-dialog-form/task-dialog-form.component';

@Injectable({
  providedIn: 'root',
})
export class TasksStoreService {
  private destroy$ = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private viewContainerRef: ViewContainerRef | null = null;

  // State
  private readonly usersSignal = signal<User[]>([]);
  private readonly tasksSignal = signal<Task[]>([]);
  private readonly selectedUserIdSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  // Selectors
  readonly users = this.usersSignal.asReadonly();
  readonly tasks = this.tasksSignal.asReadonly();
  readonly selectedUserId = this.selectedUserIdSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly selectedUser = computed(() => {
    const userId = this.selectedUserIdSignal();
    if (!userId) return null;
    return this.usersSignal().find((user) => user.id === userId) || null;
  });

  constructor(
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly completeTaskUseCase: CompleteTaskUseCase
  ) {
    this.loadUsers();

    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }

  // Actions
  loadUsers(): void {
    this.loadingSignal.set(true);
    this.getUsersUseCase
      .execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.usersSignal.set(users);
          if (users.length > 0 && !this.selectedUserIdSignal()) {
            this.selectUser(users[0].id);
          }
          this.loadingSignal.set(false);
        },
        error: () => this.loadingSignal.set(false),
      });
  }

  loadTasks(userId: string): void {
    this.loadingSignal.set(true);
    this.getTasksUseCase
      .execute(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasksSignal.set(tasks);
          this.loadingSignal.set(false);
        },
        error: () => this.loadingSignal.set(false),
      });
  }

  selectUser(userId: string): void {
    this.selectedUserIdSignal.set(userId);
    this.loadTasks(userId);
  }

  createTask(taskDto: CreateTaskDto): void {
    this.loadingSignal.set(true);
    this.createTaskUseCase
      .execute(taskDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTask) => {
          this.tasksSignal.update((tasks) => [...tasks, newTask]);
          this.loadingSignal.set(false);
        },
        error: () => this.loadingSignal.set(false),
      });
  }

  completeTask(taskId: string): void {
    this.loadingSignal.set(true);
    this.completeTaskUseCase
      .execute(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          this.tasksSignal.update((tasks) =>
            tasks.map((task) => (task.id === taskId ? updatedTask : task))
          );
          this.loadingSignal.set(false);
        },
        error: () => this.loadingSignal.set(false),
      });
  }

  /**
   * Set the view container ref for the dialog service
   * @param vcr The ViewContainerRef to use
   */
  setViewContainerRef(vcr: ViewContainerRef): void {
    this.viewContainerRef = vcr;
  }

  /**
   * Show the add task dialog
   */
  showAddTaskForm(): void {
    if (!this.viewContainerRef) {
      console.error(
        'ViewContainerRef not set. Call setViewContainerRef first.'
      );
      return;
    }

    // Open the dialog with the task form component
    this.dialogService.open(
      TaskDialogFormComponent,
      {
        title: '',
        size: 'md',
        showFooter: false,
        hideDefaultButtons: true,
        closeOnEscape: true,
        closeOnBackdropClick: false,
      },
      this.viewContainerRef
    );
  }
}
