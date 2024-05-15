import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = new Router();
  if (req.url.includes('employee/login') || req.url.includes('/verifyempid')) {
    return next(req);
  }

  const token = sessionStorage.getItem('token');
  const newCLone = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(newCLone).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 408) {
        router.navigate(['/login']);
      }
      return throwError(error);
    }),
  );
};
