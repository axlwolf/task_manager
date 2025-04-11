import { Routes } from '@angular/router';
import { TasksLayoutComponent } from './layout/tasks-layout.component';
import { TasksPageComponent } from './pages/tasks-page.component';
import { TASKS_PROVIDERS } from './tasks.providers';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    providers: TASKS_PROVIDERS,
    children: [
      {
        path: '',
        component: TasksLayoutComponent,
        children: [
          {
            path: '',
            component: TasksPageComponent,
          },
        ],
      },
    ],
  },
];
