import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

export const roleRedirectGuard: CanActivateFn = (route, state) => {
  const sharedService = inject(SharedService);
  const router = inject(Router);

  // Use the getter to get the current role ID
  const currentRoleId = sharedService.currentRole;

  const restrictedRoutes = route.routeConfig?.path; // Get the current route path

  // If RoleId 4 (HFM Tyre and Battery) is trying to access restricted routes
  if (
    currentRoleId === 4 &&
    (restrictedRoutes === 'maintenance-requests' ||
      restrictedRoutes === 'compliance-requests' ||
      restrictedRoutes === 'dashboard' ||
      restrictedRoutes === '')
  ) {
    // Redirect to a different valid route like 'battery-requests'
    return router.createUrlTree(['dashboard/battery-requests']);
  }

  // If RoleId 3 (HFM) is trying to access Tyre and Battery components
  if (
    currentRoleId === 3 &&
    (restrictedRoutes === 'tyre-requests' ||
      restrictedRoutes === 'battery-requests')
  ) {
    // Redirect to a different valid route like 'maintenance-requests'
    return router.createUrlTree(['dashboard']);
  }

  // Allow access for other roles or routes that don't need restrictions
  return true;
};
