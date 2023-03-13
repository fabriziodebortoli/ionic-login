import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { IonPreferencesService } from '../core/services/preferences.service';
import { AuthResponse } from './auth-response';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  AUTH_SERVER_ADDRESS: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private preferencesService: IonPreferencesService
  ) {}

  register(user: Partial<User>): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/register`, user)
      .pipe(
        tap(async (res: AuthResponse) => {
          if (res.user) {
            await this.preferencesService.setPreference(
              'ACCESS_TOKEN',
              res.access_token
            );
            await this.preferencesService.setPreference(
              'EXPIRES_IN',
              JSON.stringify(res.expires_in)
            );
            this.authSubject.next(true);
          }
        })
      );
  }

  login(user: Partial<User>): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/login`, user)
      .pipe(
        tap(async (res: AuthResponse) => {
          console.log('login response', res);
          if (res.user) {
            await this.preferencesService.setPreference(
              'ACCESS_TOKEN',
              res.access_token
            );
            await this.preferencesService.setPreference(
              'EXPIRES_IN',
              JSON.stringify(res.expires_in)
            );
            this.authSubject.next(true);
          }
        })
      );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  async logout() {
    await this.preferencesService.removePreference('ACCESS_TOKEN');
    await this.preferencesService.removePreference('EXPIRES_IN');
    this.authSubject.next(false);
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }
}
