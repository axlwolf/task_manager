import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, DatePipe, ButtonComponent],
  template: `
    <div class="bg-purple-300 rounded-lg p-6 mb-4">
      <h3 class="text-2xl font-bold text-purple-900 mb-1">{{ task.title }}</h3>
      <p class="text-sm text-purple-900 mb-4">{{ task.dueDate | date:'MMM d, yyyy' }}</p>
      
      <p class="text-purple-900 mb-6">{{ task.description }}</p>
      
      <div class="flex justify-end">
        <app-button 
          variant="primary" 
          [disabled]="task.completed"
          (buttonClick)="onCompleteTask()"
        >
          Complete
        </app-button>
      </div>
    </div>
  `,
  styles: []
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() completeTask = new EventEmitter<string>();

  onCompleteTask(): void {
    this.completeTask.emit(this.task.id);
  }
}