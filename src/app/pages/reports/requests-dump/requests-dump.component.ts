import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AdminService,
  BatteryReportDto,
  BatteryRequestService,
  BulkUploadService,
  ComplianceReportDto,
  ComplianceRequestService,
  FiltersDto,
  MaintenanceReportDto,
  MaintenanceRequestService,
  TyreReportDto,
  TyreRequestService,
  VendorForSelectDto,
} from '../../../../swagger';
import { SharedService } from '../../../services/shared.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-requests-dump',
  templateUrl: './requests-dump.component.html',
  styleUrl: './requests-dump.component.scss',
})
export class RequestsDumpComponent {
  showLoader: boolean = false;
  showFilterDialog: boolean = false;
  roleId: number | undefined = undefined;
  active_index: number = 1;

  tickets:
    | MaintenanceReportDto[]
    | ComplianceReportDto[]
    | BatteryReportDto[]
    | TyreReportDto[] = [];
  filteredTickets: any[] = [];

  initialSelectedBranches: Set<string> = new Set(); // Store initial selections
  initialSelectedHubs: Set<string> = new Set(); // Store initial selections
  filters: TreeNode[] = [];
  selectedZones: TreeNode[] = [];

  vendors: VendorForSelectDto[] = [];

  rangeDates = [];

  isFilterApplied: boolean = false;

  filter: {
    fromDate: string | undefined;
    toDate: string | undefined;
  } = { fromDate: '', toDate: '' };

  columnsForMaintenanceReport = [
    { header: 'Service_Id', field: 'id' },
    { header: 'Created_At', field: 'createdOn' },
    { header: 'Status_Name', field: 'currentStage' },
    { header: 'Status_Updated_Date', field: 'updatedOn' },
    { header: 'Vehicle_Off_Road_Status', field: 'isVehicleOffRoad' },
    { header: 'Vehicle_Registration_Number', field: 'registrationNumber' },
    { header: 'Date_Of_Last_Service', field: 'dateOfLastService' },
    { header: 'Service_Request_Type', field: 'serviceRequestType' },
    { header: 'Vendor_Name_Quotation_Uploaded', field: 'quotationAttachment' },
    { header: 'Vendor_Name_Invoice_Uploaded', field: 'invoiceAttachment' },
    { header: 'View_Quotation', field: 'quotationAttachment' }, // Assuming same field as Vendor_Name_Quotation_Uploaded
    { header: 'Estimated_Cost', field: 'totalEstimatedCost' },
    { header: 'Requester_Comment', field: 'overallComment' },
    { header: 'Actual_Cost_With_GST', field: 'invoiceTotalEstimatedCost' },
    { header: 'Actual_Service_Date', field: 'serviceDate' },
    { header: 'Upload_JobCard_Pic', field: 'jobcardAttachment' },
    { header: 'Upload_Invoice_Pic', field: 'invoiceAttachment' },
    { header: 'Mode_Of_Payment', field: 'modeOfPayment' },
    { header: 'Invoice_Date', field: 'invoiceDate' },
    { header: 'Invoice_No', field: 'invoiceNumber' },
    { header: 'Hub_Name', field: 'hub' },
    { header: 'Branch_Name', field: 'branch' },
    { header: 'Zone_Name', field: 'zone' },
    { header: 'Region_Name', field: 'region' },
    { header: 'GST_Or_Non_GST', field: 'invoiceType' },
    { header: 'Rejection_Comment', field: 'rejectionComment' },
    // { header: 'Make_Year', field: 'manufacturer' }, // Assuming 'manufacturer' represents the make
    { header: 'Manufacturer', field: 'manufacturer' },
    { header: 'Model_Name', field: 'model' },
    { header: 'UTR_Number', field: 'utrNumber' },
    { header: 'Payment_Date', field: 'paymentDate' },
  ];

