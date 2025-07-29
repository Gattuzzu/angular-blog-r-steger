import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

import { GlobalErrorHandlerService } from './core/errorHandler/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Wird wohl erst beim Authentifizieren benötigt. Noch nich implementiert
    provideAnimations(),
  ],
};

// function withComponentInputBinding(): import("@angular/router").RouterFeatures { // Ich weiss nicht warum ich diese Implementieren soll? Methode von @angular/router implementiert
//   throw new Error('Function not implemented.');
// }
