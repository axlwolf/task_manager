import { Injectable, signal } from '@angular/core';

export interface Theme {
  name: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Available themes
  private readonly themes: Theme[] = [
    { name: 'theme-purple', label: 'Purple (Default)' },
    { name: 'theme-dark', label: 'Dark Premium' },
    { name: 'theme-neodigital', label: 'Neo-Digital' },
    { name: 'theme-gradient', label: 'Gradientes Suaves' },
    { name: 'theme-harmony', label: 'Armonía Oceánica' },
    { name: 'theme-turquesa-fresco', label: 'Turquesa Fresco' },
  ];

  // Current theme signal
  private readonly currentThemeSignal = signal<string>('theme-dark');

  // Expose readonly signal
  readonly currentTheme = this.currentThemeSignal.asReadonly();

  constructor() {
    this.loadTheme();
  }

  /**
   * Get all available themes
   */
  getThemes(): Theme[] {
    return [...this.themes];
  }

  /**
   * Set the current theme
   */
  setTheme(themeName: string): void {
    // Validate theme exists
    if (!this.themes.some((theme) => theme.name === themeName)) {
      console.warn(`Theme "${themeName}" not found. Using default theme.`);
      themeName = 'theme-purple';
    }

    // Update document class
    document.documentElement.className = themeName;

    // Save to localStorage
    localStorage.setItem('theme', themeName);

    // Update signal
    this.currentThemeSignal.set(themeName);
  }

  /**
   * Load theme from localStorage or use default
   */
  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'theme-purple';
    this.setTheme(savedTheme);
  }
}
