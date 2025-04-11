import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="theme-switcher">
      <select
        [ngModel]="themeService.currentTheme()"
        (ngModelChange)="themeService.setTheme($event)"
        class="theme-select"
        aria-label="Select theme"
      >
        @for (theme of themes; track theme.name) {
        <option [value]="theme.name">{{ theme.label }}</option>
        }
      </select>
    </div>
  `,
  styles: [
    `
      .theme-switcher {
        margin: 1rem 0;
      }

      .theme-select {
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid var(--color-border-medium);
        background-color: var(--color-bg-tertiary);
        color: var(--color-text-primary);
        font-size: 0.875rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }

      .theme-select:focus {
        outline: none;
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 2px var(--color-primary-200);
      }
    `,
  ],
})
export class ThemeSwitcherComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly themes: Theme[] = this.themeService.getThemes();
}
