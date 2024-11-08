import { Component } from '@angular/core';
import { BulkUploadService, Vendor } from '../../../../swagger';
import { firstValueFrom } from 'rxjs';
import { Papa } from 'ngx-papaparse';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/prod/environment';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss',
})
export class VendorComponent {
  showLoader: boolean = false;
  vendors: Vendor[] = [];
  showUploadDialog: boolean = false;
  uploadedFiles: File[] = [];

  expectedColumnsVendorMaster: string[] = [
    'ID',
    'Name',
    'City',
    'State_Code',
    'Contact',
    'Phone_Number',
    'PAN',
    'GST_NO',
  ];
  totalRecords: number | undefined = undefined;
  isValidCSV: boolean = true;

  constructor(
    private bulkUploadService: BulkUploadService,
    private papa: Papa,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  async loadVendors() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.bulkUploadService.bulkUploadGetVendorMasterGet()
      );
      if (res && res.length) {
        this.vendors = res;
      }
    } catch (err: any) {}
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
    formData.append('fileType', 'Vendor_Master');

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
      this.loadVendors();
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

    const row = rowMatch ? parseInt(rowMatch[1], 10) : null;
    const message = messageMatch
      ? messageMatch[0]
      : 'An error occurred while processing the CSV file.';

    return { row, message };
  }

  downloadSampleFile() {
    let filePath = 'assets/sample/vendor_master.csv';
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
              this.validateColumns(csvColumns, this.expectedColumnsVendorMaster)
            ) {
              this.totalRecords = result.data.length - 1;
              console.log('CSV is valid for Vendor Master');
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
    const ratePerSecond = 800;

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
