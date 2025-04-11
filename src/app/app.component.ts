import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  title = 'EasyTask';
  private readonly themeService = inject(ThemeService);

  constructor() {
    // Theme is automatically loaded in the ThemeService constructor
    // This ensures the theme is applied as soon as the app starts
  }
}
