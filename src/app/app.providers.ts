import { EnvironmentProviders, Provider } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AnimationService } from './shared/services/animation.service';
import { TaskRepository } from './features/tasks/domain/repositories/task.repository';
import { TaskImplRepository } from './features/tasks/infra/repositories/task-impl.repository';
import { UserRepository } from './features/tasks/domain/repositories/user.repository';
import { UserImplRepository } from './features/tasks/infra/repositories/user-impl.repository';

export const APP_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideAnimations(),
  AnimationService,
  
  // Proveedores para repositorios
  { provide: TaskRepository, useClass: TaskImplRepository },
  { provide: UserRepository, useClass: UserImplRepository }
];
