import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

export const adminGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.user()?.rol === 'ROLE_ADMIN') {
    return true;
  }

  return router.createUrlTree(['/inicio']);
};
