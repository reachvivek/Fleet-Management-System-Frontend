import { Component } from '@angular/core';
import { BulkUploadService, ComplianceReport } from '../../../../swagger';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.scss',
})
export class ComplianceComponent {
  showLoader: boolean = false;
  dates: { fromDate: Date; toDate: Date } = {
    fromDate: new Date(new Date().setHours(0, 0, 0, 0)),
    toDate: new Date(new Date().setHours(23, 59, 59, 999)),
  };

  grandTotal: {
    fitnessNotUploaded: number;
    fitnessInvalid: number;
    fitnessLegal: number;
    fitnessScrap: number;
    fitnessValid: number;
    fitnessTotal: number;
    fitnessCompliant: number;
    roadTaxNotUploaded: number;
    roadTaxInvalid: number;
    roadTaxLegal: number;
    roadTaxScrap: number;
    roadTaxValid: number;
    roadTaxTotal: number;
    roadTaxCompliant: number;
  } = {
    fitnessNotUploaded: 0,
    fitnessInvalid: 0,
    fitnessLegal: 0,
    fitnessScrap: 0,
    fitnessValid: 0,
    fitnessTotal: 0,
    fitnessCompliant: 0,
    roadTaxNotUploaded: 0,
    roadTaxInvalid: 0,
    roadTaxLegal: 0,
    roadTaxScrap: 0,
    roadTaxValid: 0,
    roadTaxTotal: 0,
    roadTaxCompliant: 0,
  };

  records: ComplianceReport[] | any[] = [];
  columns: any = [
    { field: 'id', header: 'SR. NO.' },
    { field: 'zoneName', header: 'ZONE' },
    { field: 'regionName', header: 'REGION' },
    { field: 'fitnessNotUploaded', header: 'FITNESS NOT UPLOADED' },
    { field: 'fitnessInvalid', header: 'FITNESS INVALID' },
    { field: 'fitnessLegal', header: 'FITNESS LEGAL' },
    { field: 'fitnessScrap', header: 'FITNESS SCRAP' },
    { field: 'fitnessValid', header: 'FITNESS VALID' },
    { field: 'fitnessTotal', header: 'FITNESS TOTAL' },
    { field: 'fitnessCompliant', header: 'FITNESS COMPLIANT (%)' },
    { field: 'roadTaxNotUploaded', header: 'ROAD TAX NOT UPLOADED' },
    { field: 'roadTaxInvalid', header: 'ROAD TAX INVALID' },
    { field: 'roadTaxLegal', header: 'ROAD TAX LEGAL' },
    { field: 'roadTaxScrap', header: 'ROAD TAX SCRAP' },
    { field: 'roadTaxValid', header: 'ROAD TAX VALID' },
    { field: 'roadTaxTotal', header: 'ROAD TAX TOTAL' },
    { field: 'roadTaxCompliant', header: 'ROAD TAX COMPLIANT (%)' },
  ];

  constructor(private complianceReportService: BulkUploadService) {}

  ngOnInit(): void {
    this.loadComplianceReport();
  }

  async loadComplianceReport() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.complianceReportService.bulkUploadGetVehicleComplianceReportGet()
      );
      if (res && res.length) {
        // // Calculate Grand Total Vehicles, Off Road Vehicles, and Accident Vehicles
        res.sort((a: ComplianceReport, b: ComplianceReport) => {
          if (a.zoneName! < b.zoneName!) return -1;
          if (a.zoneName! > b.zoneName!) return 1;
          if (a.regionName! < b.regionName!) return -1;
          if (a.regionName! > b.regionName!) return 1;

          return 0; // If they are equal
        });
        res.forEach((entry: ComplianceReport | any, index: number) => {
          entry.id = index + 1;
          this.grandTotal.fitnessNotUploaded += entry.fitnessNotUploaded;
          this.grandTotal.fitnessInvalid += entry.fitnessInvalid;
          this.grandTotal.fitnessLegal += entry.fitnessLegal;
          this.grandTotal.fitnessScrap += entry.fitnessScrap;
          this.grandTotal.fitnessValid += entry.fitnessValid;
          this.grandTotal.fitnessTotal += entry.fitnessTotal;
          this.grandTotal.roadTaxNotUploaded += entry.roadTaxNotUploaded;
          this.grandTotal.roadTaxInvalid += entry.roadTaxInvalid;
          this.grandTotal.roadTaxLegal += entry.roadTaxLegal;
          this.grandTotal.roadTaxScrap += entry.roadTaxScrap;
          this.grandTotal.roadTaxValid += entry.roadTaxValid;
          this.grandTotal.roadTaxTotal += entry.roadTaxTotal;
        });
        this.records = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  generateExportName(): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Get the date in yyyy-MM-dd format
    const formattedTime = currentDate
      .toTimeString()
      .split(' ')[0]
      .replace(/:/g, '-'); // Get time in HH-mm-ss format
    return `ComplianceReport_${formattedDate}_${formattedTime}`; // Example output: export_2024-10-23_14-30-00.csv
  }
}
