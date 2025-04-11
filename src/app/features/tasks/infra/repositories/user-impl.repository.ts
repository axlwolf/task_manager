import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';
import { USERS } from '../../../../core/data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class UserImplRepository extends UserRepository {
  private users: User[] = [...USERS];

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(userId: string): Observable<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    return of(user);
  }
}