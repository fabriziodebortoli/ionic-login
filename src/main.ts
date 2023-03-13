import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import {
  PreloadAllModules,
  provideRouter,
  withPreloading
} from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { AuthGuard } from './app/auth/auth.guard';
import { AuthService } from './app/auth/auth.service';
import { IonLoaderService } from './app/core/services/loading.service';
import { IonToastService } from './app/core/services/toast.service';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, IonicModule.forRoot()),
    {
      provide: 'env',
      useValue: environment,
    },
    AuthService,
    AuthGuard,
    IonLoaderService,
    IonToastService,
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules)
      // withDebugTracing()
    ),
  ],
}).catch((err) => console.log(err));
