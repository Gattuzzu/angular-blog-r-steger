import { HttpInterceptorFn } from '@angular/common/http';
import { Authentication } from '../auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authentication = inject(Authentication);
  const authToken = authentication.token();
  // Neue Anfrage erstellen, falls das Token vorhanden ist
  const clonedRequest = authToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      })
    : req;
  return next(clonedRequest);
};
