export * from './admin.service';
import { AdminService } from './admin.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './bulkUpload.service';
import { BulkUploadService } from './bulkUpload.service';
export * from './databaseManagement.service';
import { DatabaseManagementService } from './databaseManagement.service';
export * from './maintenanceRequest.service';
import { MaintenanceRequestService } from './maintenanceRequest.service';
export * from './transaction.service';
import { TransactionService } from './transaction.service';
export const APIS = [AdminService, AuthService, BulkUploadService, DatabaseManagementService, MaintenanceRequestService, TransactionService];
