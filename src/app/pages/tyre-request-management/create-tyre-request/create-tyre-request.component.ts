import { Component } from '@angular/core';
import { NewTyreTicket, SharedService } from '../../../services/shared.service';
import {
  BulkUploadService,
  CreateTyreRequestDto,
  TyreDetailsDto,
  TyreRequestService,
  UpdateVehicleDetailsDto,
  VehicleDetailsDto,
  VendorForSelectDto,
} from '../../../../swagger';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { formatDate } from '@angular/common';
import { UpdateTyreRequestDto } from '../../../../swagger/model/updateTyreRequestDto';

interface SerialNumbers {
  enc: string;
  value: string;
}

@Component({
  selector: 'app-create-tyre-request',
  templateUrl: './create-tyre-request.component.html',
  styleUrl: './create-tyre-request.component.scss',
})
export class CreateTyreRequestComponent {
  editMode: boolean = false;
  formActionsDisabled = false;
  showLoader: boolean = false;
  newTicket!: NewTyreTicket | any;
  registrationNumbers: any = [];
  offRoadReasons: any = [];
  onRoadSubStatuses: ['Stand By', 'On Route'] = ['Stand By', 'On Route'];
  vendors: VendorForSelectDto[] = [];

  dates: {
    offRoadStatusChangeDate: Date | undefined;
  } = {
    offRoadStatusChangeDate: undefined,
  };

  dateFormat: string = 'dd/mm/yy';

  minDate: Date | undefined;
  maxDate: Date | undefined = new Date();
  isValidAdvanceAmount = true;

  vehicleDetails: VehicleDetailsDto = {};

  tyreSerialNumbers!: SerialNumbers[] | undefined;
  selectedTyreSerialNumbers: { tyreId: number; serialNumber: string }[] = [];

  tyreManufacturers: string[] = [];
  tyreModels: string[] = [];
  tyreTypes: string[] = [];
  tyreSizes: string[] = [];
  isTyreMakeModelNotAvailable: boolean = false;

