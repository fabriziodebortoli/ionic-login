import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonicModule,
  LoadingController,
  ToastController
} from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../user';

@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, ReactiveFormsModule],
})
export class RegisterPage {
  form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    console.log('RegisterPage.ionViewWillEnter()');

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

  async register() {
    if (this.form.invalid) return;

    const f = Object.assign({}, this.form.value);
    await this.showLoading();

    const user: Partial<User> = {
      name: f.name,
      email: f.email,
      password: f.password,
    };

    this.authService
      .register(user)
      .pipe(
        tap((__) => this.loadingCtrl.dismiss()),
        finalize(() => {
          this.loadingCtrl.dismiss();
        })
      )
      .subscribe({
        next: (user) => {
          if (!user) {
            this.showToast('errore'); //('register error', user);
          }
        },
        error: (error) => {
          this.loadingCtrl.dismiss();
          this.showToast(error);
          console.error('login error', user, error);
          // this.snackbarService.error(
          //   $localize`Errore durante l' invio della segnalazione`
          // );
        },
      });
  }

  async showToast(error: string) {
    const toast = await this.toastController.create({
      message: error,
      duration: 3000,
      position: 'bottom',
    });

    await toast.present();
  }
}
