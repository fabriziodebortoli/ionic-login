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
import { AuthService } from '../auth.service';
import { User } from '../user';

@UntilDestroy()
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, ReactiveFormsModule],
})
export class ForgotPasswordPage {
  form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    console.log('ForgotPasswordPage.ionViewWillEnter()');

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

  async forgotPassword() {
    if (this.form.invalid) return;

    const f = Object.assign({}, this.form.value);
    await this.showLoading();

    const user: Partial<User> = {
      email: f.email
    };

    // this.authService
    //   .forgotPassword(user)
    //   .pipe(
    //     tap((__) => this.loadingCtrl.dismiss()),
    //     finalize(() => {
    //       this.loadingCtrl.dismiss();
    //     })
    //   )
    //   .subscribe({
    //     next: (user) => {
    //       if (!user) {
    //         console.error(user);
    //         // this.snackbarService.error(
    //         //   $localize`Errore durante l' invio della segnalazione`
    //         // );
    //       }
    //       console.log('user logged', user);

    //       // this.snackbarService.success(
    //       //   $localize`Segnalazione inviata, grazie!`
    //       // );
    //     },
    //     error: (error) => {
    //       this.loadingCtrl.dismiss();
    //       this.toastService.info(error);
    //       console.error('login error', user, error);
    //       // this.snackbarService.error(
    //       //   $localize`Errore durante l' invio della segnalazione`
    //       // );
    //     },
    //   });
  }
}
