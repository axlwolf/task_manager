import { Component, inject, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { BounceDirective } from '../../../../../shared/directives/bounce.directive';
import { AnimationService } from '../../../../../shared/services/animation.service';

@Component({
  selector: 'app-add-task-button',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, BounceDirective],
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
  styles: [`
    :host {
      display: inline-block;
    }
    
    .inline-block {
      display: inline-block;
    }
    
    .mr-1 {
      margin-right: 0.25rem;
    }
  `],
})
export class AddTaskButtonComponent implements AfterViewInit {
  private readonly tasksStore = inject(TasksStoreService);
  private readonly animationService = inject(AnimationService);
  private readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    // Verificar si los elementos existen después de que la vista se inicializa
    setTimeout(() => {
      const iconElement = this.elementRef.nativeElement.querySelector('app-icon');
      if (iconElement) {
        console.log('Icon element found:', iconElement);
      } else {
        console.warn('Icon element not found');
      }
    }, 0);
  }

  onAddTask(): void {
    // Show the task dialog form
    this.tasksStore.showAddTaskForm();

    // Añadir un pequeño retraso para asegurar que los elementos del DOM estén disponibles
    setTimeout(() => {
      // Add animation to the icon
      const icon = this.elementRef.nativeElement.querySelector('app-icon');
      if (icon) {
        const animation = this.animationService.createRotateAnimation(500, 180);
        this.animationService.playAnimation(icon, animation);
      } else {
        console.warn('Icon element not found when trying to animate');
      }

      // Add animation to the button
      const button = this.elementRef.nativeElement.querySelector('app-button');
      if (button) {
        const pulseAnimation = this.animationService.createPulseAnimation(500, 1.1);
        this.animationService.playAnimation(button, pulseAnimation);
      } else {
        console.warn('Button element not found when trying to animate');
      }
    }, 10);
  }
}
