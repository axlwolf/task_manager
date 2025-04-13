import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';
import { AnimationService } from '../../services/animation.service';
import { AnimationFactory, AnimationPlayer } from '@angular/animations';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let animationService: jasmine.SpyObj<AnimationService>;
  let animationFactory: jasmine.SpyObj<AnimationFactory>;
  let animationPlayer: jasmine.SpyObj<AnimationPlayer>;

  beforeEach(async () => {
    // Create spies
    animationPlayer = jasmine.createSpyObj('AnimationPlayer', ['play']);
    animationFactory = jasmine.createSpyObj('AnimationFactory', ['create']);
    animationFactory.create.and.returnValue(animationPlayer);
    
    animationService = jasmine.createSpyObj('AnimationService', [
      'createFadeInAnimation',
      'createFadeOutAnimation',
      'createSlideAnimation',
      'playAnimation'
    ]);
    animationService.createFadeInAnimation.and.returnValue(animationFactory);
    animationService.createFadeOutAnimation.and.returnValue(animationFactory);
    animationService.createSlideAnimation.and.returnValue(animationFactory);

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        { provide: AnimationService, useValue: animationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    
    // Set default properties
    component.title = 'Test Dialog';
    component.showFooter = true;
    component.confirmText = 'Confirm';
    component.cancelText = 'Cancel';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show dialog by default', () => {
    const dialogElement = fixture.debugElement.query(By.css('.dialog-container'));
    expect(dialogElement.nativeElement.classList).not.toContain('dialog-visible');
  });

  it('should show dialog when open() is called', fakeAsync(() => {
    // Act
    component.open();
    tick();
    fixture.detectChanges();
    
    // Assert
    const dialogElement = fixture.debugElement.query(By.css('.dialog-container'));
    expect(dialogElement.nativeElement.classList).toContain('dialog-visible');
    expect(animationService.createFadeInAnimation).toHaveBeenCalled();
    expect(animationService.createSlideAnimation).toHaveBeenCalled();
    expect(animationService.playAnimation).toHaveBeenCalledTimes(2);
  }));

  it('should hide dialog when close() is called', fakeAsync(() => {
    // Arrange
    component.open();
    tick();
    fixture.detectChanges();
    
    // Act
    component.close();
    tick(300); // Animation duration
    fixture.detectChanges();
    
    // Assert
    const dialogElement = fixture.debugElement.query(By.css('.dialog-container'));
    expect(dialogElement.nativeElement.classList).not.toContain('dialog-visible');
    expect(animationService.createFadeOutAnimation).toHaveBeenCalled();
  }));

  it('should display the title', () => {
    // Arrange
    component.open();
    fixture.detectChanges();
    
    // Assert
    const titleElement = fixture.debugElement.query(By.css('.dialog-title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Dialog');
  });

  it('should show footer when showFooter is true', () => {
    // Arrange
    component.showFooter = true;
    component.open();
    fixture.detectChanges();
    
    // Assert
    const footerElement = fixture.debugElement.query(By.css('.dialog-footer'));
    expect(footerElement).toBeTruthy();
  });

  it('should hide footer when showFooter is false', () => {
    // Arrange
    component.showFooter = false;
    component.open();
    fixture.detectChanges();
    
    // Assert
    const footerElement = fixture.debugElement.query(By.css('.dialog-footer'));
    expect(footerElement).toBeFalsy();
  });

  it('should show default buttons when hideDefaultButtons is false', () => {
    // Arrange
    component.hideDefaultButtons = false;
    component.open();
    fixture.detectChanges();
    
    // Assert
    const buttons = fixture.debugElement.queryAll(By.css('.dialog-footer button'));
    expect(buttons.length).toBe(2);
  });

  it('should hide default buttons when hideDefaultButtons is true', () => {
    // Arrange
    component.hideDefaultButtons = true;
    component.open();
    fixture.detectChanges();
    
    // Assert
    const buttons = fixture.debugElement.queryAll(By.css('.dialog-footer button'));
    expect(buttons.length).toBe(0);
  });

  it('should use custom button text when provided', () => {
    // Arrange
    component.confirmText = 'Custom Confirm';
    component.cancelText = 'Custom Cancel';
    component.open();
    fixture.detectChanges();
    
    // Assert
    const buttons = fixture.debugElement.queryAll(By.css('.dialog-footer button'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Custom Cancel');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('Custom Confirm');
  });

  it('should emit dialogClose event when cancel button is clicked', () => {
    // Arrange
    spyOn(component.dialogClose, 'emit');
    component.open();
    fixture.detectChanges();
    
    // Act
    const cancelButton = fixture.debugElement.queryAll(By.css('.dialog-footer button'))[0];
    cancelButton.nativeElement.click();
    
    // Assert
    expect(component.dialogClose.emit).toHaveBeenCalled();
  });

  it('should emit dialogConfirm event when confirm button is clicked', () => {
    // Arrange
    spyOn(component.dialogConfirm, 'emit');
    component.open();
    fixture.detectChanges();
    
    // Act
    const confirmButton = fixture.debugElement.queryAll(By.css('.dialog-footer button'))[1];
    confirmButton.nativeElement.click();
    
    // Assert
    expect(component.dialogConfirm.emit).toHaveBeenCalled();
  });

  it('should close dialog when backdrop is clicked and closeOnBackdropClick is true', () => {
    // Arrange
    component.closeOnBackdropClick = true;
    spyOn(component.dialogClose, 'emit');
    component.open();
    fixture.detectChanges();
    
    // Act
    const backdrop = fixture.debugElement.query(By.css('.dialog-backdrop'));
    backdrop.nativeElement.click();
    
    // Assert
    expect(component.dialogClose.emit).toHaveBeenCalled();
  });

  it('should not close dialog when backdrop is clicked and closeOnBackdropClick is false', () => {
    // Arrange
    component.closeOnBackdropClick = false;
    spyOn(component.dialogClose, 'emit');
    component.open();
    fixture.detectChanges();
    
    // Act
    const backdrop = fixture.debugElement.query(By.css('.dialog-backdrop'));
    backdrop.nativeElement.click();
    
    // Assert
    expect(component.dialogClose.emit).not.toHaveBeenCalled();
  });

  it('should apply custom dialog class when provided', () => {
    // Arrange
    component.dialogClass = 'dialog-lg';
    component.open();
    fixture.detectChanges();
    
    // Assert
    const dialogContent = fixture.debugElement.query(By.css('.dialog-content'));
    expect(dialogContent.nativeElement.classList).toContain('dialog-lg');
  });
});