  showUploadQuotationDialog: boolean = false;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private tyreService: TyreRequestService,
    private commonService: BulkUploadService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.sharedService.newTyreTicket$.subscribe((newTicket: NewTyreTicket) => {
      this.newTicket = newTicket;
    });
    if (this.isAnyFieldEmpty(this.newTicket)) {
      if (!this.newTicket.id) {
        this.router.navigate(['/tyre-requests']);
      } else {
        this.editMode = true;
      }
    } else {
      this.loadVehicleRegistrationNumbers();
      this.loadVehicleOffRoadReasons();
      this.loadVendorNames();
    }
    if (this.editMode) {
      this.loadTicketDetails(parseInt(this.newTicket.id));
    }
  }

  isAnyFieldEmpty(ticket: NewTyreTicket): boolean {
    return !ticket.zone || !ticket.region || !ticket.branch || !ticket.hub;
  }

  async loadTicketDetails(id: number) {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreRequestDetailsByIdGet(id)
      );
      if (res && res.registrationNumber) {
        this.newTicket.zone = res.zone!;
        this.newTicket.region = res.region!;
        this.newTicket.branch = res.branch!;
        this.newTicket.hub = res.hub!;
        await this.loadVehicleRegistrationNumbers();
        this.newTicket.registrationNumber = res.registrationNumber!;
        await this.loadVehicleOffRoadReasons();
        await this.loadVendorNames();
        await this.loadTyreSerialNumbers();
        this.newTicket.hasAdvanceRejected =
          res.hasAdvanceRejected == 0 ? false : true;
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

        this.newTicket.tyreQty = res.tyreQuantity!;

        this.newTicket.selected_tyre1_serial_number =
          res.selectedTyre1SerialNumber;
        this.newTicket.typed_tyre1_serial_number = res.typedTyre1SerialNumber;
        this.newTicket.selected_tyre1_Manufacturer =
          res.selectedTyre1Manufacturer;
        this.newTicket.selected_tyre1_Model = res.selectedTyre1Model;
        this.newTicket.selected_tyre1_Size = res.selectedTyre1Size;
        this.newTicket.selected_tyre1_Fitment_Date =
          res.selectedTyre1FitmentDate;
        this.newTicket.tyre1_attachment = res.tyre1Attachment;

        this.newTicket.selected_tyre2_serial_number =
          res.selectedTyre2SerialNumber;
        this.newTicket.typed_tyre2_serial_number = res.typedTyre2SerialNumber;
        this.newTicket.selected_tyre2_Manufacturer =
          res.selectedTyre2Manufacturer;
        this.newTicket.selected_tyre2_Model = res.selectedTyre2Model;
        this.newTicket.selected_tyre2_Size = res.selectedTyre2Size;
        this.newTicket.selected_tyre2_Fitment_Date =
          res.selectedTyre2FitmentDate;
        this.newTicket.tyre2_attachment = res.tyre2Attachment;

        this.newTicket.selected_tyre3_serial_number =
          res.selectedTyre3SerialNumber;
        this.newTicket.typed_tyre3_serial_number = res.typedTyre3SerialNumber;
        this.newTicket.selected_tyre3_Manufacturer =
          res.selectedTyre3Manufacturer;
        this.newTicket.selected_tyre3_Model = res.selectedTyre3Model;
        this.newTicket.selected_tyre3_Size = res.selectedTyre3Size;
        this.newTicket.selected_tyre3_Fitment_Date =
          res.selectedTyre3FitmentDate;
        this.newTicket.tyre3_attachment = res.tyre3Attachment;

        this.newTicket.selected_tyre4_serial_number =
          res.selectedTyre4SerialNumber;
        this.newTicket.typed_tyre4_serial_number = res.typedTyre4SerialNumber;
        this.newTicket.selected_tyre4_Manufacturer =
          res.selectedTyre4Manufacturer;
        this.newTicket.selected_tyre4_Model = res.selectedTyre4Model;
        this.newTicket.selected_tyre4_Size = res.selectedTyre4Size;
        this.newTicket.selected_tyre4_Fitment_Date =
          res.selectedTyre4FitmentDate;
        this.newTicket.tyre4_attachment = res.tyre4Attachment;

        this.newTicket.selected_tyre5_serial_number =
          res.selectedTyre5SerialNumber;
        this.newTicket.typed_tyre5_serial_number = res.typedTyre5SerialNumber;
        this.newTicket.selected_tyre5_Manufacturer =
          res.selectedTyre5Manufacturer;
        this.newTicket.selected_tyre5_Model = res.selectedTyre5Model;
        this.newTicket.selected_tyre5_Size = res.selectedTyre5Size;
        this.newTicket.selected_tyre5_Fitment_Date =
          res.selectedTyre5FitmentDate;
        this.newTicket.tyre5_attachment = res.tyre5Attachment;

        this.selectedTyreSerialNumbers = [];

        for (let i = 1; i <= res.tyreQuantity!; i++) {
          const serialNumber =
            res[`selectedTyre${i}SerialNumber` as keyof TyreDetailsDto];
          if (serialNumber) {
            this.selectedTyreSerialNumbers.push({
              tyreId: i,
              serialNumber: serialNumber as string,
            });
          }
        }
        console.log(this.selectedTyreSerialNumbers);
        // Cost Details
        this.newTicket.estimated_Tyre_Cost = res.estimatedTyreCost;
        this.newTicket.estimated_Tyre_GST = res.estimatedTyreGst;
        this.newTicket.estimated_Tyre_Total = res.estimatedTyreTotal;
        this.newTicket.selected_VendorId = res.selectedVendorId;

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
          await this.loadTyreSerialNumbers();
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
    }
  }

  async loadTyreSerialNumbers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetAllTyreSerialNumbersGet(
          this.newTicket.registrationNumber
        )
      );
      if (res.success && res.data.length) {
        this.tyreSerialNumbers = res.data.map((serialNum: string) => ({
          enc: '#'.repeat(serialNum.length - 2) + serialNum.slice(-2),
          value: serialNum,
        }));
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
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

  getFilteredTyreSerialNumbers() {
    if (!this.tyreSerialNumbers) {
      return;
    }
    return this.tyreSerialNumbers.filter(
      (serial: SerialNumbers) =>
        !this.selectedTyreSerialNumbers.some(
          (selected) => selected.serialNumber === serial.value
        )
    );
  }

  hash(serialNumber: string | undefined): string | undefined {
    if (!serialNumber) {
      return;
    }
    return '#'.repeat(serialNumber.length - 2) + serialNumber.slice(-2);
  }

  onTyreSerialNumberChange(tyreId: number, selectedValue: string | null) {
    if (selectedValue) {
      // Check if the tyreId is already in selectedTyreSerialNumbers
      const existingIndex = this.selectedTyreSerialNumbers.findIndex(
        (item) => item.tyreId === tyreId
      );

      if (existingIndex > -1) {
        // Update the serial number for the existing tyreId
        this.selectedTyreSerialNumbers[existingIndex].serialNumber =
          selectedValue;
      } else {
        // Add a new entry if the tyreId does not exist in the array
        this.selectedTyreSerialNumbers.push({
          tyreId,
          serialNumber: selectedValue,
        });
      }
    }

    // If value is cleared, remove it from the set
    if (!selectedValue) {
      const index = this.selectedTyreSerialNumbers.findIndex(
        (item) => item.tyreId === tyreId
      );
      if (index > -1) this.selectedTyreSerialNumbers.splice(index, 1);
      this.newTicket[`typed_tyre${tyreId}_serial_number`] = undefined;
      this.newTicket[
        `selected_tyre${tyreId}_Manufacturer` as keyof NewTyreTicket
      ] = undefined;
      this.newTicket[`selected_tyre${tyreId}_Model` as keyof NewTyreTicket] =
        undefined;
      this.newTicket[`selected_tyre${tyreId}_Size` as keyof NewTyreTicket] =
        undefined;
      this.newTicket[
        `selected_tyre${tyreId}_Fitment_Date` as keyof NewTyreTicket
      ] = undefined;
    }

    // Load tyre details or any other necessary logic
    this.loadTyreDetails(tyreId);
  }

  async loadTyreDetails(i: number) {
    const tyreSerialNumber =
      this.newTicket[`selected_tyre${i}_serial_number` as keyof NewTyreTicket];

    if (!tyreSerialNumber) {
      return;
    }

    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreDetailsGet(
          tyreSerialNumber.toString()
        )
      );

      if (res && res.success) {
        this.newTicket[
          `selected_tyre${i}_Manufacturer` as keyof NewTyreTicket
        ] = res.data.tyre_Manufacturer;
        this.newTicket[`selected_tyre${i}_Model` as keyof NewTyreTicket] = res
          .data.tyre_Model as string;
        this.newTicket[`selected_tyre${i}_Size` as keyof NewTyreTicket] =
          res.data.tyre_Size;
        (this.newTicket[
          `selected_tyre${i}_Fitment_Date` as keyof NewTyreTicket
        ] as string) = formatDate(res.data.fitment_Date, 'dd-MM-yyyy', 'en-US');
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      this.showLoader = false;
    }
  }

  doesSerialNumberMatch(id: number): boolean {
    if (this.newTicket[`typed_tyre${id}_serial_number`] == undefined) {
      return false;
    }
    return (
      this.newTicket[`typed_tyre${id}_serial_number`] ==
      this.newTicket[`selected_tyre${id}_serial_number`]
    );
  }

  toggleUploadQuotationDialog() {
    this.showUploadQuotationDialog = !this.showUploadQuotationDialog;
  }

  updateTotalEstimatedCost() {
    this.newTicket.estimated_Tyre_Total =
      this.newTicket.tyreQty *
      ((this.newTicket.estimated_Tyre_Cost || 0) *
        (1 + this.newTicket.estimated_Tyre_GST / 100 || 0));
  }

  checkValidAdvanceAmount() {
    if (!this.newTicket.isAdvanceRequired) {
      this.newTicket.advanceAmount = 0;
    }
    if (this.newTicket.advanceAmount > this.newTicket.estimated_Tyre_Total) {
      this.isValidAdvanceAmount = false;
    } else {
      this.isValidAdvanceAmount = true;
    }
  }

  async submitTyreRequest() {
    console.log(this.newTicket);
    this.showLoader = true;
    let ticket: any;

    if (this.editMode) {
      ticket = {} as UpdateTyreRequestDto;
      ticket.id = this.newTicket.id;
    } else {
      ticket = {} as CreateTyreRequestDto;
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

    // Tyre details
    ticket.selectedTyre1SerialNumber =
      this.newTicket.selected_tyre1_serial_number;
    ticket.typedTyre1SerialNumber = this.newTicket.typed_tyre1_serial_number;
    ticket.selectedTyre1Manufacturer =
      this.newTicket.selected_tyre1_Manufacturer;
    ticket.selectedTyre1Model = this.newTicket.selected_tyre1_Model;
    ticket.selectedTyre1Size = this.newTicket.selected_tyre1_Size;
    ticket.selectedTyre1FitmentDate =
      this.newTicket.selected_tyre1_Fitment_Date;
    ticket.tyre1Attachment = this.newTicket.tyre1_attachment;

    ticket.selectedTyre2SerialNumber =
      this.newTicket.selected_tyre2_serial_number;
    ticket.typedTyre2SerialNumber = this.newTicket.typed_tyre2_serial_number;
    ticket.selectedTyre2Manufacturer =
      this.newTicket.selected_tyre2_Manufacturer;
    ticket.selectedTyre2Model = this.newTicket.selected_tyre2_Model;
    ticket.selectedTyre2Size = this.newTicket.selected_tyre2_Size;
    ticket.selectedTyre2FitmentDate =
      this.newTicket.selected_tyre2_Fitment_Date;
    ticket.tyre2Attachment = this.newTicket.tyre2_attachment;

    ticket.selectedTyre3SerialNumber =
      this.newTicket.selected_tyre3_serial_number;
    ticket.typedTyre3SerialNumber = this.newTicket.typed_tyre3_serial_number;
    ticket.selectedTyre3Manufacturer =
      this.newTicket.selected_tyre3_Manufacturer;
    ticket.selectedTyre3Model = this.newTicket.selected_tyre3_Model;
    ticket.selectedTyre3Size = this.newTicket.selected_tyre3_Size;
    ticket.selectedTyre3FitmentDate =
      this.newTicket.selected_tyre3_Fitment_Date;
    ticket.tyre3Attachment = this.newTicket.tyre3_attachment;

    ticket.selectedTyre4SerialNumber =
      this.newTicket.selected_tyre4_serial_number;
    ticket.typedTyre4SerialNumber = this.newTicket.typed_tyre4_serial_number;
    ticket.selectedTyre4Manufacturer =
      this.newTicket.selected_tyre4_Manufacturer;
    ticket.selectedTyre4Model = this.newTicket.selected_tyre4_Model;
    ticket.selectedTyre4Size = this.newTicket.selected_tyre4_Size;
    ticket.selectedTyre4FitmentDate =
      this.newTicket.selected_tyre4_Fitment_Date;
    ticket.tyre4Attachment = this.newTicket.tyre4_attachment;

    ticket.selectedTyre5SerialNumber =
      this.newTicket.selected_tyre5_serial_number;
    ticket.typedTyre5SerialNumber = this.newTicket.typed_tyre5_serial_number;
    ticket.selectedTyre5Manufacturer =
      this.newTicket.selected_tyre5_Manufacturer;
    ticket.selectedTyre5Model = this.newTicket.selected_tyre5_Model;
    ticket.selectedTyre5Size = this.newTicket.selected_tyre5_Size;
    ticket.selectedTyre5FitmentDate =
      this.newTicket.selected_tyre5_Fitment_Date;
    ticket.tyre5Attachment = this.newTicket.tyre5_attachment;

    // Cost Details
    ticket.estimatedTyreCost = this.newTicket.estimated_Tyre_Cost;
    ticket.estimatedTyreGst = this.newTicket.estimated_Tyre_GST;
    ticket.estimatedTyreTotal = this.newTicket.estimated_Tyre_Total;
    ticket.selectedVendorId = this.newTicket.selected_VendorId;
    ticket.quotationAttachment = this.newTicket.quotationAttachment;
    ticket.isAdvanceRequired = this.newTicket.isAdvanceRequired ? 1 : 0;
    ticket.advanceAmount = this.newTicket.advanceAmount;
    ticket.overallComment = this.newTicket.overallComment;
    ticket.tyreQty = this.newTicket.tyreQty;

    // Approval requirements based on newBatteryEstimatedCost
    const cost = ticket.estimatedTyreTotal!;
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
          ? this.tyreService.tyreRequestUpdateTyreRequestPut(ticket)
          : this.tyreService.tyreRequestCreateTyreRequestPost(ticket)
      );

      await firstValueFrom(
        this.commonService.bulkUploadUpdateVehicleDetailsPut(vehicle)
      );

      if (response && response.success) {
        this.formActionsDisabled = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Tyre Request ${
            this.editMode ? 'Updated' : 'Created'
          } Successfully`,
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['tyre-requests']);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error:', err);
    }
    this.showLoader = false;
  }
}
