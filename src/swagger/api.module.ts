import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AdminService } from './api/admin.service';
import { AuthService } from './api/auth.service';
import { BatteryRequestService } from './api/batteryRequest.service';
import { BulkUploadService } from './api/bulkUpload.service';
import { ComplianceRequestService } from './api/complianceRequest.service';
import { DatabaseManagementService } from './api/databaseManagement.service';
import { MaintenanceRequestService } from './api/maintenanceRequest.service';
import { TransactionService } from './api/transaction.service';
import { TyreRequestService } from './api/tyreRequest.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AdminService,
    AuthService,
    BatteryRequestService,
    BulkUploadService,
    ComplianceRequestService,
    DatabaseManagementService,
    MaintenanceRequestService,
    TransactionService,
    TyreRequestService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
