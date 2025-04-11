import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  template: `
    <header class="bg-purple-900 py-8 px-4">
      <div class="container mx-auto">
        <app-logo></app-logo>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  constructor() {}
}
