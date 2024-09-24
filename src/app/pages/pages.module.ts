import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { LoaderComponent } from '../standalone/loader/loader.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { MaintenanceRequestManagementComponent } from './maintenance-request-management/maintenance-request-management.component';
// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CreateMaintenanceRequestComponent } from './maintenance-request-management/create-maintenance-request/create-maintenance-request.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { UserManagementComponent } from './user-management/user-management.component';
import { VehicleComponent } from './bulk-upload/vehicle/vehicle.component';
import { VendorComponent } from './bulk-upload/vendor/vendor.component';
import { SystemPartComponent } from './bulk-upload/system-part/system-part.component';
import { HistoryComponent } from './bulk-upload/history/history.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RemoveParenthesisTextPipe } from '../pipes/remove-parenthesis-text.pipe';
import { TreeModule } from 'primeng/tree';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    SidebarComponent,
    LayoutComponent,
    MaintenanceRequestManagementComponent,
    CreateMaintenanceRequestComponent,
    UserManagementComponent,
    VehicleComponent,
    VendorComponent,
    SystemPartComponent,
    HistoryComponent,
    TransactionsComponent,
    RemoveParenthesisTextPipe,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PagesRoutingModule,
    LoaderComponent,
    FormsModule,
    ToastModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    CardModule,
    FieldsetModule,
    FileUploadModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    StepperModule,
    TagModule,
    TooltipModule,
    TreeModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class PagesModule {}
