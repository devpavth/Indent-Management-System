import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = new Router();

  // Check if the request should bypass the common token
  const bypassToken = req.headers.get('Bypass-Common-Token');

  if (
    req.url.includes('employee/login') ||
    req.url.includes('/verifyempid') ||
    bypassToken
  ) {
    // Remove the custom header before forwarding the request
    const modifiedReq = req.clone({
      headers: req.headers.delete('Bypass-Common-Token'),
    });
    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 408) {
          router.navigate(['/login']);
        }
        return throwError(error);
      }),
    );
  }

  // Apply the common token
  const token = sessionStorage.getItem('token');
  const newClone = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(newClone).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 408) {
        router.navigate(['/login']);
      }
      return throwError(error);
    }),
  );
};
