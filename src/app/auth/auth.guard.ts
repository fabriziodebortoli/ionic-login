import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) this.routeToLogin();
        return of(isAuthenticated);
      })
    );
  }

  private routeToLogin() {
    this.navCtrl.navigateRoot('/auth/login');
  }
}
