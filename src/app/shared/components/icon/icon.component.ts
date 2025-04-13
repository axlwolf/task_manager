import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  inject,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { AnimationService } from '../../services/animation.service';
import { PulseDirective } from '../../directives/pulse.directive';
import { BounceDirective } from '../../directives/bounce.directive';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, PulseDirective, BounceDirective],
  template: `
    <div
      class="icon-container"
      [class.animate]="animate"
      [class.interactive]="interactive"
      [style.width.px]="size"
      [style.height.px]="size"
      [ngClass]="themeClass"
      (click)="handleClick()"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
    >
      <!-- Usamos SVG simple en lugar de feather-icons -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        [attr.width]="size" 
        [attr.height]="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        [attr.stroke-width]="strokeWidth" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <ng-container [ngSwitch]="name">
          <!-- plus-circle -->
          <ng-container *ngSwitchCase="'plus-circle'">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </ng-container>
          
          <!-- check-circle -->
          <ng-container *ngSwitchCase="'check-circle'">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9 12l2 2 4-4"></path>
          </ng-container>
          
          <!-- calendar -->
          <ng-container *ngSwitchCase="'calendar'">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </ng-container>
          
          <!-- alert-circle -->
          <ng-container *ngSwitchCase="'alert-circle'">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </ng-container>
          
          <!-- Fallback para iconos no definidos -->
          <ng-container *ngSwitchDefault>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </ng-container>
        </ng-container>
      </svg>
    </div>
  `,
  styles: [
    `
      .icon-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .animate {
        transition: all 0.3s ease;
      }

      .interactive:hover {
        transform: scale(1.2);
        cursor: pointer;
      }

      .primary {
        color: var(--primary-color, #6366f1);
      }

      .secondary {
        color: var(--secondary-color, #9ca3af);
      }

      .success {
        color: var(--success-color, #10b981);
      }

      .warning {
        color: var(--warning-color, #f59e0b);
      }

      .danger {
        color: var(--danger-color, #ef4444);
      }

      .info {
        color: var(--info-color, #3b82f6);
      }

      .light {
        color: var(--light-color, #f3f4f6);
      }

      .dark {
        color: var(--dark-color, #1f2937);
      }
    `,
  ],
})
export class IconComponent implements OnChanges, AfterViewInit {
  @Input() name: string = '';
  @Input() size: number = 24;
  @Input() theme:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark' = 'primary';
  @Input() strokeWidth: 1 | 2 | 3 = 2;
  @Input() animate: boolean = false;
  @Input() interactive: boolean = false;
  @Input() effect: 'pulse' | 'bounce' | 'none' = 'pulse';
  @Input() effectDuration: number = 300;

  @Output() click = new EventEmitter<void>();
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  private readonly animationService = inject(AnimationService);
  private readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    console.log('Icon component initialized with name:', this.name);
    
    // Verificar si el icono se está renderizando correctamente
    const iconContainer = this.elementRef.nativeElement.querySelector('.icon-container');
    if (iconContainer) {
      console.log('Icon container found:', iconContainer);
      
      // Si estamos usando 'plus-circle', verificar si se encuentra el elemento svg
      if (this.name === 'plus-circle') {
        const svgIcon = this.elementRef.nativeElement.querySelector('svg');
        if (svgIcon) {
          console.log('Plus-circle icon found:', svgIcon);
        } else {
          console.warn('Plus-circle icon SVG not found');
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si algún input relevante cambia, podemos reaccionar aquí
    if (changes['name'] && !changes['name'].firstChange) {
      console.log('Icon name changed to:', this.name);
    }

    if (changes['size'] && !changes['size'].firstChange) {
      console.log('Icon size changed to:', this.size);
    }
  }

  get themeClass(): string {
    return this.theme;
  }

  handleClick(): void {
    this.click.emit();

    if (this.effect !== 'none' && this.interactive) {
      this.playEffect();
    }
  }

  handleMouseEnter(): void {
    this.mouseEnter.emit();

    if (this.effect !== 'none' && this.animate) {
      this.playEffect();
    }
  }

  handleMouseLeave(): void {
    this.mouseLeave.emit();
  }

  private playEffect(): void {
    const element =
      this.elementRef.nativeElement.querySelector('.icon-container');

    if (!element) {
      console.warn('Icon container not found for animation');
      return;
    }

    switch (this.effect) {
      case 'pulse':
        const pulseAnimation = this.animationService.createPulseAnimation(
          this.effectDuration,
          1.2
        );
        this.animationService.playAnimation(element, pulseAnimation);
        break;
      case 'bounce':
        const bounceAnimation = this.animationService.createBounceAnimation(
          this.effectDuration,
          5
        );
        this.animationService.playAnimation(element, bounceAnimation);
        break;
      // Podríamos añadir más casos de efectos aquí si es necesario
    }
  }
}
