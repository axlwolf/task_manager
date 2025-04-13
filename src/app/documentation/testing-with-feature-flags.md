# Testing with Feature Flags

This document outlines the approach for testing components and services that use feature flags in our Trunk-Based Development workflow.

## Overview

Feature flags allow us to merge incomplete features into the trunk while keeping them hidden from users until they're ready. When testing components that use feature flags, we need to test both the enabled and disabled states of the feature.

## Testing Feature Flag Service

The `FeatureFlagService` is the core service for managing feature flags. Tests for this service should verify:

1. Default flag values
2. Enabling and disabling flags
3. Toggling flags
4. Persistence to localStorage
5. Loading flags from localStorage
6. Resetting flags to defaults
7. Handling invalid localStorage data

Example:

```typescript
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
  
  it('should enable a flag', () => {
    service.enable('task-filtering');
    expect(service.isEnabled('task-filtering')).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  // Additional tests...
});
```

## Testing Components with Feature Flags

When testing components that use feature flags, we need to:

1. Mock the `FeatureFlagService`
2. Test the component behavior with flags both enabled and disabled
3. Verify that the component renders correctly based on flag state

### Setup Function Pattern

```typescript
const setup = (config?: { flags?: Record<string, boolean> }) => {
  // Default configuration
  const defaultConfig = {
    flags: {
      'new-task-dialog': true,
      'task-filtering': false
    }
  };
  
  // Merge with provided config
  const testConfig = {
    flags: { ...defaultConfig.flags, ...config?.flags }
  };
  
  // Create spy for FeatureFlagService
  const featureFlagSpy = jasmine.createSpyObj('FeatureFlagService', ['isEnabled']);
  
  // Configure the spy to return values based on the test config
  featureFlagSpy.isEnabled.and.callFake((flagName: string) => 
    testConfig.flags[flagName] ?? false
  );
  
  // Configure TestBed
  TestBed.configureTestingModule({
    imports: [ComponentUnderTest],
    providers: [
      { provide: FeatureFlagService, useValue: featureFlagSpy }
    ]
  });
  
  // Create component and fixture
  const fixture = TestBed.createComponent(ComponentUnderTest);
  const component = fixture.componentInstance;
  
  fixture.detectChanges();
  
  return { fixture, component, featureFlagSpy, testConfig };
};
```

### Example Tests

```typescript
describe('TaskDialogComponent', () => {
  it('should show new dialog UI when feature flag is enabled', () => {
    const { fixture } = setup({ flags: { 'new-task-dialog': true } });
    
    const newDialogElement = fixture.debugElement.query(By.css('.new-dialog-ui'));
    expect(newDialogElement).toBeTruthy();
    
    const oldFormElement = fixture.debugElement.query(By.css('.old-form-ui'));
    expect(oldFormElement).toBeFalsy();
  });
  
  it('should show old form UI when feature flag is disabled', () => {
    const { fixture } = setup({ flags: { 'new-task-dialog': false } });
    
    const newDialogElement = fixture.debugElement.query(By.css('.new-dialog-ui'));
    expect(newDialogElement).toBeFalsy();
    
    const oldFormElement = fixture.debugElement.query(By.css('.old-form-ui'));
    expect(oldFormElement).toBeTruthy();
  });
});
```

## Testing Services with Feature Flags

Services that use feature flags should be tested with both enabled and disabled states:

```typescript
describe('TaskService', () => {
  let service: TaskService;
  let featureFlagSpy: jasmine.SpyObj<FeatureFlagService>;
  
  beforeEach(() => {
    featureFlagSpy = jasmine.createSpyObj('FeatureFlagService', ['isEnabled']);
    
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: FeatureFlagService, useValue: featureFlagSpy }
      ]
    });
    
    service = TestBed.inject(TaskService);
  });
  
  it('should use new API when feature flag is enabled', () => {
    featureFlagSpy.isEnabled.and.returnValue(true);
    
    // Test service behavior with flag enabled
    // ...
  });
  
  it('should use old API when feature flag is disabled', () => {
    featureFlagSpy.isEnabled.and.returnValue(false);
    
    // Test service behavior with flag disabled
    // ...
  });
});
```

## Integration Testing with Feature Flags

Integration tests should also consider feature flags:

```typescript
describe('Task Management Integration', () => {
  let fixture: ComponentFixture<TasksPageComponent>;
  let featureFlagService: FeatureFlagService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TasksModule],
      providers: [
        {
          provide: FeatureFlagService,
          useValue: {
            isEnabled: jasmine.createSpy('isEnabled')
          }
        }
      ]
    });
    
    fixture = TestBed.createComponent(TasksPageComponent);
    featureFlagService = TestBed.inject(FeatureFlagService);
  });
  
  it('should integrate new task dialog when feature flag is enabled', () => {
    (featureFlagService.isEnabled as jasmine.Spy).and.callFake(
      (flag: string) => flag === 'new-task-dialog'
    );
    
    fixture.detectChanges();
    
    // Test integration with new dialog
    // ...
  });
  
  it('should integrate old task form when feature flag is disabled', () => {
    (featureFlagService.isEnabled as jasmine.Spy).and.returnValue(false);
    
    fixture.detectChanges();
    
    // Test integration with old form
    // ...
  });
});
```

## Best Practices

1. **Test Both States**: Always test both enabled and disabled states of feature flags
2. **Mock FeatureFlagService**: Use jasmine.createSpyObj to mock the service
3. **Use Setup Functions**: Create reusable setup functions for testing with feature flags
4. **Test Edge Cases**: Test behavior when flags are toggled during component lifecycle
5. **Integration Tests**: Include feature flag variations in integration tests
6. **Clear Test Names**: Use descriptive test names that indicate which flag state is being tested
