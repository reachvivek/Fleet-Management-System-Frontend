import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MaintenanceRequestManagementComponent } from './maintenance-request-management/maintenance-request-management.component';
import { CreateMaintenanceRequestComponent } from './maintenance-request-management/create-maintenance-request/create-maintenance-request.component';
import { isLoggedIn } from '../guards/isLoggedIn.guard';
import { UserManagementComponent } from './user-management/user-management.component';
import { isAdminGuard } from '../guards/is-admin.guard';
import { VehicleComponent } from './bulk-upload/vehicle/vehicle.component';
import { VendorComponent } from './bulk-upload/vendor/vendor.component';
import { SystemPartComponent } from './bulk-upload/system-part/system-part.component';
import { HistoryComponent } from './bulk-upload/history/history.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: MaintenanceRequestManagementComponent,
        data: { title: 'Maintenance Requests' },
        canActivate: [isLoggedIn],
      },
      {
        path: 'create-request',
        component: CreateMaintenanceRequestComponent,
        data: { title: 'Create Maintenance Request' },
        canActivate: [isLoggedIn],
      },
      {
        path: 'reports/fastag',
        component: TransactionsComponent,
        data: { title: 'Transactions' },
        canActivate: [isLoggedIn],
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        data: { title: 'User Management' },
        canActivate: [isLoggedIn, isAdminGuard],
      },
      {
        path: 'bulk-upload/vehicle',
        component: VehicleComponent,
        data: { title: 'Vehicle Management' },
        canActivate: [isLoggedIn, isAdminGuard],
      },
      {
        path: 'bulk-upload/vendor',
        component: VendorComponent,
        data: { title: 'Vendor Management' },
        canActivate: [isLoggedIn, isAdminGuard],
      },
      {
        path: 'bulk-upload/system-part',
        component: SystemPartComponent,
        data: { title: 'System Part Management' },
        canActivate: [isLoggedIn, isAdminGuard],
      },
      {
        path: 'bulk-upload/history',
        component: HistoryComponent,
        data: { title: 'History' },
        canActivate: [isLoggedIn, isAdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
