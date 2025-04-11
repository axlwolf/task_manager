import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-add-task-button',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  template: `
    <app-button variant="secondary" (buttonClick)="onAddTask()">
      <app-icon
        name="plus-circle"
        [size]="16"
        theme="light"
        [animate]="true"
        class="inline-block mr-1"
      ></app-icon>
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
