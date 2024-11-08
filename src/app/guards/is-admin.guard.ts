import { CanActivateFn } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { inject } from '@angular/core';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const sharedService = inject(SharedService);
  let currentroleId: number | undefined = undefined;
  let activated: boolean = false;
  sharedService.currentRoleId.subscribe((roleId) => {
    currentroleId = parseInt(roleId?.toString()!);
    if (currentroleId == 10) {
      activated = true;
    } else {
      activated = false;
    }
  });
  return activated;
};
