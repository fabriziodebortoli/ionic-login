import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { IonToastService } from 'src/app/core/services/toast.service';
import { AuthService } from '../auth.service';
import { User } from '../user';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, ReactiveFormsModule],
})
export class LoginPage {
  form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastService: IonToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    console.log('LoginPage.ionViewWillEnter()');

    // redirect to home when logged in
    this.authService
      .isLoggedIn()
      .pipe(untilDestroyed(this))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          console.log('Just logged in, redirect to Home');
          this.router.navigate(['/', 'home']);
        }
      });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
    });

    loading.present();
  }

  async login() {
    if (this.form.invalid) return;

    const f = Object.assign({}, this.form.value);
    await this.showLoading();

    const user: Partial<User> = {
      email: f.email,
      password: f.password,
    };

    this.authService
      .login(user)
      .pipe(
        tap((__) => this.loadingCtrl.dismiss()),
        finalize(() => {
          this.loadingCtrl.dismiss();
        })
      )
      .subscribe({
        next: (user) => {
          if (!user) {
            console.error(user);
            // this.snackbarService.error(
            //   $localize`Errore durante l' invio della segnalazione`
            // );
          }
          console.log('user logged', user);

          // this.snackbarService.success(
          //   $localize`Segnalazione inviata, grazie!`
          // );
        },
        error: (error) => {
          this.loadingCtrl.dismiss();
          this.toastService.info(error);
          console.error('login error', user, error);
          // this.snackbarService.error(
          //   $localize`Errore durante l' invio della segnalazione`
          // );
        },
      });
  }
}