  columnsForComplianceReport = [
    { header: 'Service_Id', field: 'id' },
    { header: 'Created_At', field: 'createdOn' },
    { header: 'Status_Name', field: 'currentStage' },
    { header: 'Status_Updated_Date', field: 'updatedOn' },
    // { header: 'Type', field: 'typeOfCompliance' },
    { header: 'Vehicle_Registration_Number', field: 'registrationNumber' },
    { header: 'Manufacturer', field: 'manufacturer' },
    { header: 'Vehicle_Model', field: 'model' },
    // {
    //   header: 'Off_Road_Status_Change_Date_To_Show',
    //   field: 'isVehicleOffRoad',
    // }, // Assuming this field indicates off-road status
    { header: 'Vehicle_Off_Road_Status', field: 'isVehicleOffRoad' }, // Assuming status is the vehicle status
    { header: 'Invoice_Actual_Cost', field: 'invoiceAmount' },
    { header: 'Vendor_name_quotation_uploaded', field: 'vendorName' },
    { header: 'Branch', field: 'branch' },
    { header: 'Comment', field: 'overallComment' },
    { header: 'Type_Of_Compliance', field: 'typeOfCompliance' },
    { header: 'Renewal_Fees', field: 'renewalFees' },
    { header: 'Agent_Fees', field: 'agentFees' },
    { header: 'GST', field: 'gstAmount' },
    { header: 'Misc_Amount', field: 'miscAmount' },
    { header: 'Penalty_Fees', field: 'penaltyFees' },
    { header: 'Estimated_Cost_With_GST', field: 'finalAmount' }, // Assuming finalAmount is the total estimated cost
    { header: 'Quotation_Pic', field: 'quotationAttachment' },
    // { header: 'Approve_UpdatedBy', field: 'vendorName' }, // Assuming vendorName is the updated by field
    { header: 'Vendor_name_invoice_uploaded', field: 'vendorName' }, // Assuming vendorName is used for invoice upload
    { header: 'Mode_Of_Payment', field: 'modeOfPayment' },
    { header: 'Hub_Name', field: 'hub' },
    { header: 'Branch_Name', field: 'branch' },
    { header: 'Zone_Name', field: 'zone' },
    { header: 'Region_Name', field: 'region' },
    { header: 'Invoice_Pic', field: 'invoiceAttachment' },
    { header: 'Invoice_Date', field: 'invoiceDate' },
    { header: 'Invoice_Number', field: 'invoiceNumber' },
    { header: 'DIV', field: 'companyName' }, // Assuming companyName corresponds to DIV
    { header: 'GST_OR_NON_GST', field: 'invoiceType' },
    { header: 'Rejection_Comment', field: 'rejectionComment' },
    { header: 'UTR_Number', field: 'utrNumber' },
    { header: 'Payment_Date', field: 'paymentDate' },
    { header: 'From_Date', field: 'fromDate' },
    { header: 'To_Date', field: 'toDate' },
  ];

  columnsForBatteryReport = [
    { header: 'Service_Id', field: 'id' },
    { header: 'Created_At', field: 'createdOn' },
    { header: 'Status_Name', field: 'currentStage' },
    { header: 'Status_Updated_Date', field: 'updatedOn' },
    { header: 'Vehicle_Off_Road_Status', field: 'isVehicleOffRoad' },
    // { header: 'Type', field: 'type' },
    { header: 'Vehicle_Registration_Number', field: 'registrationNumber' },
    // { header: 'Date_Of_Last_Service', field: 'lastServiceDate' },
    { header: 'View_Quotation', field: 'quotationAttachment' },
    { header: 'Estimated_Battery_Cost', field: 'new_battery_total' },
    { header: 'Battery_Scrap_Value', field: 'battery_scrap_value' },
    { header: 'Battery_Make', field: 'battery_Make' },
    { header: 'Battery_Model', field: 'battery_Model' },
    { header: 'Warranty_In_Months', field: 'battery_Warranty' },
    { header: 'Serial_Number', field: 'battery_Serial_Number' },
    { header: 'Fitment_Date', field: 'fitmentDate' },
    { header: 'Overall_Comment', field: 'overallComment' },
    { header: 'Battery_Type', field: 'Actual_Battery_Type' },
    { header: 'Battery_Voltage', field: 'Actual_Battery_Voltage' },
    { header: 'Battery_Amp', field: 'Actual_Battery_Amp' },
    { header: 'Invoice_Date', field: 'Actual_Battery_Invoice_Date' },
    {
      header: 'Battery_Serial_Number_Invoice',
      field: 'Actual_Battery_Serial_Number',
    },
    {
      header: 'Vendor_Name_Quotation_Uploaded',
      field: 'battery_Vendor_Name',
    },
    { header: 'Invoice_Amount', field: 'Invoice_Total' },
    {
      header: 'Vendor_Name_Invoice_Uploaded',
      field: 'actual_Battery_Vendor_Name',
    },
    { header: 'Battery_Quantity', field: 'Actual_Battery_Qty' },
    { header: 'Fitting Date', field: 'actual_Battery_Invoice_Date' },
    { header: 'Invoice_Number', field: 'Actual_Battery_Invoice_Number' },
    { header: 'Upload_Invoice', field: 'invoiceAttachment' },
    { header: 'Upload_Warranty', field: 'warrantyAttachment' },
    { header: 'Date_Of_Purchase', field: 'purchaseDate' },
    { header: 'Mode_Of_Payment', field: 'ModeOfPayment' },
    { header: 'Hub_Name', field: 'hub' },
    { header: 'Branch_Name', field: 'branch' },
    { header: 'Zone_Name', field: 'zone' },
    { header: 'Region_Name', field: 'region' },
    { header: 'GST_OR_NON_GST', field: 'InvoiceType' },
    { header: 'Rejection_Comment', field: 'rejectionComment' },
    { header: 'UTR_Number', field: 'utrNumber' },
    { header: 'Payment_Date', field: 'paymentDate' },
  ];

