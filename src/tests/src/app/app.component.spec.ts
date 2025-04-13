import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../../../app/app.component';
import { ThemeService } from '../../../app/core/services/theme.service';

describe('AppComponent', () => {
  const setup = (config?: {
    mockThemeService?: {
      loadTheme?: jasmine.Spy;
    };
  }) => {
    // Create spy for ThemeService
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['loadTheme']);
    
    // Configure the spy if provided in config
    if (config?.mockThemeService?.loadTheme) {
      themeServiceSpy.loadTheme = config.mockThemeService.loadTheme;
    }

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    });

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    
    fixture.detectChanges();
    
    return { fixture, component, themeService };
  };

  it('should create the app', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should have router-outlet', () => {
    const { fixture } = setup();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should load theme on initialization', () => {
    const { themeService } = setup();
    expect(themeService.loadTheme).toHaveBeenCalled();
  });
});