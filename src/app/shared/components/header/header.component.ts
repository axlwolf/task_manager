import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LogoComponent, ThemeSwitcherComponent],
  template: `
    <header
      style="background-color: var(--color-header-bg); color: var(--color-header-text);"
      class="py-8 px-4"
    >
      <div class="container mx-auto">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-center"
        >
          <app-logo></app-logo>
          <div class="mt-4 md:mt-0">
            <app-theme-switcher></app-theme-switcher>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  constructor() {}
}
