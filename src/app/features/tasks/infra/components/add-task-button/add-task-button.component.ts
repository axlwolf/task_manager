import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';

@Component({
  selector: 'app-add-task-button',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button variant="secondary" (buttonClick)="onAddTask()">
      Add Task
    </app-button>
  `,
  styles: [],
})
export class AddTaskButtonComponent {
  private readonly tasksStore = inject(TasksStoreService);

  onAddTask(): void {
    this.tasksStore.showAddTaskForm();
  }
}
