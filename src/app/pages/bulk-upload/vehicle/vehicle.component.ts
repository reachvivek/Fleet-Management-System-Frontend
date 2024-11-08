import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BulkUploadService, VehicleForDashboard } from '../../../../swagger';
import { Papa } from 'ngx-papaparse';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/prod/environment';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {
  showLoader: boolean = false;
  roleId!: number;
  vehicles: VehicleForDashboard[] = [];
  showUploadDialog: boolean = false;
  uploadedFiles: File[] = [];
  expectedColumnsVehicleMaster: string[] = [
    'Vehicle_Wheeler',
    'Registration_No',
    'Vehicle_Scrap',
    'Active',
    'Owner_Name',
    'Asset_Type',
    'Chasis_No',
    'Registration_Date',
    'Manufacturer',
    'Model_Name',
    'Engine_Number',
    'Hypothecation_Branch',
    'Asset_No',
    'Make_Year',
    'Hypothecation_Bank_Name',
    'Vehicle_Image',
    'RC_Document',
    'Date_Of_Last_Service',
    'Cubic_Capacity',
    'Fuel_Capacity',
    'Os_Norms',
    'Adblue_Capacity',
    'Ground_Clearance',
    'Fuel_Type',
    'Seating_Capacity',
    'Inaccessible_From_Outside_The_Van',
    'CCTV_Count',
    'Fa_Code_For_CCTV1',
    'Fa_Code_For_CCTV2',
    'Fa_Code_For_CCTV3',
    'Fa_Code_For_CCTV4',
    'Wire_Mesh',
    'Fire_Exting_Uisher',
    'Fire_Exting_Uisher_Capacity',
    'Mha_Compliant',
    'Gps_Device_Make',
    'Cassette_Provision',
    'Rear_Entry_To_Vault',
    'CCTV_Vendor',
    'Panic_Switch',
    'Auto_Dialer',
    'Puncture_Kit',
    'Electronic',
    'Emergency_Light',
    'Speed_Governer',
    'Fa_Code_For_GPS',
    'Immobilizer',
    'Branding',
    'Jack_And_Lever',
    'Safety_Triangle',
    'Business',
    'DVC',
    'Tool_kit',
    'First_Aid',
    'Off_Road',
    'Offroad_Date',
    'Current_Km_Run',
    'Offroad_Reason',
    'Card_Number',
    'Linked_Mobile',
    'Petrocard_Holder_Mobile_Number',
    'Custodian_Designation',
    'Fastag_Serial_Number',
    'Company_Name',
    'Holder_Name',
    'Petrocard_Holder_Employee_Id',
    'Fastag_Company_Name',
    'Search_Battery',
    'Add_Battery',
    'Make',
    'Serial_Number',
    'Warranty_In_Months',
    'Battery_Cost',
    'Speed_Factor',
    'MODEL',
    'Invoice_Date',
    'Date_Of_Fitting',
    'Vendor_Name',
    'Vehicle_Type',
    'Tyre1_Manufacturer',
    'Tyre1_Serial_Number',
    'Tyre1_Size',
    'Tyre1_Life_In_KMs',
    'Tyre1_Cost',
    'Tyre1_Make',
    'Tyre1_Type',
    'Tyre1_Date_Of_Fitment',
    'Tyre1_Life_In_Months',
    'Tyre1_Vendor_Name',
    'Tyre2_Manufacturer',
    'Tyre2_Serial_Number',
    'Tyre2_Size',
    'Tyre2_Life_In_KMs',
    'Tyre2_Cost',
    'Tyre2_Make',
    'Tyre2_Type',
    'Tyre2_Date_Of_Fitment',
    'Tyre2_Life_In_Months',
    'Tyre2_Vendor_Name',
    'Tyre3_Manufacturer',
    'Tyre3_Serial_Number',
    'Tyre3_Size',
    'Tyre3_Life_In_KMs',
    'Tyre3_Cost',
    'Tyre3_Make',
    'Tyre3_Type',
    'Tyre3_Date_Of_Fitment',
    'Tyre3_Life_In_Months',
    'Tyre3_Vendor_Name',
    'Tyre4_Manufacturer',
    'Tyre4_Serial_Number',
    'Tyre4_Size',
    'Tyre4_Life_In_KMs',
    'Tyre4_Cost',
    'Tyre4_Make',
    'Tyre4_Type',
    'Tyre4_Date_Of_Fitment',
    'Tyre4_Life_In_Months',
    'ASTyre4_Vendor_Name',
    'Tyre5_Manufacturer',
    'Tyre5_Serial_Number',
    'Tyre5_Size',
    'Tyre5_Life_In_KMs',
    'Tyre5_Cost',
    'Tyre5_Make',
    'Tyre5_Type',
    'Tyre5_Date_Of_Fitment',
    'Tyre5_Life_In_Months',
    'Tyre5_Vendor_Name',
    'Hub_Name',
    'Branch_Name',
    'Zone_Name',
    'Region_Name',
    'vehicleFrontImage',
    'Vehicle_Rear_Image',
    'Vehicle_Right_Image',
    'Vehicle_Left_Image',
    'Dashboard_Image',
    'Vault_Image',
    'Front_Right_Tyre_Image',
    'Front_Left_Tyre_Image',
    'Rear_Left_Tyre_Image',
    'Rear_Right_Tyre_Image',
    'Battery_With_Serial_Number_Image',
    'RC_Front_Side_Image',
    'RC_Back_Side_Image',
    'Fitness_Image',
    'Insurance_Image',
    'RoadTax_Image',
    'Goods_Permit_Image',
    'National_Permit_Image',
    'PUC_Image',
    'Chassis_Number_Plate_Image',
  ];
  totalRecords: number | undefined = undefined;
  isValidCSV: boolean = true;

  constructor(
    private bulkUploadService: BulkUploadService,
    private papa: Papa,
    private messageService: MessageService,
    private http: HttpClient,
    public router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.currentRoleId.subscribe((roleId) => {
      this.roleId = parseInt(roleId?.toString()!);
      if (this.roleId) {
        this.loadVehicles();
      }
    });
  }

  editVehicle(Registration_No: string) {
    this.router.navigate([
      'bulk-upload/vehicle/vehicle-details',
      Registration_No,
    ]);
  }

  async loadVehicles() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.bulkUploadService.bulkUploadGetVehicleMasterGet()
      );
      if (res && res.length) {
        this.vehicles = res;
      }
    } catch (err: any) {
      console.error(err.error);
    }
    this.showLoader = false;
  }

  toggleUploadDialog() {
    this.showUploadDialog = !this.showUploadDialog;
  }

  async onUpload(event: any) {
    this.showLoader = true;
    this.uploadedFiles = [];

    const formData = new FormData();
    formData.append('file', event.files[0]);
    formData.append('fileType', 'Vehicle_Master');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')!}`,
    });
    headers.append('Content-Type', 'multipart/form-data');

    // Now you can send formData to your API using HttpClient
    try {
      const response: any = await firstValueFrom(
        this.http.post(
          `${environment.BASE_PATH}/BulkUpload/CSVFile`,
          formData,
          {
            headers,
          }
        )
      );

      if (response && response.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Uploaded Successfully',
          detail: 'File Uploaded Successfully',
          life: 5000,
        });
      }

      this.showLoader = false;
      event.files = [];
      this.toggleUploadDialog();
      this.clearUpload();
      this.loadVehicles();
    } catch (error: any) {
      const { row, message } = this.extractEssentialErrorInfo(error.error);

      this.messageService.add({
        severity: 'error',
        summary: `Error occurred at row: ${row}`,
        detail: `${message}`,
        sticky: true,
        closable: true,
        life: 20000,
      });

      console.error('Error uploading files', error);
      this.showLoader = false;
    }
  }

  extractEssentialErrorInfo(error: string): {
    row: number | null;
    message: string;
  } {
    const rowMatch = error.match(/row (\d+)/);
    const messageMatch = error.match(/(Invalid .*?)/);

    const row = rowMatch ? parseInt(rowMatch[1], 10) + 1 : null;
    const message = messageMatch
      ? messageMatch[0]
      : 'An error occurred while processing the CSV file.';

    return { row, message };
  }

  downloadSampleFile() {
    let filePath = 'assets/sample/vehicle_master_sample.csv';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop()!;
    link.click();
  }

  async showCSVDetails(event: any) {
    this.messageService.clear();
    this.totalRecords = undefined;
    this.showLoader = true;
    let file = event.files[0];
    if (file) {
      const reader = new FileReader();

      // Wrap the reader in a promise
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });

      await new Promise<void>((resolve, reject) => {
        this.papa.parse(fileContent, {
          header: true,
          complete: (result) => {
            // Subtracting 1 to exclude the header row
            const csvColumns = result.meta.fields;
            if (
              this.validateColumns(
                csvColumns,
                this.expectedColumnsVehicleMaster
              )
            ) {
              this.totalRecords = result.data.length - 1;
              console.log('CSV is valid for Vehicle Master');
              this.isValidCSV = true;
            } else {
              console.log('CSV is invalid');
              this.isValidCSV = false;
              this.totalRecords = undefined;
            }
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    }
    this.showLoader = false;
  }

  validateColumns(csvColumns: string[], expectedColumns: string[]): boolean {
    // Convert both arrays to lowercase for case-insensitive comparison
    const lowerCaseCsvColumns = csvColumns.map((col) =>
      col.trim().toLowerCase()
    );
    const lowerCaseExpectedColumns = expectedColumns.map((col) =>
      col.trim().toLowerCase()
    );

    // Check for duplicate columns in the CSV
    const csvColumnSet = new Set<string>();
    for (const col of lowerCaseCsvColumns) {
      if (csvColumnSet.has(col)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Duplicate Column Found',
          detail: `Duplicate column found in CSV: ${col}`,
          sticky: true,
          closable: true,
          life: 20000,
        });
        return false;
      }
      csvColumnSet.add(col);
    }

    // Check if all expected columns are present in the CSV in the correct order
    for (let i = 0; i < lowerCaseExpectedColumns.length; i++) {
      const expectedCol = lowerCaseExpectedColumns[i];
      if (!csvColumnSet.has(expectedCol)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Column Missing',
          detail: `Expected column '${expectedColumns[i]}' missing in CSV`,
          sticky: true,
          closable: true,
          life: 20000,
        });
        return false;
      }

      // Check position (order) of columns
      const csvIndex = lowerCaseCsvColumns.indexOf(expectedCol);
      if (csvIndex !== i) {
        this.messageService.add({
          severity: 'error',
          summary: 'Wrong Format',
          detail: `Expected column '${expectedColumns[i]}' at position ${
            i + 1
          }, but found at position ${csvIndex + 1}`,
          sticky: true,
          closable: true,
          life: 20000,
        });
        return false;
      }
    }

    return true;
  }

  estimateUploadTime(totalRecords: number): string {
    // Calculate records per second
    const ratePerSecond = 600;

    // Estimate time for totalRecords
    const estimatedTimeInSeconds = totalRecords / ratePerSecond;
    const estimatedMinutes = Math.floor(estimatedTimeInSeconds / 60);
    const estimatedSeconds = Math.round(estimatedTimeInSeconds % 60);

    // Create a message string based on the estimated time
    if (estimatedMinutes === 0) {
      return `Upload Time : ${estimatedSeconds} seconds`;
    } else if (estimatedMinutes === 1) {
      return `Upload Time : 1 minute and ${estimatedSeconds} seconds`;
    } else {
      return `Upload Time : ${estimatedMinutes} minutes and ${estimatedSeconds} seconds`;
    }
  }

  clearUpload(event: any = null) {
    this.isValidCSV = true;
    this.totalRecords = undefined;
  }
}
