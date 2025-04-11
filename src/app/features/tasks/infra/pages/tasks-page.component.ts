import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../components/user-list/user-list.component';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import { AddTaskButtonComponent } from '../components/add-task-button/add-task-button.component';
import { TasksStoreService } from '../services/tasks-store.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    TaskCardComponent,
    TaskFormComponent,
    AddTaskButtonComponent,
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
        <div class="tasks-header-container">
          <div class="flex justify-between items-center mb-6">
            <h2 class="tasks-header-title">
              {{ tasksStore.selectedUser()?.name || 'Select a user' }}'s Tasks
            </h2>
            <app-add-task-button></app-add-task-button>
          </div>

          @if (tasksStore.tasks().length === 0) {
          <div class="tasks-empty-container">
            <p class="tasks-empty-text">
              No tasks available. Add a new task to get started!
            </p>
          </div>
          } @else { @for (task of tasksStore.tasks(); track task.id) {
          <app-task-card [task]="task"></app-task-card>
          } }
        </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class TasksPageComponent {
  protected readonly tasksStore = inject(TasksStoreService);
}