  columnsForTyreReport = [
    { header: 'Service_Id', field: 'id' },
    { header: 'Created_At', field: 'createdOn' },
    { header: 'Status_Name', field: 'currentStage' },
    { header: 'Status_Updated_Date', field: 'updatedOn' },
    { header: 'Vehicle_Off_Road_Status', field: 'isVehicleOffRoad' },
    // { header: 'Type', field: 'NA' }, // Assuming "Type" can be derived from additional logic
    { header: 'Vehicle_Registration_Number', field: 'registrationNumber' },
    { header: 'Vendor_name_quotation_upload', field: 'selectedVendorName' },
    { header: 'View_Quotation', field: 'quotationAttachment' },
    { header: 'Mode_Of_Payment', field: 'modeOfPayment' },
    { header: 'Estimated_Tyre_Cost_With_GST', field: 'EstimatedTyreCost' },
    { header: 'Quantity', field: 'TyreQuantity' },
    { header: 'Total_Tyre_Cost_With_GST', field: 'EstimatedTyreTotal' },
    { header: 'Tyre_1_Manufacturer', field: 'SelectedTyre1Manufacturer' },
    { header: 'Tyre_1_Life', field: 'SelectedTyre1FitmentDate' },
    { header: 'Tyre_2_Manufacturer', field: 'SelectedTyre2Manufacturer' },
    { header: 'Tyre_2_Life', field: 'SelectedTyre2FitmentDate' },
    { header: 'Tyre_3_Manufacturer', field: 'SelectedTyre3Manufacturer' },
    { header: 'Tyre_3_Life', field: 'SelectedTyre3FitmentDate' },
    { header: 'Tyre_4_Manufacturer', field: 'SelectedTyre4Manufacturer' },
    { header: 'Tyre_4_Life', field: 'SelectedTyre4FitmentDate' },
    { header: 'Tyre_5_Manufacturer', field: 'SelectedTyre5Manufacturer' },
    { header: 'Tyre_5_Life', field: 'SelectedTyre5FitmentDate' },
    { header: 'invoiceAmount', field: 'InvoiceTotal' },
    { header: 'Vendor_name_invioce_uploaded', field: 'selectedVendorName' },
    { header: 'Hub_Name', field: 'hub' },
    { header: 'Branch_Name', field: 'branch' },
    { header: 'Zone_Name', field: 'zone' },
    { header: 'Region_Name', field: 'region' },
    { header: 'Request_Creation_Comment', field: 'OverallComment' },
    { header: 'Invoice_Pic', field: 'invoiceAttachment' },
    { header: 'Invoice_Date', field: 'InvoiceDate' },
    { header: 'invoiceNo', field: 'InvoiceNumber' },
    { header: 'DIV', field: 'NA' }, // This might be a placeholder or missing
    { header: 'GST_OR_NON_GST', field: 'InvoiceType' },
    { header: 'Rejection_Comment', field: 'rejectionComment' },
    { header: 'UTR_Number', field: 'utrNumber' },
    { header: 'Payment_Date', field: 'paymentDate' },
  ];

  maxDate = new Date();

  constructor(
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private adminService: AdminService,
    private commonService: BulkUploadService,
    private maintenanceService: MaintenanceRequestService,
    private complianceService: ComplianceRequestService,
    private batteryService: BatteryRequestService,
    private tyreService: TyreRequestService
  ) {}

  ngOnInit(): void {
    this.sharedService.currentRoleId.subscribe((roleId) => {
      this.roleId = parseInt(roleId?.toString()!);
      if (this.roleId) {
        this.loadVendorNames();
        this.loadRequests();
      }
    });
  }

  loadRequests(index: number = this.active_index) {
    this.tickets = this.filteredTickets = [];
    this.isFilterApplied = false;
    this.selectedZones = this.getAllNodes(this.filters);
    switch (index) {
      case 1:
        this.active_index = index;
        this.loadMaintenanceRequests();
        break;
      case 2:
        this.active_index = index;
        this.loadComplianceRequests();
        break;
      case 3:
        this.active_index = index;
        this.loadBatteryRequests();
        break;
      case 4:
        this.active_index = index;
        this.loadTyreRequests();
        break;
      default:
        return;
    }
  }

