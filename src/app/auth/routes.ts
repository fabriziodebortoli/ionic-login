import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((mod) => mod.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((mod) => mod.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.page').then(
        (mod) => mod.ForgotPasswordPage
      ),
  },
];
