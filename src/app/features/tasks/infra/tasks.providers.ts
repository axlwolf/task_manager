import { Provider } from '@angular/core';
import { TaskRepository } from '../domain/repositories/task.repository';
import { UserRepository } from '../domain/repositories/user.repository';
import { TaskImplRepository } from './repositories/task-impl.repository';
import { UserImplRepository } from './repositories/user-impl.repository';

export const TASKS_PROVIDERS: Provider[] = [
  {
    provide: TaskRepository,
    useClass: TaskImplRepository
  },
  {
    provide: UserRepository,
    useClass: UserImplRepository,
  },
];
