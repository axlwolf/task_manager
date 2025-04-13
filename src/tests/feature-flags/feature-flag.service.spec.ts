import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from '../../app/core/services/feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  
  // Mock localStorage
  let localStorageMock: { [key: string]: string } = {};
  
  beforeEach(() => {
    // Setup localStorage mock
    localStorageMock = {};
    spyOn(localStorage, 'getItem').and.callFake((key) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => localStorageMock[key] = value);
    spyOn(localStorage, 'removeItem').and.callFake((key) => delete localStorageMock[key]);
    
    TestBed.configureTestingModule({
      providers: [FeatureFlagService]
    });
    
    service = TestBed.inject(FeatureFlagService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should have default flags', () => {
    expect(service.isEnabled('new-task-dialog')).toBeTrue();
    expect(service.isEnabled('task-filtering')).toBeFalse();
    expect(service.isEnabled('user-management')).toBeFalse();
  });
  
  it('should enable a flag', () => {
    service.enable('task-filtering');
    expect(service.isEnabled('task-filtering')).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  it('should disable a flag', () => {
    service.disable('new-task-dialog');
    expect(service.isEnabled('new-task-dialog')).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  it('should toggle a flag', () => {
    const initialState = service.isEnabled('new-task-dialog');
    service.toggle('new-task-dialog');
    expect(service.isEnabled('new-task-dialog')).toBe(!initialState);
    service.toggle('new-task-dialog');
    expect(service.isEnabled('new-task-dialog')).toBe(initialState);
  });
  
  it('should load flags from localStorage', () => {
    localStorageMock['featureFlags'] = JSON.stringify({
      'new-task-dialog': false,
      'task-filtering': true
    });
    
    service.loadFlags();
    
    expect(service.isEnabled('new-task-dialog')).toBeFalse();
    expect(service.isEnabled('task-filtering')).toBeTrue();
  });
  
  it('should reset flags to defaults', () => {
    service.enable('task-filtering');
    service.disable('new-task-dialog');
    
    service.resetFlags();
    
    expect(service.isEnabled('new-task-dialog')).toBeTrue();
    expect(service.isEnabled('task-filtering')).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('featureFlags');
  });
  
  it('should handle invalid localStorage data', () => {
    localStorageMock['featureFlags'] = 'invalid-json';
    
    // This should not throw an error
    service.loadFlags();
    
    // Default values should be used
    expect(service.isEnabled('new-task-dialog')).toBeTrue();
  });
  
  it('should return false for non-existent flags', () => {
    expect(service.isEnabled('non-existent-flag')).toBeFalse();
  });
});
