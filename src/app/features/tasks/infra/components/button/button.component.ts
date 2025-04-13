import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      class="app-button"
      [ngClass]="[
        'app-button-' + variant,
        sizeClasses,
        fullWidth ? 'w-full' : ''
      ]"
      (click)="onClick($event)"
    >
      @if (loading) {
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .app-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
      overflow: hidden;
    }
    
    .app-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.5);
    }
    
    .app-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .app-button-primary {
      background-color: var(--color-primary, #6366f1);
      color: white;
    }
    
    .app-button-primary:hover:not(:disabled) {
      background-color: var(--color-primary-dark, #4f46e5);
    }
    
    .app-button-secondary {
      background-color: var(--color-secondary, #9ca3af);
      color: white;
    }
    
    .app-button-secondary:hover:not(:disabled) {
      background-color: var(--color-secondary-dark, #6b7280);
    }
    
    .app-button-danger {
      background-color: var(--color-danger, #ef4444);
      color: white;
    }
    
    .app-button-danger:hover:not(:disabled) {
      background-color: var(--color-danger-dark, #dc2626);
    }
    
    .app-button-success {
      background-color: var(--color-success, #10b981);
      color: white;
    }
    
    .app-button-success:hover:not(:disabled) {
      background-color: var(--color-success-dark, #059669);
    }
    
    /* Size variations */
    .px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    
    .py-1 {
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
    }
    
    .text-sm {
      font-size: 0.875rem;
    }
    
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    
    .text-base {
      font-size: 1rem;
    }
    
    .px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    
    .text-lg {
      font-size: 1.125rem;
    }
    
    .w-full {
      width: 100%;
    }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  get variantClasses(): string {
    // Using CSS variables for theming
    const classes = {
      primary: 'text-white focus:ring-opacity-50',
      secondary: 'focus:ring-opacity-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success:
        'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    };

    return classes[this.variant];
  }

  get sizeClasses(): string {
    const classes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return classes[this.size];
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
