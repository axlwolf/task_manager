import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { User } from '../../features/tasks/domain/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  // Using signals for state management
  private readonly userSignal = signal<User | null>(null);
  private readonly isAuthenticatedSignal = signal<boolean>(false);

  // Expose readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  login(email: string, password: string): Observable<boolean> {
    // This would be a real API call in a production app
    return this.http
      .post<{ user: User; token: string }>('/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.userSignal.set(response.user);
          this.isAuthenticatedSignal.set(true);
          localStorage.setItem('token', response.token);
        }),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  logout(): void {
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('token');
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    // This would validate the token with the backend in a real app
    return this.http.get<User>('/api/auth/me').pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      }),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }
}
