import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, ButtonComponent],
  template: `
    <div class="bg-purple-800 rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">{{ userName }}'s Tasks</h2>
        <app-button variant="secondary" (buttonClick)="onAddTask()">Add Task</app-button>
      </div>
      
      @if (tasks.length === 0) {
        <div class="bg-purple-700 rounded-lg p-8 text-center">
          <p class="text-white">No tasks available. Add a new task to get started!</p>
        </div>
      } @else {
        @for (task of tasks; track task.id) {
          <app-task-card 
            [task]="task" 
            (completeTask)="onCompleteTask($event)"
          ></app-task-card>
        }
      }
    </div>
  `,
  styles: []
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() userName = '';
  
  @Output() addTask = new EventEmitter<void>();
  @Output() completeTask = new EventEmitter<string>();

  onAddTask(): void {
    this.addTask.emit();
  }

  onCompleteTask(taskId: string): void {
    this.completeTask.emit(taskId);
  }
}