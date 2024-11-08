import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  NewBatteryTicket,
  SharedService,
} from '../../../services/shared.service';
import { Router } from '@angular/router';
import {
  BatteryRequestService,
  BulkUploadService,
  CreateBatteryRequestDto,
  UpdateBatteryRequestDto,
  UpdateVehicleDetailsDto,
  VehicleDetailsDto,
  VendorForSelectDto,
} from '../../../../swagger';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-battery-request',
  templateUrl: './create-battery-request.component.html',
  styleUrl: './create-battery-request.component.scss',
})
export class CreateBatteryRequestComponent {
  editMode: boolean = false;
  formActionsDisabled = false;
  showLoader: boolean = false;
  newTicket!: NewBatteryTicket;
  registrationNumbers: any = [];
  offRoadReasons: any = [];
  onRoadSubStatuses: ['Stand By', 'On Route'] = ['Stand By', 'On Route'];
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

  batteryMakes: string[] = [];
  batteryModels: string[] = [];

  showUploadQuotationDialog: boolean = false;

  doesSerialNumberMatch: boolean = false;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private batteryService: BatteryRequestService,
    private commonService: BulkUploadService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.sharedService.newBatteryTicket$.subscribe(
      (newTicket: NewBatteryTicket) => {
        this.newTicket = newTicket;
      }
    );
    if (this.isAnyFieldEmpty(this.newTicket)) {
      if (!this.newTicket.id) {
        this.router.navigate(['/battery-requests']);
      } else {
        this.editMode = true;
      }
    } else {
      this.loadVehicleRegistrationNumbers();
      this.loadVehicleOffRoadReasons();
      this.loadVendorNames();
      this.loadBatteryMakes();
      this.loadBatteryModels();
    }
    if (this.editMode) {
      this.loadTicketDetails(parseInt(this.newTicket.id));
    }
  }

  isAnyFieldEmpty(ticket: NewBatteryTicket): boolean {
    return !ticket.zone || !ticket.region || !ticket.branch || !ticket.hub;
  }

  async loadTicketDetails(id: number) {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryDetailsByIdGet(id)
      );
      if (res) {
        this.newTicket.zone = res.zone!;
        this.newTicket.region = res.region!;
        this.newTicket.branch = res.branch!;
        this.newTicket.hub = res.hub!;
        await this.loadVehicleRegistrationNumbers();
        await this.loadVehicleOffRoadReasons();
        await this.loadVendorNames();
        await this.loadBatteryMakes();
        await this.loadBatteryModels();
        this.newTicket.hasAdvanceRejected =
          res.hasAdvanceRejected == 0 ? false : true;
        this.newTicket.registrationNumber = res.registrationNumber!;
        this.newTicket.vehicleAge = res.vehicleAge!;
        this.newTicket.manufacturer = res.manufacturer!;
        this.newTicket.model = res.model!;
        this.newTicket.vehicleSubStatus = res.vehicleSubStatus!;
        this.newTicket.isVehicleOffRoad =
          res.isVehicleOffRoad == 0 ? false : true;
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
        this.newTicket.battery_Serial_Number = res.battery_Serial_Number!;
        this.newTicket.current_Battery_Serial_Number = res.typed_Serial_Number!;
        this.newTicket.battery_Make = res.battery_Make;
        this.newTicket.battery_Model = res.battery_Model;
        this.newTicket.battery_Invoice_Date = res.battery_Invoice_Date;
        this.newTicket.battery_Warranty = res.battery_Warranty!;
        this.newTicket.battery_Vendor_Name = res.battery_Vendor_Name;
        this.newTicket.battery_Cost = res.battery_Cost;
        this.newTicket.battery_Age = res.battery_Age!;
        this.newTicket.battery_Scrap_Value = res.battery_Scrap_Value;

        // New Battery Details
        this.newTicket.new_Battery_Make = res.new_Battery_Make;
        this.newTicket.new_Battery_Model = res.new_Battery_Model;
        this.newTicket.new_Battery_VendorId = res.new_Battery_Vendor_Id!;
        this.newTicket.new_Battery_Cost = res.new_Battery_Cost!;
        this.newTicket.new_Battery_GST = res.new_Battery_GST!;
        this.newTicket.new_Battery_Estimated_Cost = res.new_Battery_Total!;

        this.newTicket.quotationAttachment = res.quotationAttachment;
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

  hash(serialNumber: string | undefined): string | undefined {
    if (!serialNumber) {
      return;
    }
    return '#'.repeat(serialNumber.length - 2) + serialNumber.slice(-2);
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

      this.loadVehicleBatteryDetails();
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

  checkOffRoadReasonExists(reason: string) {
    return this.offRoadReasons.some(
      (entry: any) => entry.reason.toUpperCase() == reason.toUpperCase()
    );
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

  async loadVehicleBatteryDetails() {
    if (!this.newTicket.registrationNumber) {
      return;
    }

    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryDetailsViaRegistrationNumberGet(
          this.newTicket.registrationNumber
        )
      );
      if (res && res.success) {
        const batteryDetails = res.data;
        this.newTicket.battery_Serial_Number =
          batteryDetails.battery_Serial_Number;
        this.newTicket.battery_Make = batteryDetails.battery_Make;
        this.newTicket.battery_Model = batteryDetails.battery_Model;
        this.newTicket.battery_Invoice_Date =
          batteryDetails.battery_Invoice_Date;
        this.newTicket.battery_Warranty = batteryDetails.battery_Warranty;
        this.newTicket.battery_Vendor_Name = batteryDetails.battery_Vendor_Name;
        this.newTicket.battery_Cost = batteryDetails.battery_Cost;
        this.newTicket.battery_Age = this.batteryAgeSince(
          batteryDetails.battery_Invoice_Date
        );
        this.newTicket.battery_Scrap_Value = batteryDetails.battery_Scrap_Value;
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  batteryAgeSince(battery_Invoice_Date: string): number {
    let givenDate: Date;

    // Split the date string
    const dateParts = battery_Invoice_Date.split('-');

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

    let monthsDifference =
      (currentDate.getFullYear() - givenDate.getFullYear()) * 12 +
      (currentDate.getMonth() - givenDate.getMonth());

    // If the current day of the month is less than the given day, subtract one month
    if (currentDate.getDate() < givenDate.getDate()) {
      monthsDifference--;
    }

    // Ensure the result is a number
    return Math.max(0, Math.floor(monthsDifference)); // Return the integer part, ensuring non-negative
  }

  async loadBatteryMakes() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryMakesGet()
      );
      if (res && res.length) {
        this.batteryMakes = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadBatteryModels() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryModelsGet()
      );
      if (res && res.length) {
        this.batteryModels = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
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

  toggleUploadQuotationDialog() {
    this.showUploadQuotationDialog = !this.showUploadQuotationDialog;
  }

  async checkSerialNumber(serialNumber: string) {
    if (!serialNumber) {
      return;
    }
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestCheckBatterySerialNumberGet(
          this.newTicket.registrationNumber,
          serialNumber
        )
      );
      if (res && res.success) {
        this.doesSerialNumberMatch = res.data.isMatch;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  updateTotalEstimatedCost() {
    this.newTicket.new_Battery_Estimated_Cost =
      (this.newTicket.new_Battery_Cost || 0) *
      (1 + this.newTicket.new_Battery_GST / 100 || 0);
  }

  checkValidAdvanceAmount() {
    if (!this.newTicket.isAdvanceRequired) {
      this.newTicket.advanceAmount = 0;
    }
    if (
      this.newTicket.advanceAmount > this.newTicket.new_Battery_Estimated_Cost
    ) {
      this.isValidAdvanceAmount = false;
    } else {
      this.isValidAdvanceAmount = true;
    }
  }

  async submitBatteryRequest() {
    // console.log(this.newTicket);
    this.showLoader = true;
    let ticket: any;

    if (this.editMode) {
      ticket = {} as UpdateBatteryRequestDto;
      ticket.id = this.newTicket.id;
    } else {
      ticket = {} as CreateBatteryRequestDto;
    }

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

    // Battery details
    ticket.battery_Serial_Number = this.newTicket.battery_Serial_Number;
    ticket.typed_Serial_Number = this.newTicket.current_Battery_Serial_Number;
    ticket.battery_Make = this.newTicket.battery_Make;
    ticket.battery_Model = this.newTicket.battery_Model;
    ticket.battery_Invoice_Date = this.newTicket.battery_Invoice_Date;
    ticket.battery_Warranty = this.newTicket.battery_Warranty;
    ticket.battery_Vendor_Name = this.newTicket.battery_Vendor_Name;
    ticket.battery_Cost = this.newTicket.battery_Cost;
    ticket.battery_Age = this.newTicket.battery_Age;
    ticket.battery_Scrap_Value = this.newTicket.battery_Scrap_Value;

    // New battery details
    ticket.new_Battery_Make = this.newTicket.new_Battery_Make;
    ticket.new_Battery_Model = this.newTicket.new_Battery_Model;
    ticket.new_Battery_VendorId = this.newTicket.new_Battery_VendorId;
    ticket.new_Battery_Cost = this.newTicket.new_Battery_Cost;
    ticket.new_Battery_GST = this.newTicket.new_Battery_GST;
    ticket.new_Battery_Estimated_Cost =
      this.newTicket.new_Battery_Estimated_Cost;

    ticket.current_Battery_Serial_Number =
      this.newTicket.current_Battery_Serial_Number;
    ticket.quotationAttachment = this.newTicket.quotationAttachment;
    ticket.isAdvanceRequired = this.newTicket.isAdvanceRequired ? 1 : 0;
    ticket.advanceAmount = this.newTicket.advanceAmount;
    ticket.overallComment = this.newTicket.overallComment;

    // Approval requirements based on newBatteryEstimatedCost
    const cost = this.newTicket.new_Battery_Estimated_Cost;
    if (cost >= 1 && cost <= 1000) {
      ticket.isRMApprovalRequired = 0;
      ticket.isNFMApprovalRequired = 0;
      ticket.isZMApprovalRequired = 0;
      ticket.isVPApprovalRequired = 0;
    } else if (cost >= 1001 && cost <= 7500) {
      ticket.isRMApprovalRequired = 1;
      ticket.isNFMApprovalRequired = 0;
      ticket.isZMApprovalRequired = 0;
      ticket.isVPApprovalRequired = 0;
    } else if (cost >= 7501 && cost <= 50000) {
      ticket.isRMApprovalRequired = 1;
      ticket.isNFMApprovalRequired = 1;
      ticket.isZMApprovalRequired = 1;
      ticket.isVPApprovalRequired = 0;
    } else if (cost > 50000) {
      ticket.isRMApprovalRequired = 1;
      ticket.isNFMApprovalRequired = 1;
      ticket.isZMApprovalRequired = 1;
      ticket.isVPApprovalRequired = 1;
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

    // API call
    try {
      const response = await firstValueFrom(
        this.editMode
          ? this.batteryService.batteryRequestUpdateBatteryRequestPut(ticket)
          : this.batteryService.batteryRequestCreateBatteryRequestPost(ticket)
      );

      await firstValueFrom(
        this.commonService.bulkUploadUpdateVehicleDetailsPut(vehicle)
      );

      if (response && response.success) {
        this.formActionsDisabled = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Battery Request ${
            this.editMode ? 'Updated' : 'Created'
          } Successfully`,
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['battery-requests']);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error:', err);
    }
    this.showLoader = false;
  }
}
