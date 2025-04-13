import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create spy for localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    
    // Mock localStorage methods
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    TestBed.configureTestingModule({
      providers: [FeatureFlagService]
    });
    
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default flags', () => {
    // Default flags should be loaded when no localStorage data exists
    localStorageSpy.getItem.and.returnValue(null);
    
    // Re-create service to trigger constructor
    service = TestBed.inject(FeatureFlagService);
    
    // Check default flags
    const flags = service.allFlags();
    expect(flags['new-task-dialog']).toBeTrue();
    expect(flags['task-filtering']).toBeFalse();
  });

  it('should load flags from localStorage', () => {
    // Setup localStorage mock
    const savedFlags = {
      'new-task-dialog': false,
      'task-filtering': true
    };
    localStorageSpy.getItem.and.returnValue(JSON.stringify(savedFlags));
    
    // Call loadFlags to test
    service.loadFlags();
    
    // Verify flags were loaded
    const flags = service.allFlags();
    expect(flags['new-task-dialog']).toBeFalse();
    expect(flags['task-filtering']).toBeTrue();
  });

  it('should check if a feature is enabled', () => {
    // Setup with known state
    const savedFlags = {
      'new-task-dialog': true,
      'task-filtering': false
    };
    localStorageSpy.getItem.and.returnValue(JSON.stringify(savedFlags));
    service.loadFlags();
    
    // Test isEnabled method
    expect(service.isEnabled('new-task-dialog')).toBeTrue();
    expect(service.isEnabled('task-filtering')).toBeFalse();
  });

  it('should toggle a feature flag', () => {
    // Setup with known state
    const savedFlags = {
      'new-task-dialog': true,
      'task-filtering': false
    };
    localStorageSpy.getItem.and.returnValue(JSON.stringify(savedFlags));
    service.loadFlags();
    
    // Toggle a flag
    service.toggle('new-task-dialog');
    
    // Verify flag was toggled
    expect(service.isEnabled('new-task-dialog')).toBeFalse();
    
    // Toggle another flag
    service.toggle('task-filtering');
    
    // Verify flag was toggled
    expect(service.isEnabled('task-filtering')).toBeTrue();
    
    // Verify localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should reset flags to default values', () => {
    // Setup with modified state
    const savedFlags = {
      'new-task-dialog': false,
      'task-filtering': true
    };
    localStorageSpy.getItem.and.returnValue(JSON.stringify(savedFlags));
    service.loadFlags();
    
    // Reset flags
    service.resetFlags();
    
    // Verify flags were reset to defaults
    const flags = service.allFlags();
    expect(flags['new-task-dialog']).toBeTrue();
    expect(flags['task-filtering']).toBeFalse();
    
    // Verify localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should handle localStorage errors gracefully', () => {
    // Setup localStorage to throw error
    localStorageSpy.getItem.and.throwError('Storage error');
    
    // Spy on console.error
    spyOn(console, 'error');
    
    // Call loadFlags
    service.loadFlags();
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
  });
});
