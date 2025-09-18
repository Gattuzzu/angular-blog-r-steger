import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { provideGlobalErrorHandler } from './core/errorHandler/provider';
import { authConfig } from './core/auth/auth.config';
import { provideAuth, authInterceptor } from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor(), errorInterceptor]),
    ),
    provideGlobalErrorHandler(),
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Wird wohl erst beim Authentifizieren benötigt. Noch nicht implementiert
    provideAnimations(),
    provideAuth(authConfig),
  ],
};

// function withComponentInputBinding(): import("@angular/router").RouterFeatures { // Ich weiss nicht warum ich diese Implementieren soll? Methode von @angular/router implementiert
//   throw new Error('Function not implemented.');
// }
