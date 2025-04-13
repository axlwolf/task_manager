import { Injectable, Type, ViewContainerRef, createComponent, inject, EnvironmentInjector } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogRef } from './dialog-ref';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  /**
   * Opens a dialog with the specified component as content.
   * @param component The component to render inside the dialog.
   * @param config Configuration options for the dialog.
   * @param viewContainerRef The view container ref to create the dialog in.
   * @returns A reference to the dialog.
   */
  open<T>(component: Type<T>, config: DialogConfig = {}, viewContainerRef: ViewContainerRef): DialogRef {
    // Create a new DialogRef for this dialog instance
    const dialogRef = new DialogRef();
    
    // Create the dialog component
    const dialogComponentRef = viewContainerRef.createComponent(DialogComponent, {
      projectableNodes: [],
    });
    
    // Set dialog properties from config
    const dialogInstance = dialogComponentRef.instance;
    if (config.title) dialogInstance.title = config.title;
    if (config.size) dialogInstance.dialogClass = `dialog-${config.size}`;
    if (config.showFooter !== undefined) dialogInstance.showFooter = config.showFooter;
    if (config.hideDefaultButtons !== undefined) dialogInstance.hideDefaultButtons = config.hideDefaultButtons;
    if (config.confirmText) dialogInstance.confirmText = config.confirmText;
    if (config.cancelText) dialogInstance.cancelText = config.cancelText;
    if (config.closeOnEscape !== undefined) dialogInstance.closeOnEscape = config.closeOnEscape;
    if (config.closeOnBackdropClick !== undefined) dialogInstance.closeOnBackdropClick = config.closeOnBackdropClick;
    
    // Obtener el EnvironmentInjector
    const environmentInjector = inject(EnvironmentInjector);
    
    // Create the content component inside the dialog
    const contentComponentRef = createComponent(component, {
      environmentInjector: environmentInjector,
      hostElement: dialogComponentRef.location.nativeElement.querySelector('.dialog-body'),
    });
    
    // Provide the DialogRef to the content component
    (contentComponentRef.instance as any).dialogRef = dialogRef;
    
    // Handle dialog events
    dialogInstance.dialogClose.subscribe(() => {
      dialogRef.close();
      dialogComponentRef.destroy();
    });
    
    dialogInstance.dialogConfirm.subscribe(() => {
      dialogRef.close(true);
      dialogComponentRef.destroy();
    });
    
    // Subscribe to the afterClosed observable to clean up when the dialog is closed
    dialogRef.afterClosed$.subscribe(() => {
      dialogComponentRef.destroy();
    });
    
    // Open the dialog
    dialogInstance.open();
    
    return dialogRef;
  }
}

/**
 * Configuration options for the dialog.
 */
export interface DialogConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showFooter?: boolean;
  hideDefaultButtons?: boolean;
  confirmText?: string;
  cancelText?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
}
