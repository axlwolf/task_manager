import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Welcome to Angular v18!</h1>
      <p class="mb-4">This is a starter project with a clean architecture.</p>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-2">Features</h2>
        <ul class="list-disc pl-5">
          <li>Angular v18</li>
          <li>Tailwind CSS</li>
          <li>Clean Architecture</li>
          <li>Signals for State Management</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomePageComponent {}