import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DialogService, DialogConfig } from './dialog.service';
import { Component, ViewContainerRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogRef } from './dialog-ref';

// Test component to use in dialog
@Component({
  template: '<div>Test Component</div>',
})
class TestComponent {
  dialogRef!: DialogRef;
}

describe('DialogService', () => {
  let service: DialogService;
  let viewContainerRef: jasmine.SpyObj<ViewContainerRef>;
  let dialogComponentRef: any;
  let dialogInstance: jasmine.SpyObj<DialogComponent>;

  beforeEach(() => {
    // Create spies
    dialogInstance = jasmine.createSpyObj('DialogComponent', ['open'], {
      dialogClose: jasmine.createSpyObj('EventEmitter', ['subscribe']),
      dialogConfirm: jasmine.createSpyObj('EventEmitter', ['subscribe']),
    });

    dialogComponentRef = {
      instance: dialogInstance,
      location: {
        nativeElement: {
          querySelector: jasmine
            .createSpy('querySelector')
            .and.returnValue(document.createElement('div')),
        },
      },
      destroy: jasmine.createSpy('destroy'),
    };

    viewContainerRef = jasmine.createSpyObj('ViewContainerRef', [
      'createComponent',
    ]);
    viewContainerRef.createComponent.and.returnValue(dialogComponentRef);

    TestBed.configureTestingModule({
      providers: [DialogService],
    });

    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a dialog with default config', fakeAsync(() => {
    // Act
    const dialogRef = service.open(TestComponent, {}, viewContainerRef);
    tick();

    // Assert
    expect(viewContainerRef.createComponent).toHaveBeenCalled();
    expect(viewContainerRef.createComponent.calls.mostRecent().args[0]).toBe(
      DialogComponent
    );
    expect(
      dialogComponentRef.location.nativeElement.querySelector
    ).toHaveBeenCalledWith('.dialog-body');
    expect(dialogInstance.open).toHaveBeenCalled();
    expect(dialogRef).toBeTruthy();
  }));

  it('should configure dialog with provided options', fakeAsync(() => {
    // Arrange
    const config: DialogConfig = {
      title: 'Test Dialog',
      size: 'lg',
      showFooter: true,
      hideDefaultButtons: false,
      confirmText: 'OK',
      cancelText: 'Cancel',
      closeOnEscape: true,
      closeOnBackdropClick: true,
    };

    // Act
    service.open(TestComponent, config, viewContainerRef);
    tick();

    // Assert - Check that properties were set on the dialog instance
    expect(dialogInstance.title).toBe('Test Dialog');
    expect(dialogInstance.dialogClass).toBe('dialog-lg');
    expect(dialogInstance.showFooter).toBe(true);
    expect(dialogInstance.hideDefaultButtons).toBe(false);
    expect(dialogInstance.confirmText).toBe('OK');
    expect(dialogInstance.cancelText).toBe('Cancel');
    expect(dialogInstance.closeOnEscape).toBe(true);
    expect(dialogInstance.closeOnBackdropClick).toBe(true);
  }));

  it('should handle dialog close event', fakeAsync(() => {
    // Arrange
    const dialogRef = service.open(TestComponent, {}, viewContainerRef);
    const closeCallback = (
      dialogInstance.dialogClose.subscribe as jasmine.Spy
    ).calls.mostRecent().args[0];

    // Act
    closeCallback();
    tick();

    // Assert
    expect(dialogComponentRef.destroy).toHaveBeenCalled();
  }));

  it('should handle dialog confirm event', fakeAsync(() => {
    // Arrange
    const dialogRef = service.open(TestComponent, {}, viewContainerRef);
    const confirmCallback = (
      dialogInstance.dialogConfirm.subscribe as jasmine.Spy
    ).calls.mostRecent().args[0];

    // Act
    confirmCallback();
    tick();

    // Assert
    expect(dialogComponentRef.destroy).toHaveBeenCalled();
  }));

  it('should clean up when dialog is closed', fakeAsync(() => {
    // Arrange
    const dialogRef = service.open(TestComponent, {}, viewContainerRef);

    // Act
    dialogRef.close();
    tick();

    // Assert
    expect(dialogComponentRef.destroy).toHaveBeenCalled();
  }));
});
