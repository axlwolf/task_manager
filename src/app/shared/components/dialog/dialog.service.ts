import {
  Injectable,
  Type,
  ViewContainerRef,
  createComponent,
  Injector,
} from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogRef } from './dialog-ref';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private injector: Injector) {}

  open<T>(
    component: Type<T>,
    config: DialogConfig = {},
    viewContainerRef: ViewContainerRef
  ): DialogRef {
    // Create a new DialogRef
    const dialogRef = new DialogRef();

    // Create the dialog component
    const dialogComponentRef =
      viewContainerRef.createComponent(DialogComponent);
    const dialogInstance = dialogComponentRef.instance;

    // Configure the dialog
    if (config.title) dialogInstance.title = config.title;
    if (config.size) dialogInstance.dialogClass = `dialog-${config.size}`;
    if (config.showFooter !== undefined)
      dialogInstance.showFooter = config.showFooter;
    if (config.hideDefaultButtons !== undefined)
      dialogInstance.hideDefaultButtons = config.hideDefaultButtons;
    if (config.confirmText) dialogInstance.confirmText = config.confirmText;
    if (config.cancelText) dialogInstance.cancelText = config.cancelText;
    if (config.closeOnEscape !== undefined)
      dialogInstance.closeOnEscape = config.closeOnEscape;
    if (config.closeOnBackdropClick !== undefined)
      dialogInstance.closeOnBackdropClick = config.closeOnBackdropClick;

    // Get the dialog body element
    const dialogBody =
      dialogComponentRef.location.nativeElement.querySelector('.dialog-body');

    // Create the content component if the dialog body is available
    if (dialogBody) {
      // Workaround for type compatibility
      const anyInjector = this.injector as any;

      const contentComponentRef = createComponent(component, {
        environmentInjector: anyInjector,
        hostElement: dialogBody,
      });

      // Provide the DialogRef to the content component
      (contentComponentRef.instance as any).dialogRef = dialogRef;
    }

    // Handle dialog events
    dialogInstance.dialogClose.subscribe(() => {
      dialogRef.close();
      dialogComponentRef.destroy();
    });

    dialogInstance.dialogConfirm.subscribe(() => {
      dialogRef.close(true);
      dialogComponentRef.destroy();
    });

    // Clean up when the dialog is closed
    dialogRef.afterClosed$.subscribe(() => {
      dialogComponentRef.destroy();
    });

    // Open the dialog after a small delay to ensure DOM is updated
    setTimeout(() => {
      dialogInstance.open();
    }, 0);

    return dialogRef;
  }
}

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
