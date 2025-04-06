import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../components/service/Auth/auth.service';
import { ToastService } from '../../components/service/toast/toast.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  const userRoles: string[] = authService.getUserRoles();

  const requiredRoles: string[] = route.data?.['roles'] || [];

  const hasAccess = userRoles.some((role) => requiredRoles.includes(role));

  if (!hasAccess) {
    toastService.showWarning('You are not authorized to access this module.');
    if (state.url !== '/home/unauth') {
      router.navigate(['/home/unauth']);
    }
    return false;
  }

  return true;
};
