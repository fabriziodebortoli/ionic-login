import { Route } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const APP_ROUTES: Route[] = [
  {
    canActivate: [AuthGuard],
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then((m) => m.AUTH_ROUTES),
  },
];
