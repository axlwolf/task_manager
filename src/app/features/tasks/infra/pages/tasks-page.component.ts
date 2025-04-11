import {
  Component,
  inject,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../components/user-list/user-list.component';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import { TasksListComponent } from '../components/tasks-list/tasks-list.component';
import { TasksStoreService } from '../services/tasks-store.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { TaskDialogFormComponent } from '../components/task-dialog-form/task-dialog-form.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, UserListComponent, TasksListComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Sidebar with users -->
      <div class="md:col-span-1">
        <app-user-list></app-user-list>
      </div>

      <!-- Main content with tasks -->
      <div class="md:col-span-3">
        <app-tasks-list></app-tasks-list>
      </div>
    </div>

    <!-- Container for dialogs -->
    <div #dialogContainer></div>
  `,
  styles: [],
})
export class TasksPageComponent implements AfterViewInit {
  @ViewChild('dialogContainer', { read: ViewContainerRef })
  private dialogContainer!: ViewContainerRef;

  protected readonly tasksStore = inject(TasksStoreService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    // Set the view container ref for the dialog service
    this.tasksStore.setViewContainerRef(this.viewContainerRef);
  }
}
