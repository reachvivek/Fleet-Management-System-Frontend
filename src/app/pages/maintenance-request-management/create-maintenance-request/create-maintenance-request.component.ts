import { Component } from '@angular/core';
import { NewTicket, SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/prod/environment';
import { MessageService } from 'primeng/api';
import {
  CreateTicketDto,
  MaintenanceRequestService,
  UpdateTicketDto,
  UpdateVehicleDetailsDto,
  VehicleDetailsDto,
} from '../../../../swagger';

@Component({
  selector: 'app-create-maintenance-request',
  templateUrl: './create-maintenance-request.component.html',
  styleUrl: './create-maintenance-request.component.scss',
})
export class CreateMaintenanceRequestComponent {
  formActionsDisabled = false;
  showLoader: boolean = false;
  newTicket!: NewTicket;
  registrationNumbers: any = [];
  offRoadReasons: any = [];
  onRoadSubStatuses: ['Stand By', 'On Route'] = ['Stand By', 'On Route'];
  serviceRequestTypes: any = [];
  vendorNames: any = [];

  totalComponents: number = 1;

  systemNames: any = [];
  partNames: any = [];

  selectedVehicle: any = {};
  dates: {
    dateOfLastService: Date | undefined;
    offRoadStatusChangeDate: Date | undefined;
  } = {
    dateOfLastService: undefined,
    offRoadStatusChangeDate: undefined,
  };
  dateFormat: string = 'dd/mm/yy';

  minDate: Date | undefined;
  maxDate: Date | undefined = new Date();

  uploadedFiles: File[] = [];

  showUploadQuotationDialog: boolean = false;

  editMode: boolean = false;

  isValidAdvanceAmount = true;

  vehicleDetails: VehicleDetailsDto = {};

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.sharedService.newTicket$.subscribe((newTicket) => {
      this.newTicket = newTicket;
    });
    if (this.isAnyFieldEmpty(this.newTicket)) {
      if (!this.newTicket.id) {
        this.router.navigate(['/dashboard']);
      } else {
        this.editMode = true;
      }
    } else {
      this.loadVehicleRegistrationNumbers();
      this.loadVehicleOffRoadReasons();
      this.loadServiceRequestTypes();
      this.loadVendorNames();
      this.loadSystemNames();
    }
    if (this.editMode) {
      this.loadTicketDetails(parseInt(this.newTicket.id));
    }
  }

  isAnyFieldEmpty(ticket: NewTicket): boolean {
    return !ticket.zone || !ticket.region || !ticket.branch || !ticket.hub;
  }

  async loadTicketDetails(id: number) {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetTicketDetailsByIdGet(
          id
        )
      );
      if (res) {
        this.newTicket.zone = res.zone!;
        this.newTicket.region = res.region!;
        this.newTicket.branch = res.branch!;
        this.newTicket.hub = res.hub!;
        await this.loadVehicleRegistrationNumbers();
        await this.loadVehicleOffRoadReasons();
        await this.loadServiceRequestTypes();
        await this.loadVendorNames();
        await this.loadSystemNames();
        this.newTicket.registrationNumber = res.registrationNumber!;
        this.newTicket.dateOfLastService = res.dateOfLastService!;
        this.newTicket.vehicleAge = res.vehicleAge!;
        this.newTicket.manufacturer = res.manufacturer!;
        this.newTicket.model = res.model!;
        this.newTicket.isVehicleOffRoad =
          res.isVehicleOffRoad == 0 ? false : true;
        if (
          res.dateOfLastService &&
          res.dateOfLastService != 'NA' &&
          res.dateOfLastService != 'Invalid Date'
        )
          this.dates.dateOfLastService = this.parseDate(res.dateOfLastService!);
        if (
          res.offRoadStatusChangeDate &&
          res.offRoadStatusChangeDate != 'NA' &&
          res.offRoadStatusChangeDate != 'Invalid Date'
        )
          this.dates.offRoadStatusChangeDate = this.parseDate(
            res.offRoadStatusChangeDate!
          );
        this.newTicket.offRoadStatusChangeDate = res.offRoadStatusChangeDate!;
        if (this.checkOffRoadReasonExists(res.offRoadReason!)) {
          this.newTicket.offRoadReason = res.offRoadReason!;
        } else {
          this.offRoadReasons.push({ reason: res.offRoadReason! });
          this.newTicket.offRoadReason = res.offRoadReason!;
        }
        this.newTicket.serviceRequestType = res.serviceRequestType!;
        this.newTicket.vendorName = res.vendorName!;
        this.newTicket.totalLaborCost = res.totalLaborCost!;
        this.newTicket.totalSpareCost = res.totalSpareCost!;
        this.newTicket.totalEstimatedCost = res.totalEstimatedCost!;
        this.newTicket.componentDetails = JSON.parse(res.componentDetails!);
        this.newTicket.componentDetails.forEach((entry: any, index: number) => {
          this.loadPartNames(index);
        });
        this.newTicket.overallComment = res.overallComment!;
        this.newTicket.isAdvanceRequired =
          res.isAdvanceRequired == 0 ? false : true;
        this.newTicket.advanceAmount = res.advanceAmount!;
      }
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
    this.showLoader = false;
  }

  async loadVehicleRegistrationNumbers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetVehicleRegistrationNumbersGet(
          this.newTicket.hub
        )
      );
      if (res && res.length) {
        this.registrationNumbers = res;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadVehicleDetails() {
    this.newTicket.manufacturer = '';
    this.newTicket.model = '';
    this.newTicket.isVehicleOffRoad = false;
    this.newTicket.offRoadReason = '';
    this.newTicket.vehicleAge = '';
    this.newTicket.dateOfLastService = '';
    this.newTicket.vehicleSubStatus = '';

    this.newTicket.offRoadStatusChangeDate = '';
    this.dates.dateOfLastService = undefined;
    this.dates.offRoadStatusChangeDate = undefined;

    if (this.newTicket.registrationNumber) {
      this.showLoader = true;
      try {
        const res = await firstValueFrom(
          this.maintenanceRequestService.maintenanceRequestGetVehicleDetailsGet(
            this.newTicket.registrationNumber
          )
        );
        if (res && res.registration_No) {
          this.vehicleDetails = { ...res };
          this.newTicket.manufacturer = res.manufacturer!;
          this.newTicket.model = res.model_Name!;
          this.newTicket.isVehicleOffRoad = res.off_Road == 'TRUE';
          this.newTicket.offRoadReason = res.offroad_Reason!;
          this.newTicket.vehicleAge = this.vehicleAgeSince(
            res.registration_Date!
          );
          this.dates.dateOfLastService = this.parseDate(
            res.date_Of_Last_Service!
          );
          if (res.vehicleSubStatus) {
            this.newTicket.vehicleSubStatus = res.vehicleSubStatus;
          }
          if (
            this.dates.dateOfLastService &&
            this.dates.dateOfLastService.toString() !== 'Invalid Date'
          ) {
            this.newTicket.dateOfLastService =
              this.dates.dateOfLastService.toString();
          } else {
            this.newTicket.dateOfLastService = 'NA';
          }
          if (res.offroad_Date != 'NA') {
            this.dates.offRoadStatusChangeDate = this.parseDate(
              res.offroad_Date!
            );
            this.newTicket.offRoadStatusChangeDate =
              this.dates.offRoadStatusChangeDate!.toString();
          }

          if (this.newTicket.isVehicleOffRoad) {
            if (this.checkOffRoadReasonExists(res.offroad_Reason!)) {
              this.newTicket.offRoadReason = this.newTicket.offRoadReason;
            } else {
              this.offRoadReasons.push({ reason: res.offroad_Reason! });
              this.newTicket.offRoadReason = res.offroad_Reason!;
            }
          }
        }
      } catch (err: any) {
        console.error(err);
      }
      this.showLoader = false;
    }
  }

  vehicleAgeSince(registration_Date: string) {
    const [day, month, year] = registration_Date.split('-');
    const givenDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
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
    if (yearsDifference > 0)
      parts.push(
        `${yearsDifference} ${yearsDifference > 1 ? 'Years' : 'Year'}`
      );
    if (monthsDifference > 0)
      parts.push(
        `${monthsDifference} ${monthsDifference > 1 ? 'Months' : 'Month'}`
      );
    if (daysDifference > 0)
      parts.push(`${daysDifference} ${daysDifference > 1 ? 'Days' : 'Day'}`);

    return parts.join(', ');
  }

  parseDate(dateString: string) {
    if (dateString.includes('T')) {
      return new Date(dateString);
    }

    if (dateString.includes('+')) {
      return new Date(dateString);
    }

    const [day, month, year] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // month is 0-indexed in JavaScript
  }

  checkOffRoadReasonExists(reason: string) {
    return this.offRoadReasons.some(
      (entry: any) => entry.reason.toUpperCase() == reason.toUpperCase()
    );
  }

  async loadVehicleOffRoadReasons() {
    if (!this.offRoadReasons.length) {
      this.showLoader = true;
      try {
        const res = await firstValueFrom(
          this.maintenanceRequestService.maintenanceRequestGetOffRoadReasonsGet()
        );
        if (res && res.length) {
          this.offRoadReasons = res;
        }
      } catch (err: any) {
        console.error(err);
      }
      this.showLoader = false;
    }
  }

  convertDateToString(id: number) {
    let dateToUpdate;
    switch (id) {
      case 1:
        dateToUpdate = this.dates.dateOfLastService;
        break;
      case 2:
        dateToUpdate = this.dates.offRoadStatusChangeDate;
        break;
      default:
        throw new Error('Invalid Function Call');
    }

    const offset = dateToUpdate!.getTimezoneOffset();
    const updatedDate = new Date(dateToUpdate!.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];

    switch (id) {
      case 1:
        this.newTicket!.dateOfLastService = updatedDate;
        break;
      case 2:
        this.newTicket!.offRoadStatusChangeDate = updatedDate;
        break;
      default:
        throw new Error('Invalid Function Call');
    }
  }

  async loadServiceRequestTypes() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetServiceRequestTypesGet()
      );
      if (res && res.length) {
        this.serviceRequestTypes = res;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadVendorNames() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetVendorNamesGet()
      );
      if (res && res.length) {
        this.vendorNames = res;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadSystemNames() {
    this.showLoader = true;
    try {
      let res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetSystemNamesGet()
      );
      if (res && res.length) {
        res = res.map((entry: any) => entry.replace(/["']/g, ''));
        this.systemNames = res;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadPartNames(index: number) {
    this.showLoader = true;
    try {
      let res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetPartNamesGet(
          this.newTicket.componentDetails[index].systemName
        )
      );
      if (res && res.length) {
        res = res.map((entry: any) => entry.replace(/["']/g, ''));
        this.newTicket.componentDetails[index].partNames = res;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  toggleUploadQuotationDialog() {
    this.showUploadQuotationDialog = !this.showUploadQuotationDialog;
  }

  // todo
  async onUpload(event: any) {
    this.showLoader = true;
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    const formData = new FormData();
    // formData.append('BillID', this.selectedBill.billId);
    // formData.append('Type', '1');

    // Append each file to FormData
    for (let file of this.uploadedFiles) {
      formData.append('Files', file, file.name);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')!}`,
    });
    // Now you can send formData to your API using HttpClient
    this.http
      .post(`${environment.BASE_PATH}/FileUpload/UploadFiles`, formData, {
        headers,
      })
      .subscribe(
        (response: any) => {
          if (response && response.url)
            this.messageService.add({
              severity: 'success',
              summary: 'Uploaded Successfully',
              detail: 'Acknowledgement Uploaded Successfully',
              life: 3000,
            });
          this.showLoader = false;
          this.uploadedFiles = [];
          this.toggleUploadQuotationDialog();
        },
        (error: any) => {
          console.error('Error uploading files', error);
          this.showLoader = false;
        }
      );
  }

  addSection() {
    this.newTicket.componentDetails.push({
      systemName: '',
      partName: '',
      partNames: [],
      spareCost: 0,
      spareGst: 0,
      laborCost: 0,
      laborGst: 0,
      comment: '',
    });
    this.goToBottomAfter(50);
  }

  goToBottomAfter(time: number) {
    setTimeout(() => {
      this.scrollToBottom();
    }, time);
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  removeSection(index: number) {
    if (this.newTicket.componentDetails.length > 1) {
      this.newTicket.componentDetails.splice(index, 1);
      this.updateTotalLaborCost();
      this.updateTotalSpareCost();
    }
  }

  updateTotalSpareCost() {
    let totalSpareCost = 0;
    this.newTicket.componentDetails.forEach((entry: any) => {
      totalSpareCost += entry.spareCost;
      totalSpareCost += entry.spareGst;
    });
    this.newTicket.totalSpareCost = totalSpareCost;
    this.updateTotalEstimatedCost();
  }

  updateTotalLaborCost() {
    let totalLaborCost = 0;
    this.newTicket.componentDetails.forEach((entry: any) => {
      totalLaborCost += entry.laborCost;
      totalLaborCost += entry.laborGst;
    });
    this.newTicket.totalLaborCost = totalLaborCost;
    this.updateTotalEstimatedCost();
  }

  updateTotalEstimatedCost() {
    this.newTicket.totalEstimatedCost =
      this.newTicket.totalLaborCost + this.newTicket.totalSpareCost;
  }

  checkValidAdvanceAmount() {
    if (!this.newTicket.isAdvanceRequired) {
      this.newTicket.advanceAmount = 0;
    }
    if (this.newTicket.advanceAmount > this.newTicket.totalEstimatedCost) {
      this.isValidAdvanceAmount = false;
    } else {
      this.isValidAdvanceAmount = true;
    }
  }

  async submitTicketRequest() {
    this.showLoader = true;
    let ticket: any;

    if (this.editMode) {
      ticket = {} as UpdateTicketDto;
      ticket.id = this.newTicket.id;
    } else {
      ticket = {} as CreateTicketDto;
    }

    // Populate ticket object
    ticket.zone = this.newTicket.zone;
    ticket.region = this.newTicket.region;
    ticket.branch = this.newTicket.branch;
    ticket.hub = this.newTicket.hub;
    ticket.registrationNumber = this.newTicket.registrationNumber;
    ticket.vehicleAge = this.newTicket.vehicleAge;
    ticket.manufacturer = this.newTicket.manufacturer;
    ticket.model = this.newTicket.model;
    ticket.vehicleSubStatus = this.newTicket.vehicleSubStatus;
    ticket.isVehicleOffRoad = this.newTicket.isVehicleOffRoad ? 1 : 0;
    ticket.dateOfLastService = this.newTicket.dateOfLastService;
    ticket.offRoadReason = this.newTicket.offRoadReason;
    ticket.offRoadStatusChangeDate = this.newTicket.offRoadStatusChangeDate;
    ticket.serviceRequestType = this.newTicket.serviceRequestType;
    ticket.vendorName = this.newTicket.vendorName;
    ticket.totalSpareCost = this.newTicket.totalSpareCost;
    ticket.totalLaborCost = this.newTicket.totalLaborCost;
    ticket.totalEstimatedCost = this.newTicket.totalEstimatedCost;
    ticket.quotationAttachment = this.newTicket.quotationAttachment;

    // Handle component details
    this.newTicket.componentDetails.forEach((prop: any) => {
      prop.partNames = [];
      prop.partName = prop.partName.replace(/["']/g, '');
      prop.systemName = prop.systemName.replace(/["']/g, '');
      prop.comment = prop.comment.replace(/["']/g, '');
    });
    ticket.componentDetails = JSON.stringify(this.newTicket.componentDetails);
    ticket.overallComment = this.newTicket.overallComment;
    ticket.isAdvanceRequired = this.newTicket.isAdvanceRequired ? 1 : 0;
    ticket.advanceAmount = this.newTicket.advanceAmount;

    // Handle approval requirements
    if (
      this.newTicket.totalEstimatedCost >= 1 &&
      this.newTicket.totalEstimatedCost <= 1000
    ) {
      ticket.isHFMApprovalRequired = 0;
      ticket.isRMApprovalRequired = 0;
      ticket.isNFMApprovalRequired = 0;
      ticket.isZMApprovalRequired = 0;
      ticket.isVPApprovalRequired = 0; // No approvals required for this range
    } else if (
      this.newTicket.totalEstimatedCost >= 1001 &&
      this.newTicket.totalEstimatedCost <= 7500
    ) {
      ticket.isHFMApprovalRequired = 1; // HFM approval required
      ticket.isRMApprovalRequired = 1; // RM approval required
      ticket.isNFMApprovalRequired = 0; // NFM approval not required
      ticket.isZMApprovalRequired = 0; // ZM approval not required
      ticket.isVPApprovalRequired = 0; // VP approval not required
    } else if (
      this.newTicket.totalEstimatedCost >= 7501 &&
      this.newTicket.totalEstimatedCost <= 50000
    ) {
      ticket.isHFMApprovalRequired = 1; // HFM approval required
      ticket.isRMApprovalRequired = 1; // RM approval required
      ticket.isNFMApprovalRequired = 1; // NFM approval required
      ticket.isZMApprovalRequired = 1; // ZM approval required
      ticket.isVPApprovalRequired = 0; // VP approval not required
    } else if (this.newTicket.totalEstimatedCost > 50000) {
      ticket.isHFMApprovalRequired = 1; // HFM approval required
      ticket.isRMApprovalRequired = 1; // RM approval required
      ticket.isNFMApprovalRequired = 1; // NFM approval required
      ticket.isZMApprovalRequired = 1; // ZM approval required
      ticket.isVPApprovalRequired = 1; // VP approval required
    }

    // Handle vehicle details
    const previousOffRoadStatus = this.vehicleDetails.off_Road;
    const previousVehicleSubStatus = this.vehicleDetails.vehicleSubStatus;

    // Initialize vehicle object
    let vehicle: UpdateVehicleDetailsDto = {
      registration_No: this.newTicket.registrationNumber,
    };

    // Perform logic to update vehicle details based on changes
    if (this.newTicket.isVehicleOffRoad) {
      if (previousOffRoadStatus === 'FALSE') {
        if (previousVehicleSubStatus === 'On Route') {
          this.vehicleDetails.onRoute_ToDate = new Date().toISOString();
        } else if (previousVehicleSubStatus === 'Stand By') {
          this.vehicleDetails.standBy_ToDate = new Date().toISOString();
        }

        this.vehicleDetails.off_Road = 'TRUE';
        this.vehicleDetails.offroad_Date = new Date().toISOString();
        this.vehicleDetails.offroad_Reason = this.newTicket.offRoadReason || '';
      }
    } else {
      if (previousOffRoadStatus === 'TRUE') {
        this.vehicleDetails.offroad_ToDate = new Date().toISOString();
      }

      this.vehicleDetails.off_Road = 'FALSE';
      this.vehicleDetails.vehicleSubStatus = this.newTicket.vehicleSubStatus;

      if (this.newTicket.vehicleSubStatus === 'On Route') {
        if (previousVehicleSubStatus === 'Stand By') {
          this.vehicleDetails.standBy_ToDate = new Date().toISOString();
        }
        this.vehicleDetails.onRoute_FromDate = new Date().toISOString();
        this.vehicleDetails.onRoute_ToDate = '';
      } else if (this.newTicket.vehicleSubStatus === 'Stand By') {
        if (previousVehicleSubStatus === 'On Route') {
          this.vehicleDetails.onRoute_ToDate = new Date().toISOString();
        }
        this.vehicleDetails.standBy_FromDate = new Date().toISOString();
        this.vehicleDetails.standBy_ToDate = '';
      }
    }

    if (this.newTicket.serviceRequestType === 'Accident Repair') {
      if (previousOffRoadStatus !== 'TRUE') {
        if (previousVehicleSubStatus === 'On Route') {
          this.vehicleDetails.onRoute_ToDate = new Date().toISOString();
        } else if (previousVehicleSubStatus === 'Stand By') {
          this.vehicleDetails.standBy_ToDate = new Date().toISOString();
        }
      }
      this.vehicleDetails.off_Road = 'TRUE';
      this.vehicleDetails.offroad_Date = new Date().toISOString();
      this.vehicleDetails.offroad_Reason = 'Accident';
    }

    // Finalize the vehicle details object
    vehicle = {
      ...vehicle,
      vehicleSubStatus: this.vehicleDetails.vehicleSubStatus,
      standBy_FromDate: this.vehicleDetails.standBy_FromDate,
      standBy_ToDate: this.vehicleDetails.standBy_ToDate,
      onRoute_FromDate: this.vehicleDetails.onRoute_FromDate,
      onRoute_ToDate: this.vehicleDetails.onRoute_ToDate,
      off_Road: this.vehicleDetails.off_Road,
      offroad_Date: this.vehicleDetails.offroad_Date,
      offroad_ToDate: this.vehicleDetails.offroad_ToDate,
      offroad_Reason: this.vehicleDetails.offroad_Reason,
    };

    // console.log('Final Vehicle Details Payload Before API Call:', vehicle);

    // Check if registration_No is present
    if (!vehicle.registration_No) {
      console.error('Error: Vehicle registration number is missing.');
      this.showLoader = false;
      return;
    }

    // API calls
    try {
      const res1 = await firstValueFrom(
        this.editMode
          ? this.maintenanceRequestService.maintenanceRequestUpdateMaintenanceRequestPut(
              ticket
            )
          : this.maintenanceRequestService.maintenanceRequestCreateMaintenanceRequestPost(
              ticket
            )
      );
      // console.log('Update Response:', res1);

      const res2 = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestUpdateVehicleDetailsPut(
          vehicle
        )
      );
      // console.log('Vehicle Update Response:', res2);

      if (res1 && (res1.created || res1.updated)) {
        this.formActionsDisabled = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Maintenance Request ${
            this.editMode ? 'Updated' : 'Created'
          } Successfully`,
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error:', err);
    }
    this.showLoader = false;
  }

  cancelTicketRequest() {}
}
