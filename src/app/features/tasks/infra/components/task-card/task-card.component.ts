import { Component, Input, inject, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../../domain/models/task.model';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { PulseDirective } from '../../../../../shared/directives/pulse.directive';
import { HighlightDirective } from '../../../../../shared/directives/highlight.directive';
import { AnimationService } from '../../../../../shared/services/animation.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ButtonComponent,
    IconComponent,
    PulseDirective,
    HighlightDirective,
  ],
  template: `
    <div
      class="task-card mb-4"
      appHighlight
      [highlightOnHover]="true"
      [highlightColor]="'rgba(var(--primary-rgb), 0.1)'"
    >
      <div class="flex justify-between items-start mb-2">
        <h3 class="task-title" appPulse [pulseOnHover]="true">
          {{ task.title }}
        </h3>
        <span
          class="task-status-badge"
          [ngClass]="
            task.completed
              ? 'task-status-badge-completed'
              : 'task-status-badge-active'
          "
        >
          {{ task.completed ? 'Completed' : 'Active' }}
        </span>
      </div>

      <p class="task-date">
        <app-icon
          name="calendar"
          [size]="16"
          theme="secondary"
          [animate]="true"
          class="inline-block mr-1"
        >
        </app-icon>
        {{ task.dueDate | date : 'MMM d, yyyy' }}
      </p>

      <p class="task-description">
        {{ task.description }}
      </p>

      <div class="flex justify-end space-x-2">
        <app-icon
          name="edit"
          [size]="20"
          theme="secondary"
          [animate]="true"
          [interactive]="true"
          (click)="onEditTask()"
        ></app-icon>

        <app-icon
          name="trash"
          [size]="20"
          theme="danger"
          [animate]="true"
          [interactive]="true"
          (click)="onDeleteTask()"
        ></app-icon>

        <app-button
          variant="primary"
          [disabled]="task.completed"
          (buttonClick)="onCompleteTask()"
        >
          <app-icon
            name="check-circle"
            [size]="16"
            theme="light"
            class="inline-block mr-1"
          ></app-icon>
          {{ task.completed ? 'Completed' : 'Complete' }}
        </app-button>
      </div>
    </div>
  `,
  styles: [],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  private readonly tasksStore = inject(TasksStoreService);
  private readonly animationService = inject(AnimationService);
  private readonly elementRef = inject(ElementRef);

  onCompleteTask(): void {
    this.tasksStore.completeTask(this.task.id);

    // Add completion animation
    const taskCard = this.elementRef.nativeElement.querySelector('.task-card');
    const animation = this.animationService.createHighlightAnimation(
      1000,
      'rgba(var(--success-rgb), 0.2)'
    );
    this.animationService.playAnimation(taskCard, animation);
  }

  onEditTask(): void {
    // This will be implemented in a future update
    console.log('Edit task:', this.task.id);

    // Add edit animation
    const editIcon = this.elementRef.nativeElement.querySelector(
      'app-icon[name="edit"]'
    );
    const animation = this.animationService.createRotateAnimation(500, 180);
    this.animationService.playAnimation(editIcon, animation);
  }

  onDeleteTask(): void {
    // This will be implemented in a future update
    console.log('Delete task:', this.task.id);

    // Add delete animation
    const deleteIcon = this.elementRef.nativeElement.querySelector(
      'app-icon[name="trash"]'
    );
    const animation = this.animationService.createShakeAnimation(500, 5);
    this.animationService.playAnimation(deleteIcon, animation);
  }
}
