import { Component } from '@angular/core';
import { UserListComponent } from '../../../shared/components/user-list/user-list.component';
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';
import { TaskFormComponent } from '../../../shared/components/task-form/task-form.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [UserListComponent, TaskListComponent, TaskFormComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Sidebar with users -->
      <div class="md:col-span-1">
        <app-user-list
          [users]="[]"
          [selectedUserId]="null"
          (userSelected)="onUserSelected($event)"
        ></app-user-list>
      </div>

      <!-- Main content with tasks -->
      <div class="md:col-span-3">
        @if (showTaskForm) {
        <app-task-form
          [userId]="selectedUserId || ''"
          (save)="onSaveTask($event)"
          (cancel)="onCancelTaskForm()"
        ></app-task-form>
        } @else {
        <app-task-list
          [tasks]="[]"
          [userName]="selectedUserName"
          (addTask)="onAddTask()"
          (completeTask)="onCompleteTask($event)"
        ></app-task-list>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class TasksPageComponent {
  selectedUserId: string | null = null;
  selectedUserName = '';
  showTaskForm = false;

  onUserSelected(userId: string): void {
    // This would be implemented with actual logic
  }

  onAddTask(): void {
    this.showTaskForm = true;
  }

  onSaveTask(taskData: any): void {
    // This would be implemented with actual logic
    this.showTaskForm = false;
  }

  onCancelTaskForm(): void {
    this.showTaskForm = false;
  }

  onCompleteTask(taskId: string): void {
    // This would be implemented with actual logic
  }
}
