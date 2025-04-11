import { Provider } from '@angular/core';
import { TaskRepository } from './features/tasks/domain/repositories/task.repository';
import { UserRepository } from './features/tasks/domain/repositories/user.repository';
import { TaskImplRepository } from './features/tasks/infra/repositories/task-impl.repository';
import { UserImplRepository } from './features/tasks/infra/repositories/user-impl.repository';

export const APP_PROVIDERS: Provider[] = [
  {
    provide: TaskRepository,
    useClass: TaskImplRepository
  },
  {
    provide: UserRepository,
    useClass: UserImplRepository
  }
];