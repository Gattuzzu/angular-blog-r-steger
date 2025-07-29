import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ein unbekannter Fehler ist aufgetreten';

      if (error.error instanceof ErrorEvent) {
        // Client-seitiger Fehler
        errorMessage = `Fehler: ${error.error.message}`;
      } else {
        // Server-seitiger Fehler
        errorMessage = `Fehlercode: ${error.status}\nNachricht: ${error.message}`;
      }

      // Fehler protokollieren oder eine Benachrichtigung anzeigen
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }),
  );
};
