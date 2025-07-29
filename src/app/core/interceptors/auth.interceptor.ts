import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');
  // Neue Anfrage erstellen, falls das Token vorhanden ist
  const clonedRequest = authToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      })
    : req;
  return next(clonedRequest);
};