  async loadMaintenanceRequests() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceService.maintenanceRequestGetMaintenanceRequestsReportPost(
          this.roleId,
          this.filter.fromDate || undefined,
          this.filter.toDate || undefined
        )
      );
      this.tickets = this.filteredTickets = [...res];
      this.tickets.forEach((item: MaintenanceReportDto) => {
        if (item.createdOn) {
          item.createdOn = new Date(item.createdOn);
        }
        if (item.updatedOn) {
          item.updatedOn = new Date(item.updatedOn);
        }
        this.vendors.filter((entry: VendorForSelectDto) => {
          if (entry.id == item.vendorId) {
            item.vendorName = entry.name;
          }
        });
      });
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadComplianceRequests() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestGetComplianceRequestsReportPost(
          this.roleId,
          this.filter.fromDate || undefined,
          this.filter.toDate || undefined
        )
      );
      this.tickets = this.filteredTickets = [...res];
      this.tickets.forEach((item: MaintenanceReportDto) => {
        if (item.createdOn) {
          item.createdOn = new Date(item.createdOn);
        }
        if (item.updatedOn) {
          item.updatedOn = new Date(item.updatedOn);
        }
        this.vendors.filter((entry: VendorForSelectDto) => {
          if (entry.id == item.vendorId) {
            item.vendorName = entry.name;
          }
        });
      });
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadBatteryRequests() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryRequestsReportPost(
          this.roleId,
          this.filter.fromDate || undefined,
          this.filter.toDate || undefined
        )
      );
      this.tickets = this.filteredTickets = [...res];
      this.tickets.forEach((item: BatteryReportDto) => {
        if (item.createdOn) {
          item.createdOn = new Date(item.createdOn);
        }
        if (item.updatedOn) {
          item.updatedOn = new Date(item.updatedOn);
        }
        this.vendors.filter((entry: VendorForSelectDto) => {
          if (entry.id == item.actual_Battery_Vendor_Id) {
            item.actual_Battery_Vendor_Name = entry.name;
          }
        });
      });
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadTyreRequests() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreRequestsReportPost(
          this.roleId,
          this.filter.fromDate || undefined,
          this.filter.toDate || undefined
        )
      );
      this.tickets = this.filteredTickets = [...res];
      this.tickets.forEach((item: TyreReportDto) => {
        if (item.createdOn) {
          item.createdOn = new Date(item.createdOn);
        }
        if (item.updatedOn) {
          item.updatedOn = new Date(item.updatedOn);
        }
        this.vendors.filter((entry: VendorForSelectDto) => {
          if (entry.id == item.selectedVendorId) {
            item.selectedVendorName = entry.name;
          }
          if (entry.id == item.actualTyreVendorId) {
            item.actualTyreVendorName = entry.name;
          }
        });
      });
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadVendorNames() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.commonService.bulkUploadGetAllVendorsGet()
      );
      if (res && res.length) {
        this.vendors = res;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  formatDate(date: Date | null): string | undefined {
    if (!date) return undefined;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  applyDates() {
    this.filter.fromDate = this.formatDate(this.rangeDates[0]);
    this.filter.toDate = this.formatDate(this.rangeDates[1]);

    if (this.rangeDates[1] != null) this.loadRequests();
  }

  clearFilters() {
    this.rangeDates = [];
    this.filter = { fromDate: undefined, toDate: undefined };
    this.loadRequests();
  }

  filterRequests() {}

  async toggleFilterDialog() {
    if (!this.filters.length) await this.loadFilters();
    this.showFilterDialog = !this.showFilterDialog;
  }

  generateExportName(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    let prefix: string;

    // Switch to determine the export name prefix based on active_index
    switch (this.active_index) {
      case 1:
        prefix = 'Maintenance_Report';
        break;
      case 2:
        prefix = 'Compliance_Report';
        break;
      case 3:
        prefix = 'Battery_Report';
        break;
      case 4:
        prefix = 'Tyre_Report';
        break;
      default:
        prefix = 'Unknown_Report'; // Default in case of an unrecognized active_index
    }

    return `${prefix}_${day}-${month}-${year}`;
  }

  generateHeaderName(): string {
    switch (this.active_index) {
      case 1:
        return 'Maintenance Request Details';
      case 2:
        return 'Compliance Request Details';
      case 3:
        return 'Battery Request Details';
      case 4:
        return 'Tyre Request Details';
      default:
        return ''; // Default in case of an unrecognized active_index
    }
  }

  exportToXlsx() {
    const data = this.filteredTickets.length
      ? this.filteredTickets
      : this.tickets;

    // Prepare the data for export
    switch (this.active_index) {
      // Maintenance Report Columns Export
      case 1:
        {
          const worksheetData = data.map((record: MaintenanceReportDto) => [
            record.id || '',
            this.datePipe.transform(record.createdOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            record.currentStage || '',
            this.datePipe.transform(record.updatedOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '', // Assuming updatedOn is for 'Status Updated Date'
            record.isVehicleOffRoad == 1 ? 'Off Road' : 'On Road',
            record.registrationNumber || '',
            record.dateOfLastService != 'NA'
              ? this.datePipe.transform(record.dateOfLastService, 'dd-MMM-yyyy')
              : 'NA',
            record.serviceRequestType || '',
            record.vendorName || 'NA',
            record.vendorName || 'NA',
            record.quotationAttachment || 'NA', // Assuming same field for 'View Quotation'
            this.currencyPipe.transform(
              record.totalEstimatedCost,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            record.overallComment || 'NA',
            record.invoiceTotalEstimatedCost != 0
              ? this.currencyPipe.transform(
                  record.invoiceTotalEstimatedCost,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA',
            record.serviceDate != 'NA'
              ? this.datePipe.transform(record.serviceDate, 'dd-MMM-yyyy') ||
                'NA'
              : 'NA', // Assuming serviceDate represents 'Actual Service Date'
            record.jobcardAttachment || 'NA', // Assuming this represents 'Upload Job Card Pic'
            record.invoiceAttachment || 'NA', // Assuming this represents 'Upload Invoice Pic'
            record.modeOfPayment || 'NA',
            record.invoiceDate != 'NA'
              ? this.datePipe.transform(record.invoiceDate, 'dd-MMM-yyyy') ||
                'NA'
              : 'NA',
            record.invoiceNumber || 'NA',
            record.hub || 'NA',
            record.branch || 'NA',
            record.zone || 'NA',
            record.region || 'NA',
            record.invoiceType || 'NA', // Assuming invoiceType is for 'GST or Non-GST'
            record.rejectionComment || 'NA',
            // record.manufacturer || 'NA', // Assuming manufacturer is for 'Make Year'
            record.manufacturer || 'NA', // Assuming manufacturer is for 'Manufacturer'
            record.model || 'NA',
            record.utrNumber || 'NA',
            record.paymentDate != 'NA'
              ? this.datePipe.transform(record.paymentDate, 'dd-MMM-yyyy') ||
                'NA'
              : 'NA',
          ]);

          // Add headers
          const headers = this.columnsForMaintenanceReport.map(
            (col: any) => col.header
          );
          worksheetData.unshift(headers);
          // Create worksheet and workbook
          const worksheet: XLSX.WorkSheet =
            XLSX.utils.aoa_to_sheet(worksheetData);
          const workbook: XLSX.WorkBook = {
            Sheets: { Data: worksheet },
            SheetNames: ['Data'],
          };
          // Save to file
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          this.saveAsExcelFile(excelBuffer, this.generateExportName());
        }
        break;

      // Compliance Report Columns Export
      case 2:
        {
          const worksheetData = data.map((record: ComplianceReportDto) => [
            record.id || '',
            this.datePipe.transform(record.createdOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            record.currentStage || '',
            this.datePipe.transform(record.updatedOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            // record.typeOfCompliance || '',
            record.registrationNumber || '',
            record.manufacturer || 'NA',
            record.model || 'NA',
            record.isVehicleOffRoad == 1 ? 'Off Road' : 'On Road',
            record.invoiceAmount != 0
              ? this.currencyPipe.transform(
                  record.invoiceAmount,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA',
            record.vendorName || 'NA',
            // record.status || 'NA',
            record.branch || 'NA',
            record.overallComment || 'NA',
            record.typeOfCompliance || 'NA',
            this.currencyPipe.transform(
              record.renewalFees,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            this.currencyPipe.transform(
              record.agentFees,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            this.currencyPipe.transform(
              record.gstAmount,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            this.currencyPipe.transform(
              record.miscAmount,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            this.currencyPipe.transform(
              record.penaltyFees,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            this.currencyPipe.transform(
              record.finalAmount,
              'INR',
              'symbol-narrow',
              '1.2-2'
            ) || 'NA',
            record.quotationAttachment || 'NA',
            record.vendorName || 'NA',
            record.modeOfPayment || 'NA', // Assuming vendorName for Vendor_name_invoice_uploaded
            // record.modeOfPayment || 'NA',
            record.hub || 'NA',
            record.branch || 'NA',
            record.zone || 'NA',
            record.region || 'NA',
            record.invoiceAttachment || 'NA',
            this.datePipe.transform(record.invoiceDate, 'dd-MMM-yyyy') || 'NA',
            record.invoiceNumber || 'NA',
            record.companyName || 'NA',
            record.invoiceType || 'NA',
            record.rejectionComment || 'NA',
            record.utrNumber || 'NA',
            this.datePipe.transform(record.paymentDate, 'dd-MMM-yyyy') || 'NA',
            this.datePipe.transform(record.fromDate, 'dd-MMM-yyyy') || 'NA',
            this.datePipe.transform(record.toDate, 'dd-MMM-yyyy') || 'NA',
          ]);

          // Add headers
          const headers = this.columnsForComplianceReport.map(
            (col: any) => col.header
          );
          worksheetData.unshift(headers);

          // Create worksheet and workbook
          const worksheet: XLSX.WorkSheet =
            XLSX.utils.aoa_to_sheet(worksheetData);
          const workbook: XLSX.WorkBook = {
            Sheets: { Data: worksheet },
            SheetNames: ['Data'],
          };

          // Save to file
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          this.saveAsExcelFile(excelBuffer, this.generateExportName());
        }
        break;

      // Battery Report Columns Export
      case 3:
        {
          const worksheetData = data.map((record: BatteryReportDto) => [
            record.id || '',
            this.datePipe.transform(record.createdOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            record.currentStage || '',
            this.datePipe.transform(record.updatedOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            record.isVehicleOffRoad == 1 ? 'Off Road' : 'On Road', // For "Vehicle_Off_Road_Status"
            record.registrationNumber || '', // For "Vehicle_Registration_Number"
            // this.datePipe.transform(record.updatedOn, 'dd-MMM-yyyy') || 'NA', // For "Date_Of_Last_Service"
            record.quotationAttachment || 'NA', // For "View_Quotation"
            record.new_battery_total !== 0
              ? this.currencyPipe.transform(
                  record.new_battery_total,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA', // For "Estimated_Battery_Cost"
            record.battery_scrap_value !== 0
              ? this.currencyPipe.transform(
                  record.battery_scrap_value,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA', // For "Battery_Scrap_Value"
            record.battery_Make || 'NA', // For "Battery_Make"
            record.battery_Model || 'NA', // For "Battery_Model"
            record.battery_Warranty_Months || 'NA', // For "Warranty_In_Months"
            record.battery_Serial_Number || 'NA', // For "Serial_Number"
            this.datePipe.transform(
              record.battery_invoice_date,
              'dd-MMM-yyyy'
            ) || 'NA', // For "Fitment_Date"
            record.overallComment || 'NA', // For "Overall_Comment"
            record.actual_Battery_Type || 'NA', // For "Battery_Type"
            record.actual_Battery_Voltage !== 0
              ? record.actual_Battery_Voltage
              : 'NA', // For "Battery_Voltage"
            record.actual_Battery_Amp !== 0 ? record.actual_Battery_Amp : 'NA', // For "Battery_Amp"
            this.datePipe.transform(
              record.actual_Battery_Invoice_Date,
              'dd-MMM-yyyy'
            ) || 'NA', // For "Invoice_Date"
            record.actual_Battery_Serial_Number || 'NA', // For "Battery_Serial_Number"
            record.battery_vendor_name || 'NA', // For "Vendor_Name_quotation_uploaded"
            record.invoice_Total !== 0
              ? this.currencyPipe.transform(
                  record.invoice_Total,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA', // For "Invoice_Amount"
            record.actual_Battery_Vendor_Name || 'NA', // For "Vendor_name_invoice_uploaded"
            record.actual_Battery_Qty || 'NA', // For "Quantity"
            this.datePipe.transform(
              record.actual_Battery_Invoice_Date,
              'dd-MMM-yyyy'
            ) || 'NA', // For "Fitting_Date"
            record.actual_Battery_Invoice_Number || 'NA', // For "Invoice_Number"
            record.invoiceAttachment || 'NA', // For "Upload_Invoice"
            record.warrantyAttachment || 'NA',
            this.datePipe.transform(
              record.actual_Battery_Invoice_Date,
              'dd-MMM-yyyy'
            ) || 'NA', // For "Date_Of_Purchase"
            record.modeOfPayment || 'NA', // For "Mode_Of_Payment"
            record.hub || 'NA', // For "Hub_Name"
            record.branch || 'NA', // For "Branch_Name"
            record.zone || 'NA', // For "Zone_Name"
            record.region || 'NA', // For "Region_Name"
            record.invoiceType || 'NA', // For "GST_OR_NON_GST"
            record.rejectionComment || 'NA', // For "Rejection_Comment"
            record.utrNumber || 'NA', // For "UTR_Number"
            this.datePipe.transform(record.paymentDate, 'dd-MMM-yyyy') || 'NA', // For "Payment_Date"
          ]);
          // Add headers
          const headers = this.columnsForBatteryReport.map(
            (col: any) => col.header
          );
          worksheetData.unshift(headers);

          // Create worksheet and workbook
          const worksheet: XLSX.WorkSheet =
            XLSX.utils.aoa_to_sheet(worksheetData);
          const workbook: XLSX.WorkBook = {
            Sheets: { Data: worksheet },
            SheetNames: ['Data'],
          };

          // Save to file
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          this.saveAsExcelFile(excelBuffer, this.generateExportName());
        }
        break;
      // Tyre Report Columns Export
      case 4:
        {
          const worksheetData = data.map((record: TyreReportDto) => [
            record.id || '',
            this.datePipe.transform(record.createdOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            record.currentStage || '',
            this.datePipe.transform(record.updatedOn, 'dd-MMM-yyyy HH:mm:ss') ||
              '',
            record.isVehicleOffRoad == 1 ? 'Off Road' : 'On Road', // For "Vehicle_Off_Road_Status"
            record.registrationNumber || '', // For "Vehicle_Registration_Number"
            record.selectedVendorName || 'NA', // For "Vendor_name_quotation_upload"
            record.quotationAttachment || 'NA', // For "View_Quotation"
            record.modeOfPayment || 'NA', // For "Mode_Of_Payment"
            record.estimatedTyreCost !== 0
              ? this.currencyPipe.transform(
                  (record.estimatedTyreCost || 0) *
                    (1 + (record.estimatedTyreGst || 0) / 100),
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA', // For "Estimated_Tyre_Cost_With_GST"
            record.tyreQuantity || 'NA', // For "Quantity"
            record.estimatedTyreTotal !== 0
              ? this.currencyPipe.transform(
                  record.estimatedTyreTotal,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA', // For "Total_Tyre_Cost_With_GST"
            record.selectedTyre1Manufacturer || 'NA', // For "Tyre_1_Manufacturer"
            record.selectedTyre1FitmentDate
              ? this.ageSince(record.selectedTyre1FitmentDate)
              : 'NA', // For "Tyre_1_Life"
            record.selectedTyre2Manufacturer || 'NA', // For "Tyre_2_Manufacturer"
            record.selectedTyre2FitmentDate
              ? this.ageSince(record.selectedTyre2FitmentDate)
              : 'NA', // For "Tyre_2_Life"
            record.selectedTyre3Manufacturer || 'NA', // For "Tyre_3_Manufacturer"
            record.selectedTyre3FitmentDate
              ? this.ageSince(record.selectedTyre3FitmentDate)
              : 'NA', // For "Tyre_3_Life"
            record.selectedTyre4Manufacturer || 'NA', // For "Tyre_4_Manufacturer"
            record.selectedTyre4FitmentDate
              ? this.ageSince(record.selectedTyre4FitmentDate)
              : 'NA', // For "Tyre_4_Life"
            record.selectedTyre5Manufacturer || 'NA', // For "Tyre_5_Manufacturer"
            record.selectedTyre5FitmentDate
              ? this.ageSince(record.selectedTyre5FitmentDate)
              : 'NA', // For "Tyre_5_Life"
            record.invoiceTotal !== 0
              ? this.currencyPipe.transform(
                  record.invoiceTotal,
                  'INR',
                  'symbol-narrow',
                  '1.2-2'
                )
              : 'NA', // For "invoiceAmount"
            record.actualTyreVendorName || 'NA', // For "Vendor_name_invioce_uploaded"
            record.hub || 'NA', // For "Hub_Name"
            record.branch || 'NA', // For "Branch_Name"
            record.zone || 'NA', // For "Zone_Name"
            record.region || 'NA', // For "Region_Name"
            record.overallComment || 'NA', // For "Request_Creation_Comment"
            record.invoiceAttachment || 'NA', // For "Invoice_Pic"
            this.datePipe.transform(record.invoiceDate, 'dd-MMM-yyyy') || 'NA', // For "Invoice_Date"
            record.invoiceNumber || 'NA', // For "invoiceNo"
            record.companyName || 'NA', // For "DIV" (this field is not defined in TyreReportDto)
            record.invoiceType || 'NA', // For "GST_OR_NON_GST"
            record.rejectionComment || 'NA', // For "Rejection_Comment"
            record.utrNumber || 'NA', // For "UTR_Number"
            this.datePipe.transform(record.paymentDate, 'dd-MMM-yyyy') || 'NA', // For "Payment_Date"
          ]);

          const headers = this.columnsForTyreReport.map(
            (col: any) => col.header
          );
          worksheetData.unshift(headers);

          // Create worksheet and workbook
          const worksheet: XLSX.WorkSheet =
            XLSX.utils.aoa_to_sheet(worksheetData);
          const workbook: XLSX.WorkBook = {
            Sheets: { Data: worksheet },
            SheetNames: ['Data'],
          };

          // Save to file
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          this.saveAsExcelFile(excelBuffer, this.generateExportName());
        }
        break;
      default:
        return;
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}.xlsx`);
  }

  ageSince(date: string): string {
    let givenDate: Date;

    // Split the date string
    const dateParts = date.split('-');

    // Check the format of the date
    if (dateParts.length === 3) {
      // Check if the first part is a valid year (yyyy-mm-dd) or a valid day (dd-mm-yyyy)
      const isYearFirst =
        parseInt(dateParts[0]) > 1900 &&
        parseInt(dateParts[0]) <= new Date().getFullYear();

      if (isYearFirst) {
        // yyyy-mm-dd format
        const [year, month, day] = dateParts;
        givenDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      } else {
        // dd-mm-yyyy format
        const [day, month, year] = dateParts;
        givenDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      }
    } else {
      throw new Error(
        'Invalid date format. Please use "yyyy-mm-dd" or "dd-mm-yyyy".'
      );
    }

    const currentDate = new Date();

    let yearsDifference = currentDate.getFullYear() - givenDate.getFullYear();
    let monthsDifference = currentDate.getMonth() - givenDate.getMonth();
    let daysDifference = currentDate.getDate() - givenDate.getDate();

    if (daysDifference < 0) {
      monthsDifference--;
      daysDifference += new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).getDate();
    }

    if (monthsDifference < 0) {
      yearsDifference--;
      monthsDifference += 12;
    }

    const parts = [];
    if (yearsDifference > 0) {
      parts.push(
        `${yearsDifference} ${yearsDifference > 1 ? 'Years' : 'Year'}`
      );
    }
    if (monthsDifference > 0) {
      parts.push(
        `${monthsDifference} ${monthsDifference > 1 ? 'Months' : 'Month'}`
      );
    }
    if (daysDifference > 0) {
      parts.push(`${daysDifference} ${daysDifference > 1 ? 'Days' : 'Day'}`);
    }

    return parts.join(', ');
  }

  async loadFilters() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetAllFiltersGet()
      );
      if (res && res.zones && res.zones.length) {
        this.filters = this.mapFiltersToTreeNodes(res);
        this.selectedZones = this.getAllNodes(this.filters);
      }
    } catch (err: any) {}
    this.showLoader = false;
  }

  private mapFiltersToTreeNodes(filters: FiltersDto): TreeNode[] {
    const indiaNode: TreeNode = {
      label: 'INDIA',
      data: null,
      expanded: true,
      children: filters.zones!.map((zone) => {
        return {
          label: zone.zoneName,
          data: zone,
          children: zone.regions!.map((region) => {
            return {
              label: region.regionName,
              data: region,
              children: region.branches!.map((branch) => {
                // Capture initial branches and hubs
                this.initialSelectedBranches.add(branch.branchName!);
                branch.hubs!.forEach((hub) => {
                  this.initialSelectedHubs.add(hub.hubName!);
                });

                return {
                  label: branch.branchName,
                  data: branch,
                  children: branch.hubs!.map((hub) => {
                    return {
                      label: hub.hubName,
                      data: hub,
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };

    return [indiaNode];
  }

  private getAllNodes(treeNodes: TreeNode[]): TreeNode[] {
    let allNodes: TreeNode[] = [];
    for (const node of treeNodes) {
      allNodes.push(node);
      if (node.children) {
        allNodes = allNodes.concat(this.getAllNodes(node.children));
      }
    }
    return allNodes;
  }

  hasSelections(): boolean {
    return this.selectedZones && this.selectedZones.length > 0;
  }

  viewNodes(event: any) {
    // console.log('Selected Node:', event.node);
    // console.log(this.selectedZones);
  }

  applyFilter() {
    this.showLoader = true;
    const selectedBranches = new Set<string>();
    const selectedHubs = new Set<string>();

    // Start traversing from the "India" node
    this.filters.forEach((indiaNode) => {
      if (indiaNode.children) {
        indiaNode.children.forEach((zoneNode) => {
          if (zoneNode.children) {
            zoneNode.children.forEach((regionNode) => {
              if (regionNode.children) {
                regionNode.children.forEach((branchNode) => {
                  // Check if the branch node is selected
                  if (
                    branchNode.partialSelected ||
                    this.selectedZones.includes(branchNode)
                  ) {
                    selectedBranches.add(branchNode.label!);

                    if (branchNode.children) {
                      branchNode.children.forEach((hubNode) => {
                        // Only add hubs if the branch is explicitly selected
                        if (
                          branchNode.partialSelected ||
                          this.selectedZones.includes(hubNode)
                        ) {
                          selectedHubs.add(hubNode.label!);
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });

    this.isFilterApplied =
      selectedBranches.size !== this.initialSelectedBranches.size ||
      selectedHubs.size !== this.initialSelectedHubs.size ||
      [...selectedBranches].some(
        (branch) => !this.initialSelectedBranches.has(branch)
      ) ||
      [...selectedHubs].some((hub) => !this.initialSelectedHubs.has(hub));

    // Now filter the tickets based on selected branches and hubs
    this.filteredTickets = this.tickets.filter((ticket) => {
      const isBranchSelected = selectedBranches.has(ticket.branch!);
      const isHubSelected = selectedHubs.has(ticket.hub!);

      // If a hub is selected, show tickets only for that hub
      if (isHubSelected) {
        return ticket.hub && selectedHubs.has(ticket.hub);
      }

      // If a branch is selected, show all tickets for that branch
      if (isBranchSelected) {
        return ticket.branch && selectedBranches.has(ticket.branch);
      }

      // If neither branch nor hub is selected, return false
      return false;
    });

    this.showLoader = false;
    // Optionally, close the dialog after applying the filter
    this.toggleFilterDialog();
  }

  resetFilters() {
    this.selectedZones = this.getAllNodes(this.filters); // Reset your selections
    this.isFilterApplied = false; // Reset the filter state
    this.applyFilter();
    // this.toggleFilterDialog();
  }
}
