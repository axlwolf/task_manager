import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tasks-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container mx-auto py-8">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class TasksLayoutComponent {}