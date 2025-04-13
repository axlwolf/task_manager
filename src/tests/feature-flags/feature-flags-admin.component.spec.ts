import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeatureFlagsAdminComponent } from '../../app/shared/components/feature-flags/feature-flags-admin.component';
import { FeatureFlagService } from '../../app/core/services/feature-flag.service';
import { signal } from '@angular/core';

describe('FeatureFlagsAdminComponent', () => {
  let component: FeatureFlagsAdminComponent;
  let fixture: ComponentFixture<FeatureFlagsAdminComponent>;
  let featureFlagService: jasmine.SpyObj<FeatureFlagService>;
  
  beforeEach(() => {
    // Create spy for FeatureFlagService
    const spy = jasmine.createSpyObj('FeatureFlagService', [
      'loadFlags',
      'toggle',
      'resetFlags',
      'isEnabled'
    ]);
    
    // Mock the allFlags computed signal
    Object.defineProperty(spy, 'allFlags', {
      value: signal({
        'new-task-dialog': true,
        'task-filtering': false
      }).asReadonly()
    });
    
    TestBed.configureTestingModule({
      imports: [FeatureFlagsAdminComponent],
      providers: [
        { provide: FeatureFlagService, useValue: spy }
      ]
    });
    
    fixture = TestBed.createComponent(FeatureFlagsAdminComponent);
    component = fixture.componentInstance;
    featureFlagService = TestBed.inject(FeatureFlagService) as jasmine.SpyObj<FeatureFlagService>;
    
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load flags on init', () => {
    expect(featureFlagService.loadFlags).toHaveBeenCalled();
  });
  
  it('should display all feature flags', () => {
    const flagElements = fixture.debugElement.queryAll(By.css('.feature-flags-container > div > div'));
    expect(flagElements.length).toBe(2); // Two flags in our mock
    
    // Check first flag (new-task-dialog)
    const firstFlag = flagElements[0];
    expect(firstFlag.nativeElement.textContent).toContain('New Task Dialog');
    expect(firstFlag.nativeElement.textContent).toContain('Enabled');
    
    // Check second flag (task-filtering)
    const secondFlag = flagElements[1];
    expect(secondFlag.nativeElement.textContent).toContain('Task Filtering');
    expect(secondFlag.nativeElement.textContent).toContain('Disabled');
  });
  
  it('should toggle flag when button is clicked', () => {
    const toggleButtons = fixture.debugElement.queryAll(By.css('button:not(:last-child)'));
    
    // Click the first toggle button (for new-task-dialog)
    toggleButtons[0].nativeElement.click();
    
    expect(featureFlagService.toggle).toHaveBeenCalledWith('new-task-dialog');
  });
  
  it('should reset flags when reset button is clicked', () => {
    const resetButton = fixture.debugElement.query(By.css('button:last-child'));
    
    resetButton.nativeElement.click();
    
    expect(featureFlagService.resetFlags).toHaveBeenCalled();
  });
  
  it('should format flag names correctly', () => {
    expect(component.formatFlagName('new-task-dialog')).toBe('New Task Dialog');
    expect(component.formatFlagName('task-filtering')).toBe('Task Filtering');
    expect(component.formatFlagName('user-management')).toBe('User Management');
  });
});
