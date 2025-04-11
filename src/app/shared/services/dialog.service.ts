import { Injectable, ComponentRef, ViewContainerRef, Type, createComponent } from '@angular/core';
import { DialogComponent } from '../components/dialog/dialog.component';

export interface DialogOptions {
  title?: string;
  showFooter?: boolean;
  hideDefaultButtons?: boolean;
  confirmText?: string;
  cancelText?: string;
  dialogClass?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
}

export interface DialogRef<T = any> {
  componentRef: ComponentRef<DialogComponent>;
  contentRef: ComponentRef<T>;
  close: () => void;
  afterClosed: Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private viewContainerRef: ViewContainerRef | null = null;
  
  /**
   * Set the view container ref to use for creating dialogs
   * @param vcr The ViewContainerRef to use
   */
  setViewContainerRef(vcr: ViewContainerRef): void {
    this.viewContainerRef = vcr;
  }
  
  /**
   * Open a dialog with the given component
   * @param component The component to render inside the dialog
   * @param options Dialog options
   * @param componentInputs Inputs to pass to the component
   * @returns A DialogRef object
   */
  open<T>(
    component: Type<T>,
    options: DialogOptions = {},
    componentInputs: Partial<T> = {}
  ): DialogRef<T> {
    if (!this.viewContainerRef) {
      throw new Error('ViewContainerRef not set. Call setViewContainerRef first.');
    }
    
    // Create the dialog component
    const dialogComponentRef = this.viewContainerRef.createComponent(DialogComponent);
    const dialogInstance = dialogComponentRef.instance;
    
    // Set dialog options
    dialogInstance.title = options.title || 'Dialog';
    dialogInstance.showFooter = options.showFooter !== undefined ? options.showFooter : true;
    dialogInstance.hideDefaultButtons = options.hideDefaultButtons || false;
    dialogInstance.confirmText = options.confirmText || 'Confirm';
    dialogInstance.cancelText = options.cancelText || 'Cancel';
    dialogInstance.dialogClass = options.dialogClass || 'dialog-md';
    dialogInstance.closeOnEscape = options.closeOnEscape !== undefined ? options.closeOnEscape : true;
    dialogInstance.closeOnBackdropClick = options.closeOnBackdropClick !== undefined ? options.closeOnBackdropClick : true;
    
    // Create the content component
    const contentComponentRef = createComponent(component, {
      environmentInjector: this.viewContainerRef.injector
    });
    
    // Set inputs on the content component
    Object.keys(componentInputs).forEach(inputName => {
      (contentComponentRef.instance as any)[inputName] = (componentInputs as any)[inputName];
    });
    
    // Add the content component to the dialog
    const dialogBodyElement = dialogComponentRef.location.nativeElement.querySelector('.dialog-body');
    if (dialogBodyElement) {
      dialogBodyElement.appendChild(contentComponentRef.location.nativeElement);
    }
    
    // Create a promise that resolves when the dialog is closed
    let resolveClosedPromise: () => void;
    const afterClosed = new Promise<void>(resolve => {
      resolveClosedPromise = resolve;
    });
    
    // Handle dialog close
    dialogInstance.dialogClose.subscribe(() => {
      this.destroyDialog(dialogComponentRef, contentComponentRef);
      resolveClosedPromise();
    });
    
    // Handle dialog confirm
    dialogInstance.dialogConfirm.subscribe(() => {
      this.destroyDialog(dialogComponentRef, contentComponentRef);
      resolveClosedPromise();
    });
    
    // Open the dialog
    setTimeout(() => {
      dialogInstance.open();
    });
    
    // Return the dialog reference
    return {
      componentRef: dialogComponentRef,
      contentRef: contentComponentRef,
      close: () => dialogInstance.close(),
      afterClosed
    };
  }
  
  /**
   * Clean up the dialog and content components
   */
  private destroyDialog<T>(
    dialogComponentRef: ComponentRef<DialogComponent>,
    contentComponentRef: ComponentRef<T>
  ): void {
    contentComponentRef.destroy();
    dialogComponentRef.destroy();
  }
}