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
import { ComplianceRequestManagementComponent } from './compliance-request-management/compliance-request-management.component';
import { CreateComplianceRequestComponent } from './compliance-request-management/create-compliance-request/create-compliance-request.component';
import { ComplianceComponent } from './reports/compliance/compliance.component';
import { VehicleOffRoadComponent } from './reports/vehicle-off-road/vehicle-off-road.component';
import { VehicleDetailsComponent } from './bulk-upload/vehicle/vehicle-details/vehicle-details.component';
import { BatteryRequestManagementComponent } from './battery-request-management/battery-request-management.component';
import { TyreRequestManagementComponent } from './tyre-request-management/tyre-request-management.component';
import { CreateBatteryRequestComponent } from './battery-request-management/create-battery-request/create-battery-request.component';
import { CreateTyreRequestComponent } from './tyre-request-management/create-tyre-request/create-tyre-request.component';
import { roleRedirectGuard } from '../guards/role-redirect.guard';
import { RequestsDumpComponent } from './reports/requests-dump/requests-dump.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [isLoggedIn],
    children: [
      {
        path: '',
        component: MaintenanceRequestManagementComponent,
        data: { title: 'Maintenance Requests' },
        canActivate: [roleRedirectGuard],
      },
      {
        path: 'compliance-requests',
        component: ComplianceRequestManagementComponent,
        data: { title: 'Compliance Requests' },
        canActivate: [roleRedirectGuard],
      },
      {
        path: 'battery-requests',
        component: BatteryRequestManagementComponent,
        data: { title: 'Battery Requests' },
        canActivate: [roleRedirectGuard],
      },
      {
        path: 'tyre-requests',
        component: TyreRequestManagementComponent,
        data: { title: 'Tyre Requests' },
        canActivate: [roleRedirectGuard],
      },
      {
        path: 'create-maintenance-request',
        component: CreateMaintenanceRequestComponent,
        data: { title: 'Create Maintenance Request' },
      },
      {
        path: 'create-compliance-request',
        component: CreateComplianceRequestComponent,
        data: { title: 'Create Compliance Request' },
      },
      {
        path: 'create-battery-request',
        component: CreateBatteryRequestComponent,
        data: { title: 'Create Battery Request' },
      },
      {
        path: 'create-tyre-request',
        component: CreateTyreRequestComponent,
        data: { title: 'Create Tyre Request' },
      },
      {
        path: 'reports/requests-dump',
        component: RequestsDumpComponent,
      },
      {
        path: 'reports/fastag',
        component: TransactionsComponent,
        data: { title: 'Transactions' },
      },
      {
        path: 'reports/compliance',
        component: ComplianceComponent,
        data: { title: 'Compliance Report' },
      },
      {
        path: 'reports/vehicle-off-road',
        component: VehicleOffRoadComponent,
        data: { title: 'Vehicle Off Road Report' },
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
        canActivate: [isLoggedIn],
      },
      {
        path: 'bulk-upload/vehicle/add-vehicle',
        component: VehicleDetailsComponent,
        canActivate: [isLoggedIn, isAdminGuard],
      },
      {
        path: 'bulk-upload/vehicle/vehicle-details/:Registration_No',
        component: VehicleDetailsComponent,
        canActivate: [isLoggedIn],
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
