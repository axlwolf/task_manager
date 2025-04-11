import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-purple-900 rounded-lg p-2 space-y-2">
      @for (user of users; track user.id) {
        <div 
          class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
          [class.bg-purple-700]="selectedUserId === user.id"
          [class.bg-purple-800]="selectedUserId !== user.id"
          [class.hover:bg-purple-700]="selectedUserId !== user.id"
          (click)="onSelectUser(user.id)"
        >
          <div class="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center overflow-hidden">
            @if (user.avatar) {
              <img [src]="user.avatar" [alt]="user.name" class="w-full h-full object-cover">
            } @else {
              <span class="text-purple-800 font-bold text-lg">{{ user.name.charAt(0) }}</span>
            }
          </div>
          <span class="text-white">{{ user.name }}</span>
        </div>
      }
    </div>
  `,
  styles: []
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Input() selectedUserId: string | null = null;
  @Output() userSelected = new EventEmitter<string>();

  onSelectUser(userId: string): void {
    this.userSelected.emit(userId);
  }
}