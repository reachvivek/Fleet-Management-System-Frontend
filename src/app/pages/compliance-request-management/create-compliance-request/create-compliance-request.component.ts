import { Component } from '@angular/core';
import {
  NewComplianceTicket,
  SharedService,
} from '../../../services/shared.service';
import { Router } from '@angular/router';
import {
  BulkUploadService,
  ComplianceRequestService,
  CreateComplianceTicketDto,
  UpdateComplianceTicketDto,
  UpdateVehicleDetailsDto,
  VehicleDetailsDto,
  VendorForSelectDto,
} from '../../../../swagger';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-compliance-request',
  templateUrl: './create-compliance-request.component.html',
  styleUrl: './create-compliance-request.component.scss',
})
export class CreateComplianceRequestComponent {
  editMode: boolean = false;
  formActionsDisabled = false;
  showLoader: boolean = false;
  newTicket!: NewComplianceTicket;
  registrationNumbers: any = [];
  offRoadReasons: any = [];
  onRoadSubStatuses: ['Stand By', 'On Route'] = ['Stand By', 'On Route'];
  typeOfCompliances: any = [];
  vendors: VendorForSelectDto[] = [];

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
  isValidAdvanceAmount = true;

  vehicleDetails: VehicleDetailsDto = {};

  showUploadQuotationDialog: boolean = false;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private complianceService: ComplianceRequestService,
    private commonService: BulkUploadService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.sharedService.newComplianceTicket$.subscribe((newTicket) => {
      this.newTicket = newTicket;
    });
    if (this.isAnyFieldEmpty(this.newTicket)) {
      if (!this.newTicket.id) {
        this.router.navigate(['/compliance-requests']);
      } else {
        this.editMode = true;
      }
    } else {
      this.loadVehicleRegistrationNumbers();
      this.loadVehicleOffRoadReasons();
      this.loadTypesOfCompliances();
      this.loadVendorNames();
    }
    if (this.editMode) {
      this.loadTicketDetails(parseInt(this.newTicket.id));
    }
  }

  isAnyFieldEmpty(ticket: NewComplianceTicket): boolean {
    return !ticket.zone || !ticket.region || !ticket.branch || !ticket.hub;
  }

  async loadVehicleRegistrationNumbers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.commonService.bulkUploadGetVehicleRegistrationNumbersGet(
          this.newTicket.branch
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
    this.newTicket.vehicleSubStatus = '';

    this.newTicket.offRoadStatusChangeDate = '';
    this.dates.dateOfLastService = undefined;
    this.dates.offRoadStatusChangeDate = undefined;

    if (this.newTicket.registrationNumber) {
      this.showLoader = true;
      try {
        const res = await firstValueFrom(
          this.commonService.bulkUploadGetVehicleDetailsGet(
            this.newTicket.registrationNumber
          )
        );
        if (res && res.registration_No) {
          this.vehicleDetails = { ...res };
          this.newTicket.manufacturer = res.manufacturer!;
          this.newTicket.model = res.model!;
          this.newTicket.isVehicleOffRoad = res.is_Vehicle_Offroad == 'TRUE';
          this.newTicket.offRoadReason = res.offroad_Reason!;
          this.newTicket.vehicleAge = this.vehicleAgeSince(
            res.registration_Date!
          );
          this.dates.dateOfLastService = this.parseDate(
            res.date_Of_Last_Service!
          );
          if (res.vehicle_Sub_Status) {
            this.newTicket.vehicleSubStatus = res.vehicle_Sub_Status;
          }
          if (res.offroad_From_Date != 'NA') {
            this.dates.offRoadStatusChangeDate = this.parseDate(
              res.offroad_From_Date!
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

  async loadVehicleOffRoadReasons() {
    if (!this.offRoadReasons.length) {
      this.showLoader = true;
      try {
        const res = await firstValueFrom(
          this.commonService.bulkUploadGetOffRoadReasonsGet()
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

  async loadTypesOfCompliances() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestGetTypesOfCompliancesGet()
      );
      if (res && res.length) {
        this.typeOfCompliances = res;
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

  async loadTicketDetails(id: number) {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestGetTicketDetailsByIdGet(id)
      );
      if (res) {
        this.newTicket.zone = res.zone!;
        this.newTicket.region = res.region!;
        this.newTicket.branch = res.branch!;
        this.newTicket.hub = res.hub!;
        await this.loadVehicleRegistrationNumbers();
        await this.loadVehicleOffRoadReasons();
        await this.loadTypesOfCompliances();
        await this.loadVendorNames();
        this.newTicket.registrationNumber = res.registrationNumber!;
        this.newTicket.vehicleAge = res.vehicleAge!;
        this.newTicket.manufacturer = res.manufacturer!;
        this.newTicket.model = res.model!;
        this.newTicket.vehicleSubStatus = res.vehicleSubStatus!;
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
        this.newTicket.vehicleSubStatus = res.vehicleSubStatus!;
        this.newTicket.typeOfCompliance = res.typeOfCompliance!;
        this.newTicket.vendorId = res.vendorId!;
        this.newTicket.renewalFees = res.renewalFees!;
        this.newTicket.agentFees = res.agentFees!;
        this.newTicket.miscAmount = res.miscAmount!;
        this.newTicket.penaltyFees = res.penaltyFees!;
        this.newTicket.gstAmount = res.gstAmount!;
        this.newTicket.finalAmount = res.finalAmount!;
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

  checkOffRoadReasonExists(reason: string) {
    return this.offRoadReasons.some(
      (entry: any) => entry.reason.toUpperCase() == reason.toUpperCase()
    );
  }

  vehicleAgeSince(registration_Date: string): string {
    let givenDate: Date;

    // Split the date string
    const dateParts = registration_Date.split('-');

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

  convertDateToString(id: number) {
    let dateToUpdate;
    switch (id) {
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
      case 2:
        this.newTicket!.offRoadStatusChangeDate = updatedDate;
        break;
      default:
        throw new Error('Invalid Function Call');
    }
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

  updateComplianceTotal() {
    this.newTicket.finalAmount =
      (this.newTicket.renewalFees || 0) +
      (this.newTicket.agentFees || 0) +
      (this.newTicket.miscAmount || 0) +
      (this.newTicket.penaltyFees || 0) +
      (this.newTicket.gstAmount || 0);
  }

  checkValidAdvanceAmount() {
    if (!this.newTicket.isAdvanceRequired) {
      this.newTicket.advanceAmount = 0;
    }
    if (this.newTicket.advanceAmount > this.newTicket.finalAmount) {
      this.isValidAdvanceAmount = false;
    } else {
      this.isValidAdvanceAmount = true;
    }
  }

  toggleUploadQuotationDialog() {
    this.showUploadQuotationDialog = !this.showUploadQuotationDialog;
  }

  async submitComplianceRequest() {
    this.showLoader = true;
    let ticket: any;

    if (this.editMode) {
      ticket = {} as UpdateComplianceTicketDto;
      ticket.id = this.newTicket.id;
    } else {
      ticket = {} as CreateComplianceTicketDto;
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
    ticket.offRoadReason = this.newTicket.offRoadReason;
    ticket.offRoadStatusChangeDate = this.newTicket.offRoadStatusChangeDate;
    ticket.typeOfCompliance = this.newTicket.typeOfCompliance;
    ticket.vendorId = this.newTicket.vendorId;
    ticket.renewalFees = this.newTicket.renewalFees;
    ticket.agentFees = this.newTicket.agentFees;
    ticket.miscAmount = this.newTicket.miscAmount;
    ticket.penaltyFees = this.newTicket.penaltyFees;
    ticket.gstAmount = this.newTicket.gstAmount;
    ticket.finalAmount = this.newTicket.finalAmount;
    ticket.quotationAttachment = this.newTicket.quotationAttachment;

    ticket.overallComment = this.newTicket.overallComment;
    ticket.isAdvanceRequired = this.newTicket.isAdvanceRequired ? 1 : 0;
    ticket.advanceAmount = this.newTicket.advanceAmount;

    // Handle approval requirements
    if (this.newTicket.finalAmount >= 1 && this.newTicket.finalAmount <= 1000) {
      ticket.isRMApprovalRequired = 0;
      ticket.isNFMApprovalRequired = 0;
      ticket.isZMApprovalRequired = 0;
      ticket.isVPApprovalRequired = 0; // No approvals required for this range
    } else if (
      this.newTicket.finalAmount >= 1001 &&
      this.newTicket.finalAmount <= 7500
    ) {
      ticket.isRMApprovalRequired = 1; // RM approval required
      ticket.isNFMApprovalRequired = 0; // NFM approval not required
      ticket.isZMApprovalRequired = 0; // ZM approval not required
      ticket.isVPApprovalRequired = 0; // VP approval not required
    } else if (
      this.newTicket.finalAmount >= 7501 &&
      this.newTicket.finalAmount <= 50000
    ) {
      ticket.isRMApprovalRequired = 1; // RM approval required
      ticket.isNFMApprovalRequired = 1; // NFM approval required
      ticket.isZMApprovalRequired = 1; // ZM approval required
      ticket.isVPApprovalRequired = 0; // VP approval not required
    } else if (this.newTicket.finalAmount > 50000) {
      ticket.isRMApprovalRequired = 1; // RM approval required
      ticket.isNFMApprovalRequired = 1; // NFM approval required
      ticket.isZMApprovalRequired = 1; // ZM approval required
      ticket.isVPApprovalRequired = 1; // VP approval required
    }

    // Handle vehicle details
    const previousOffRoadStatus = this.vehicleDetails.is_Vehicle_Offroad;
    const previousVehicleSubStatus = this.vehicleDetails.vehicle_Sub_Status;

    // Initialize vehicle object
    let vehicle: UpdateVehicleDetailsDto = {
      registration_No: this.newTicket.registrationNumber,
    };

    // Perform logic to update vehicle details based on changes
    if (this.newTicket.isVehicleOffRoad) {
      if (previousOffRoadStatus === 'FALSE') {
        if (previousVehicleSubStatus === 'On Route') {
          this.vehicleDetails.onRoute_To_Date = new Date().toISOString();
        } else if (previousVehicleSubStatus === 'Stand By') {
          this.vehicleDetails.standBy_To_Date = new Date().toISOString();
        }

        this.vehicleDetails.is_Vehicle_Offroad = 'TRUE';
        this.vehicleDetails.offroad_From_Date = new Date().toISOString();
        this.vehicleDetails.offroad_Reason = this.newTicket.offRoadReason || '';
      }
    } else {
      if (previousOffRoadStatus === 'TRUE') {
        this.vehicleDetails.offroad_To_Date = new Date().toISOString();
      }

      this.vehicleDetails.is_Vehicle_Offroad = 'FALSE';
      this.vehicleDetails.vehicle_Sub_Status = this.newTicket.vehicleSubStatus;

      if (this.newTicket.vehicleSubStatus === 'On Route') {
        if (previousVehicleSubStatus === 'Stand By') {
          this.vehicleDetails.standBy_To_Date = new Date().toISOString();
        }
        this.vehicleDetails.onRoute_From_Date = new Date().toISOString();
        this.vehicleDetails.onRoute_To_Date = '';
      } else if (this.newTicket.vehicleSubStatus === 'Stand By') {
        if (previousVehicleSubStatus === 'On Route') {
          this.vehicleDetails.onRoute_To_Date = new Date().toISOString();
        }
        this.vehicleDetails.standBy_From_Date = new Date().toISOString();
        this.vehicleDetails.standBy_To_Date = '';
      }
    }

    // Finalize the vehicle details object
    vehicle = {
      ...vehicle,
      vehicleSubStatus: this.vehicleDetails.vehicle_Sub_Status,
      standBy_FromDate: this.vehicleDetails.standBy_From_Date,
      standBy_ToDate: this.vehicleDetails.standBy_To_Date,
      onRoute_FromDate: this.vehicleDetails.onRoute_From_Date,
      onRoute_ToDate: this.vehicleDetails.onRoute_To_Date,
      off_Road: this.vehicleDetails.is_Vehicle_Offroad,
      offroad_Date: this.vehicleDetails.offroad_From_Date,
      offroad_ToDate: this.vehicleDetails.offroad_To_Date,
      offroad_Reason: this.vehicleDetails.offroad_Reason,
    };

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
          ? this.complianceService.complianceRequestUpdateComplianceRequestPut(
              ticket
            )
          : this.complianceService.complianceRequestCreateComplianceRequestPost(
              ticket
            )
      );

      const res2 = await firstValueFrom(
        this.commonService.bulkUploadUpdateVehicleDetailsPut(vehicle)
      );

      if (res1 && (res1.created || res1.updated)) {
        this.formActionsDisabled = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Compliance Request ${
            this.editMode ? 'Updated' : 'Created'
          } Successfully`,
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['compliance-requests']);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error:', err);
    }
    this.showLoader = false;
  }
}
