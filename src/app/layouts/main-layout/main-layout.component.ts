import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-black">
      <app-header></app-header>

      <main class="container mx-auto py-8 px-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [],
})
export class MainLayoutComponent {}
