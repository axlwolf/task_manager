import { Component, inject, ElementRef } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { BounceDirective } from '../../../../../shared/directives/bounce.directive';
import { AnimationService } from '../../../../../shared/services/animation.service';

@Component({
  selector: 'app-add-task-button',
  standalone: true,
  imports: [ButtonComponent, IconComponent, BounceDirective],
  template: `
    <app-button
      variant="secondary"
      (buttonClick)="onAddTask()"
      appBounce
      [bounceOnClick]="true"
    >
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
  private readonly animationService = inject(AnimationService);
  private readonly elementRef = inject(ElementRef);

  onAddTask(): void {
    this.tasksStore.showAddTaskForm();

    // Add animation to the icon
    const icon = this.elementRef.nativeElement.querySelector('app-icon');
    const animation = this.animationService.createRotateAnimation(500, 180);
    this.animationService.playAnimation(icon, animation);
  }
}
