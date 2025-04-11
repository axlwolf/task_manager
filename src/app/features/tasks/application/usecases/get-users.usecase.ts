import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Observable<User[]> {
    return this.userRepository.getUsers();
  }
}
