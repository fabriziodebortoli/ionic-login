import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../auth/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private authService: AuthService, private router: Router) {}

  ionViewWillEnter() {
    console.log('HomePage.ionViewWillEnter()');

    // redirect to login page when logged out
    this.authService
      .isLoggedIn()
      .pipe(untilDestroyed(this))
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated) {
          console.log('Just logged out, redirect to Login page');
          this.router.navigate(['/', 'auth', 'login']);
        }
      });
  }

  logout() {
    this.authService.logout();
  }
}
