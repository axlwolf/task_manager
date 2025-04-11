import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog
      #dialogElement
      [class]="'app-dialog ' + dialogClass"
      [attr.aria-labelledby]="titleId"
      [attr.aria-describedby]="descriptionId"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h2 [id]="titleId" class="dialog-title">{{ title }}</h2>
          <button
            type="button"
            class="dialog-close-button"
            aria-label="Close dialog"
            (click)="close()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div [id]="descriptionId" class="dialog-body">
          <ng-content></ng-content>
        </div>
        
        <div class="dialog-footer" *ngIf="showFooter">
          <ng-content select="[dialog-footer]"></ng-content>
          
          <div class="dialog-actions" *ngIf="!hideDefaultButtons">
            <button
              type="button"
              class="dialog-cancel-button"
              (click)="close()"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="dialog-confirm-button"
              (click)="confirm()"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  `,
  styles: [`
    .app-dialog {
      padding: 0;
      border: none;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      background-color: var(--color-card-bg);
      color: var(--color-text-primary);
      max-width: 90vw;
      width: 500px;
      max-height: 90vh;
      overflow: hidden;
    }
    
    .app-dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }
    
    .dialog-content {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--color-border-light);
    }
    
    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-accent);
    }
    
    .dialog-close-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-full);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color var(--transition-fast), color var(--transition-fast);
    }
    
    .dialog-close-button:hover {
      background-color: var(--color-neutral-200);
      color: var(--color-text-primary);
    }
    
    .dialog-body {
      padding: var(--space-6);
      overflow-y: auto;
      flex: 1;
    }
    
    .dialog-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--color-border-light);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
    }
    
    .dialog-actions {
      display: flex;
      gap: var(--space-3);
    }
    
    .dialog-cancel-button {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border-medium);
      background-color: transparent;
      color: var(--color-text-secondary);
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast), color var(--transition-fast);
    }
    
    .dialog-cancel-button:hover {
      background-color: var(--color-neutral-100);
      color: var(--color-text-primary);
    }
    
    .dialog-confirm-button {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      border: none;
      background-color: var(--color-primary-600);
      color: var(--color-text-on-primary);
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }
    
    .dialog-confirm-button:hover {
      background-color: var(--color-primary-700);
    }
    
    /* Animation classes */
    .dialog-enter {
      animation: dialogEnter var(--animation-duration-normal) var(--animation-timing-ease-out) forwards;
    }
    
    .dialog-exit {
      animation: dialogExit var(--animation-duration-fast) var(--animation-timing-ease-in) forwards;
    }
    
    @keyframes dialogEnter {
      0% {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes dialogExit {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      100% {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
      }
    }
    
    /* Size variants */
    .dialog-sm {
      width: 400px;
    }
    
    .dialog-md {
      width: 500px;
    }
    
    .dialog-lg {
      width: 700px;
    }
    
    .dialog-xl {
      width: 900px;
    }
    
    .dialog-fullscreen {
      width: 95vw;
      height: 95vh;
    }
  `]
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialogElement') dialogElement!: ElementRef<HTMLDialogElement>;
  
  @Input() title: string = 'Dialog';
  @Input() titleId: string = 'dialog-title';
  @Input() descriptionId: string = 'dialog-description';
  @Input() showFooter: boolean = true;
  @Input() hideDefaultButtons: boolean = false;
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() dialogClass: string = 'dialog-md';
  @Input() closeOnEscape: boolean = true;
  @Input() closeOnBackdropClick: boolean = true;
  
  @Output() dialogClose = new EventEmitter<void>();
  @Output() dialogConfirm = new EventEmitter<void>();
  
  private readonly animationService = inject(AnimationService);
  private dialogClosing = false;
  
  ngAfterViewInit(): void {
    // Add animation class when the dialog is shown
    this.dialogElement.nativeElement.addEventListener('show', () => {
      this.dialogElement.nativeElement.classList.add('dialog-enter');
    });
    
    // Handle backdrop click
    this.dialogElement.nativeElement.addEventListener('click', (event) => {
      if (this.closeOnBackdropClick && event.target === this.dialogElement.nativeElement) {
        this.close();
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up any event listeners if needed
    if (this.dialogElement?.nativeElement) {
      const dialog = this.dialogElement.nativeElement;
      dialog.removeEventListener('show', () => {});
      dialog.removeEventListener('click', () => {});
    }
  }
  
  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.closeOnEscape && this.isOpen()) {
      this.close();
    }
  }
  
  open(): void {
    if (!this.dialogElement) return;
    
    const dialog = this.dialogElement.nativeElement;
    
    // Reset animation classes
    dialog.classList.remove('dialog-exit');
    dialog.classList.add('dialog-enter');
    
    // Show the dialog
    if (!dialog.open) {
      dialog.showModal();
    }
  }
  
  close(): void {
    if (!this.dialogElement || this.dialogClosing) return;
    
    this.dialogClosing = true;
    const dialog = this.dialogElement.nativeElement;
    
    // Add exit animation
    dialog.classList.remove('dialog-enter');
    dialog.classList.add('dialog-exit');
    
    // Wait for animation to complete before closing
    setTimeout(() => {
      dialog.close();
      this.dialogClose.emit();
      this.dialogClosing = false;
    }, 150); // Match the animation duration
  }
  
  confirm(): void {
    this.dialogConfirm.emit();
    this.close();
  }
  
  isOpen(): boolean {
    return this.dialogElement?.nativeElement.open || false;
  }
}