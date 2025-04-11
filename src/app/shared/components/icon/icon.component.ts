import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../modules/icons.module';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, IconsModule],
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
      (mouseleave)="handleMouseLeave()">
      
      <ng-container [ngSwitch]="name">
        <!-- Task related icons -->
        <i-feather 
          *ngSwitchCase="'check-circle'" 
          name="check-circle" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'plus-circle'" 
          name="plus-circle" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'edit'" 
          name="edit" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'trash'" 
          name="trash-2" 
          [class]="iconClass">
        </i-feather>
        
        <!-- User related icons -->
        <i-feather 
          *ngSwitchCase="'user'" 
          name="user" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'users'" 
          name="users" 
          [class]="iconClass">
        </i-feather>
        
        <!-- UI related icons -->
        <i-feather 
          *ngSwitchCase="'search'" 
          name="search" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'filter'" 
          name="filter" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'settings'" 
          name="settings" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'menu'" 
          name="menu" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'x'" 
          name="x" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'check'" 
          name="check" 
          [class]="iconClass">
        </i-feather>
        
        <!-- Navigation icons -->
        <i-feather 
          *ngSwitchCase="'chevron-down'" 
          name="chevron-down" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'chevron-up'" 
          name="chevron-up" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'chevron-left'" 
          name="chevron-left" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'chevron-right'" 
          name="chevron-right" 
          [class]="iconClass">
        </i-feather>
        
        <!-- Theme icons -->
        <i-feather 
          *ngSwitchCase="'sun'" 
          name="sun" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'moon'" 
          name="moon" 
          [class]="iconClass">
        </i-feather>
        
        <!-- Date and time icons -->
        <i-feather 
          *ngSwitchCase="'calendar'" 
          name="calendar" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'clock'" 
          name="clock" 
          [class]="iconClass">
        </i-feather>
        
        <!-- Notification icons -->
        <i-feather 
          *ngSwitchCase="'alert-circle'" 
          name="alert-circle" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'info'" 
          name="info" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'alert-triangle'" 
          name="alert-triangle" 
          [class]="iconClass">
        </i-feather>
        
        <!-- View icons -->
        <i-feather 
          *ngSwitchCase="'list'" 
          name="list" 
          [class]="iconClass">
        </i-feather>
        
        <i-feather 
          *ngSwitchCase="'grid'" 
          name="grid" 
          [class]="iconClass">
        </i-feather>
        
        <!-- Default icon -->
        <i-feather 
          *ngSwitchDefault 
          name="help-circle" 
          [class]="iconClass">
        </i-feather>
      </ng-container>
    </div>
  `,
  styles: [`
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
      color: var(--primary-color);
    }
    
    .secondary {
      color: var(--secondary-color);
    }
    
    .success {
      color: var(--success-color);
    }
    
    .warning {
      color: var(--warning-color);
    }
    
    .danger {
      color: var(--danger-color);
    }
    
    .info {
      color: var(--info-color);
    }
    
    .light {
      color: var(--light-color);
    }
    
    .dark {
      color: var(--dark-color);
    }
    
    .stroke-1 ::ng-deep svg {
      stroke-width: 1;
    }
    
    .stroke-2 ::ng-deep svg {
      stroke-width: 2;
    }
    
    .stroke-3 ::ng-deep svg {
      stroke-width: 3;
    }
  `]
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: number = 24;
  @Input() theme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' = 'primary';
  @Input() strokeWidth: 1 | 2 | 3 = 2;
  @Input() animate: boolean = false;
  @Input() interactive: boolean = false;
  
  @Output() click = new EventEmitter<void>();
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();
  
  get themeClass(): string {
    return this.theme;
  }
  
  get iconClass(): string {
    return `stroke-${this.strokeWidth}`;
  }
  
  handleClick(): void {
    this.click.emit();
  }
  
  handleMouseEnter(): void {
    this.mouseEnter.emit();
  }
  
  handleMouseLeave(): void {
    this.mouseLeave.emit();
  }
}