import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksStoreService } from '../../services/tasks-store.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      style="background-color: var(--color-sidebar-bg); border-radius: var(--radius-lg); padding: var(--space-2); gap: var(--space-2); display: flex; flex-direction: column;"
    >
      @for (user of tasksStore.users(); track user.id) {
      <div
        class="user-item"
        [ngStyle]="{
          'background-color':
            tasksStore.selectedUserId() === user.id
              ? 'var(--color-sidebar-item-active)'
              : hoverUserId === user.id
              ? 'var(--color-sidebar-item-hover)'
              : 'var(--color-sidebar-bg)',
          transition: 'background-color var(--transition-fast)'
        }"
        (mouseenter)="hoverUserId = user.id"
        (mouseleave)="hoverUserId = null"
        (click)="onSelectUser(user.id)"
      >
        <div class="avatar">
          @if (user.avatar) {
          <img
            [src]="user.avatar"
            [alt]="user.name"
            class="w-full h-full object-cover"
          />
          } @else {
          <span
            style="color: var(--color-primary-800); font-weight: bold; font-size: 1.125rem;"
            >{{ user.name.charAt(0) }}</span
          >
          }
        </div>
        <span style="color: var(--color-sidebar-text);">{{ user.name }}</span>
      </div>
      }
    </div>
  `,
  styles: [],
})
export class UserListComponent {
  protected readonly tasksStore = inject(TasksStoreService);
  protected hoverUserId: string | null = null;

  onSelectUser(userId: string): void {
    this.tasksStore.selectUser(userId);
  }
}
