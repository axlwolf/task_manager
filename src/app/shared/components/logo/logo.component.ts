import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center">
      <div class="mb-2">
        <img src="assets/logo.svg" alt="EasyTask Logo" class="w-24 h-24" />
      </div>
      <h1 class="text-3xl font-bold text-white">{{ title }}</h1>
      @if (subtitle) {
      <p class="text-white text-sm mt-1">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [],
})
export class LogoComponent {
  @Input() title = 'EasyTask';
  @Input() subtitle = 'Enterprise-level task management without friction';
}
