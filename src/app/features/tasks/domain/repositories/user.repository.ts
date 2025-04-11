import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract getUsers(): Observable<User[]>;
  abstract getUserById(userId: string): Observable<User>;
}