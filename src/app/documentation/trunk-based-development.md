# Trunk-Based Development Strategy

## Overview

Trunk-Based Development (TBD) is a source control branching model where developers collaborate on code in a single branch called 'trunk' (in our case, the 'main' branch). This approach emphasizes small, frequent changes and continuous integration.

## Key Principles

1. **Short-Lived Feature Branches**: Create branches for features that last no more than 1-2 days
2. **Frequent Integration**: Merge changes to the trunk (main) at least once per day
3. **Feature Flags**: Use feature flags to hide incomplete features in production
4. **Continuous Integration**: Ensure all tests pass before merging to trunk
5. **Small Commits**: Keep commits small and focused on a single task

## Workflow

### Branch Naming Convention

- `feature/[feature-name]`: For new features
- `fix/[issue-name]`: For bug fixes
- `refactor/[component-name]`: For code refactoring
- `docs/[document-name]`: For documentation updates

### Development Process

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/my-feature main
   ```

2. **Make Small, Frequent Commits**:
   ```bash
   git add .
   git commit -m "28. feat: add feature description"
   ```

3. **Keep Branch Updated with Trunk**:
   ```bash
   git checkout main
   git pull
   git checkout feature/my-feature
   git merge main
   ```

4. **Create Pull Request**:
   - Create a pull request when the feature is ready
   - Ensure all tests pass
   - Get code review

5. **Merge to Trunk**:
   - After approval, merge the pull request
   - Delete the feature branch

## Feature Flags

Feature flags allow us to merge incomplete features into the trunk while keeping them hidden from users until they're ready.

### Implementation

We use a simple feature flag service to manage feature visibility:

```typescript
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private flags = signal<Record<string, boolean>>({
    // Default flags
    'new-task-dialog': true,
    'task-filtering': false,
    'user-management': false
  });

  isEnabled(flagName: string): boolean {
    return this.flags()[flagName] ?? false;
  }

  enable(flagName: string): void {
    this.flags.update(flags => ({...flags, [flagName]: true}));
  }

  disable(flagName: string): void {
    this.flags.update(flags => ({...flags, [flagName]: false}));
  }
}
```

### Usage in Components

```typescript
@Component({
  selector: 'app-my-feature',
  template: `
    @if (featureEnabled()) {
      <div>New Feature Content</div>
    } @else {
      <div>Old Feature Content</div>
    }
  `
})
export class MyFeatureComponent {
  private featureFlagService = inject(FeatureFlagService);
  
  featureEnabled = computed(() => 
    this.featureFlagService.isEnabled('my-feature-flag')
  );
}
```

## Testing Strategy

### Unit Tests

1. **Test with Feature Flags**:
   - Test both enabled and disabled states of feature flags
   - Mock the FeatureFlagService in tests

```typescript
describe('MyFeatureComponent', () => {
  let component: MyFeatureComponent;
  let fixture: ComponentFixture<MyFeatureComponent>;
  let featureFlagService: jasmine.SpyObj<FeatureFlagService>;

  beforeEach(() => {
    featureFlagService = jasmine.createSpyObj('FeatureFlagService', ['isEnabled']);
    
    TestBed.configureTestingModule({
      imports: [MyFeatureComponent],
      providers: [
        { provide: FeatureFlagService, useValue: featureFlagService }
      ]
    });
    
    fixture = TestBed.createComponent(MyFeatureComponent);
    component = fixture.componentInstance;
  });

  it('should show new content when feature flag is enabled', () => {
    featureFlagService.isEnabled.and.returnValue(true);
    fixture.detectChanges();
    
    const newContent = fixture.nativeElement.querySelector('.new-content');
    expect(newContent).toBeTruthy();
  });

  it('should show old content when feature flag is disabled', () => {
    featureFlagService.isEnabled.and.returnValue(false);
    fixture.detectChanges();
    
    const oldContent = fixture.nativeElement.querySelector('.old-content');
    expect(oldContent).toBeTruthy();
  });
});
```

### Integration Tests

Integration tests should also consider feature flags:

```typescript
describe('Task Management Integration', () => {
  let fixture: ComponentFixture<TasksPageComponent>;
  let featureFlagService: FeatureFlagService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TasksModule],
      providers: [FeatureFlagService]
    });
    
    fixture = TestBed.createComponent(TasksPageComponent);
    featureFlagService = TestBed.inject(FeatureFlagService);
  });
  
  it('should show new task dialog when feature flag is enabled', () => {
    featureFlagService.enable('new-task-dialog');
    fixture.detectChanges();
    
    // Test with feature enabled
  });
  
  it('should show old task form when feature flag is disabled', () => {
    featureFlagService.disable('new-task-dialog');
    fixture.detectChanges();
    
    // Test with feature disabled
  });
});
```

## Continuous Integration

Our CI pipeline ensures that all tests pass before merging to trunk:

1. **Pre-commit Hooks**: Run linting and formatting
2. **CI Pipeline**: Run all tests on pull requests
3. **Deployment**: Deploy to staging after merge to trunk

## Benefits of Trunk-Based Development

1. **Reduced Merge Conflicts**: Frequent integration reduces conflicts
2. **Faster Feedback**: Continuous integration provides quick feedback
3. **Improved Collaboration**: Everyone works on the latest code
4. **Simplified Workflow**: Less branching complexity
5. **Better Quality**: Continuous testing ensures high quality

## Implementation Plan

1. **Phase 1**: Set up feature flag service
2. **Phase 2**: Update existing components to use feature flags
3. **Phase 3**: Implement CI pipeline for continuous testing
4. **Phase 4**: Train team on TBD workflow
