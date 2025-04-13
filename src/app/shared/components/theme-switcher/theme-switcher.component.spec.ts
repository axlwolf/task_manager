import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ThemeService, Theme } from '../../../core/services/theme.service';
import { signal } from '@angular/core';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;

  const mockThemes: Theme[] = [
    { name: 'theme-purple', label: 'Purple (Default)' },
    { name: 'theme-dark', label: 'Dark Premium' },
    { name: 'theme-neodigital', label: 'Neo-Digital' }
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
      imports: [ThemeSwitcherComponent, FormsModule],
      providers: [
        { provide: ThemeService, useValue: themeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get themes from ThemeService', () => {
    expect(themeService.getThemes).toHaveBeenCalled();
    expect(component['themes']).toEqual(mockThemes);
  });

  it('should display a select element with theme options', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));
    expect(selectElement).toBeTruthy();
    
    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(mockThemes.length);
  });

  it('should display correct theme labels in options', () => {
    const options = fixture.debugElement.queryAll(By.css('option'));
    
    expect(options[0].nativeElement.textContent).toBe('Purple (Default)');
    expect(options[1].nativeElement.textContent).toBe('Dark Premium');
    expect(options[2].nativeElement.textContent).toBe('Neo-Digital');
  });

  it('should have correct theme values in options', () => {
    const options = fixture.debugElement.queryAll(By.css('option'));
    
    expect(options[0].nativeElement.value).toBe('theme-purple');
    expect(options[1].nativeElement.value).toBe('theme-dark');
    expect(options[2].nativeElement.value).toBe('theme-neodigital');
  });

  it('should select the current theme', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));
    expect(selectElement.nativeElement.value).toBe('theme-dark');
  });

  it('should call setTheme when selection changes', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));
    
    // Change the selected value
    selectElement.nativeElement.value = 'theme-neodigital';
    selectElement.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    
    expect(themeService.setTheme).toHaveBeenCalledWith('theme-neodigital');
  });
});
