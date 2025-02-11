import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../components/service/Auth/auth.service';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const userRoles: string[] = authService.getUserRoles();

  const requiredRoles: string[] = route.data?.['roles'] || [];

  const hasAccess = userRoles.some(role => requiredRoles.includes(role));

  if(!hasAccess){
    router.navigate(['/home/unauth']);
    return false;
  }

  return true;
};
