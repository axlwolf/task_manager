import {
  Component,
  inject,
  ViewContainerRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
// Angular 18 no longer requires CommonModule for control flow directives
import { UserListComponent } from '../components/user-list/user-list.component';
import { TasksListComponent } from '../components/tasks-list/tasks-list.component';
import { TasksStoreService } from '../services/tasks-store.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [UserListComponent, TasksListComponent],
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

  ngAfterViewInit(): void {
    // Set the view container ref for the dialog service
    this.tasksStore.setViewContainerRef(this.dialogContainer);
  }
}
