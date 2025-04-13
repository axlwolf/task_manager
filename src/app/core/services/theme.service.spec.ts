import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let documentElementSpy: jasmine.SpyObj<HTMLElement>;

  beforeEach(() => {
    // Create spies for localStorage and document.documentElement
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    documentElementSpy = jasmine.createSpyObj('documentElement', [], { className: '' });

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: documentElementSpy,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });

    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all available themes', () => {
    const themes = service.getThemes();
    expect(themes.length).toBeGreaterThan(0);
    expect(themes[0].name).toBeDefined();
    expect(themes[0].label).toBeDefined();
  });

  it('should set a theme', () => {
    // Arrange
    const themeName = 'theme-dark';
    
    // Act
    service.setTheme(themeName);
    
    // Assert
    expect(document.documentElement.className).toBe(themeName);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', themeName);
  });

  it('should use default theme if theme name is invalid', () => {
    // Arrange
    const invalidThemeName = 'invalid-theme';
    
    // Act
    service.setTheme(invalidThemeName);
    
    // Assert
    expect(document.documentElement.className).toBe('theme-purple');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'theme-purple');
  });

  it('should load theme from localStorage', () => {
    // Arrange
    const savedTheme = 'theme-dark';
    localStorageSpy.getItem.and.returnValue(savedTheme);
    
    // Act
    service.loadTheme();
    
    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    expect(document.documentElement.className).toBe(savedTheme);
  });

  it('should use default theme if localStorage is empty', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue(null);
    
    // Act
    service.loadTheme();
    
    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    expect(document.documentElement.className).toBe('theme-purple');
  });

  it('should update currentTheme signal when setting a theme', () => {
    // Arrange
    const themeName = 'theme-dark';
    
    // Act
    service.setTheme(themeName);
    
    // Assert
    expect(service.currentTheme()).toBe(themeName);
  });

  it('should load theme from localStorage on construction', () => {
    // This test verifies that loadTheme is called in the constructor
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
  });
});
