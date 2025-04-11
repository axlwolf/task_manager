import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../components/user-list/user-list.component';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import { TasksListComponent } from '../components/tasks-list/tasks-list.component';
import { TasksStoreService } from '../services/tasks-store.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    TaskFormComponent,
    TasksListComponent,
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Sidebar with users -->
      <div class="md:col-span-1">
        <app-user-list></app-user-list>
      </div>

      <!-- Main content with tasks -->
      <div class="md:col-span-3">
        @if (tasksStore.showTaskForm()) {
        <app-task-form></app-task-form>
        } @else {
        <app-tasks-list></app-tasks-list>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class TasksPageComponent {
  protected readonly tasksStore = inject(TasksStoreService);
}
