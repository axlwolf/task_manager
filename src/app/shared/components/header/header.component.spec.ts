import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { LogoComponent } from '../logo/logo.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { ThemeService } from '../../../core/services/theme.service';
import { signal } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;

  const mockThemes = [
    { name: 'theme-purple', label: 'Purple (Default)' },
    { name: 'theme-dark', label: 'Dark Premium' }
  ];

  beforeEach(async () => {
    // Create spy for ThemeService
    themeService = jasmine.createSpyObj('ThemeService', ['getThemes', 'setTheme']);
    themeService.getThemes.and.returnValue(mockThemes);
    
    // Add signal property to the spy
    Object.defineProperty(themeService, 'currentTheme', {
      get: () => signal('theme-dark').asReadonly()
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HeaderComponent,
        LogoComponent,
        ThemeSwitcherComponent
      ],
      providers: [
        { provide: ThemeService, useValue: themeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include the logo component', () => {
    const logoElement = fixture.debugElement.query(By.css('app-logo'));
    expect(logoElement).toBeTruthy();
  });

  it('should include the theme switcher component', () => {
    const themeSwitcherElement = fixture.debugElement.query(By.css('app-theme-switcher'));
    expect(themeSwitcherElement).toBeTruthy();
  });

  it('should have navigation links', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav a'));
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('should have a link to the home page', () => {
    const homeLink = fixture.debugElement.query(By.css('nav a[routerLink="/"]'));
    expect(homeLink).toBeTruthy();
    expect(homeLink.nativeElement.textContent.trim()).toBe('Home');
  });

  it('should have a link to the tasks page', () => {
    const tasksLink = fixture.debugElement.query(By.css('nav a[routerLink="/tasks"]'));
    expect(tasksLink).toBeTruthy();
    expect(tasksLink.nativeElement.textContent.trim()).toBe('Tasks');
  });
});
