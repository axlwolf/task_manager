import {
  Injectable,
  DestroyRef,
  computed,
  inject,
  signal,
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

@Injectable({
  providedIn: 'root',
})
export class TasksStoreService {
  private destroy$ = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);

  // State
  private readonly usersSignal = signal<User[]>([]);
  private readonly tasksSignal = signal<Task[]>([]);
  private readonly selectedUserIdSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly showTaskFormSignal = signal<boolean>(false);

  // Selectors
  readonly users = this.usersSignal.asReadonly();
  readonly tasks = this.tasksSignal.asReadonly();
  readonly selectedUserId = this.selectedUserIdSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly showTaskForm = this.showTaskFormSignal.asReadonly();

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
          this.showTaskFormSignal.set(false);
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

  showAddTaskForm(): void {
    this.showTaskFormSignal.set(true);
  }

  hideTaskForm(): void {
    this.showTaskFormSignal.set(false);
  }
}
