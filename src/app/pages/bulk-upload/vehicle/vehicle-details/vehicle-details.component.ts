import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AddBatteryDto,
  AddTyreDto,
  AdminService,
  BatteryRequestService,
  BulkUploadService,
  OffRoadReasonDto,
  TyreRequestService,
  VehicleDetailsDto,
  VendorForSelectDto,
} from '../../../../../swagger';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss',
})
export class VehicleDetailsComponent {
  @Input('Registration_No') registrationNo: string | undefined;
  editMode: boolean = false;
  showLoader: boolean = false;
  showAddBatteryDialog: boolean = false;
  showAddTyreDialog: boolean = false;
  currentUploadField: string | undefined;
  showUploadAttachmentDialog: boolean = false;

  onRoadSubStatuses: ['Stand By', 'On Route'] = ['Stand By', 'On Route'];

  dates: {
    dateOfLastService: Date | undefined;
    offRoadStatusChangeDate: Date | undefined;
  } = {
    dateOfLastService: undefined,
    offRoadStatusChangeDate: undefined,
  };
  dateFormat: string = 'dd/mm/yy';

  isVehicleDetailsNotAvailable: boolean = false;
  vehicleManufacturers: string[] = [];
  vehicleModels: string[] = [];

  zones: any = [];
  regions: any = [];
  branches: any = [];
  hubs: any = [];

  batterySerialNumbers: string[] = [];
  tyreSerialNumbers: string[] = [];
  selectedTyreSerialNumbers: { tyreId: number; serialNumber: string }[] = [];

  is_Vehicle_Offroad: boolean = false;

  vehicleDetails: VehicleDetailsDto | any = {
    // Basic Details
    vehicle_Wheeler: '',
    registration_No: '',
    registration_Date: '',
    chassis_Number: '',
    manufacturer: '',
    model: '',
    hypothecation_Branch: '',
    asset_Number: '',
    engine_Number: '',
    make_Year: '',
    hypothecation_Bank_Name: '',
    owner_Name: '',
    vehicle_Scrap_Status: '',
    vehicle_Image: undefined,
    is_Vehicle_Offroad: '',
    offroad_Reason: '',
    offroad_From_Date: undefined,
    vehicle_Sub_Status: '',

    // Technical Details
    cubic_Capacity: '',
    fuel_Capacity: undefined,
    adblue_Capacity: undefined,
    ground_Clearance: '',
    fuel_Type: '',
    bs_Norms: '',
    seating_Capacity: '',

    // Location Details
    zone_Name: '',
    region_Name: '',
    branch_Name: '',
    hub_Name: '',

    // Security Details
    inaccessible_From_Outside: '',
    cctv: '',
    cctv_Count: 1,
    cctv_Vendor: '',
    fa_Code_Cctv_1: '',
    fa_Code_Cctv_2: '',
    fa_Code_Cctv_3: '',
    fa_Code_Cctv_4: '',
    panic_Switch: '',
    wire_Mesh: '',
    auto_Dialer: '',
    puncture_Kit: '',
    siren: '',
    emergency_Light: '',
    speed_Governor: '',
    rear_Entry_To_Vault: '',
    fire_Extinguisher: '',
    fire_Extinguisher_Capacity: undefined,
    mha_Compliant: '',
    gps_Device_Make: '',
    gps_Vendor: '',
    fa_Code_Gps: '',
    cassette_Provision: '',
    immobilizer: '',

    // Other Details
    branding: '',
    vehicle_Type: '',
    jack_And_Lever: '',
    safety_Triangle: '',
    name_Of_Branding: '',
    dcv_Non_Dcv: '',
    toolkit: '',
    first_Aid: '',
    rc_Document: undefined,

    // PetroCard Details
    petro_Card_Number: '',
    petro_Card_Company_Name: '',
    mobile_Linked_To_Petro_Card: '',
    petro_Card_Holder_Name: '',
    petro_Card_Holder_Mobile_Number: '',
    petro_Card_Holder_Employee_Id: '',
    petro_Card_Custodian_Designation: '',

    // Fastag Details
    fastag_Company_Name: '',
    fastag_Serial_Number: '',

    // Battery Details
    battery_Serial_Number: undefined,
    battery_Make: '',
    battery_Model: '',
    battery_Invoice_Date: undefined,
    battery_Warranty: undefined,
    battery_Vendor_Name: '',
    battery_Cost: undefined,

    // Tyre Details for 7 Tyres
    tyre1_Serial_Number: undefined,
    tyre1_Cost: undefined,
    tyre1_Manufacturer: '',
    tyre1_Size: '',
    tyre1_Make_Model: '',
    tyre1_Type: '',
    tyre1_Fitment_Date: '',
    tyre1_Vendor_Name: '',

    tyre2_Serial_Number: undefined,
    tyre2_Manufacturer: '',
    tyre2_Size: '',
    tyre2_Cost: undefined,
    tyre2_Make_Model: '',
    tyre2_Type: '',
    tyre2_Fitment_Date: '',
    tyre2_Vendor_Name: '',

    tyre3_Serial_Number: undefined,
    tyre3_Manufacturer: '',
    tyre3_Size: '',
    tyre3_Cost: undefined,
    tyre3_Make_Model: '',
    tyre3_Type: '',
    tyre3_Fitment_Date: '',
    tyre3_Vendor_Name: '',

    tyre4_Serial_Number: undefined,
    tyre4_Manufacturer: '',
    tyre4_Size: '',
    tyre4_Cost: undefined,
    tyre4_Make_Model: '',
    tyre4_Type: '',
    tyre4_Fitment_Date: '',
    tyre4_Vendor_Name: '',

    tyre5_Serial_Number: undefined,
    tyre5_Manufacturer: '',
    tyre5_Size: '',
    tyre5_Cost: undefined,
    tyre5_Make_Model: '',
    tyre5_Type: '',
    tyre5_Fitment_Date: '',
    tyre5_Vendor_Name: '',

    tyre6_Serial_Number: undefined,
    tyre6_Manufacturer: '',
    tyre6_Size: '',
    tyre6_Cost: undefined,
    tyre6_Make_Model: '',
    tyre6_Type: '',
    tyre6_Fitment_Date: '',
    tyre6_Vendor_Name: '',

    tyre7_Serial_Number: undefined,
    tyre7_Manufacturer: '',
    tyre7_Size: '',
    tyre7_Cost: undefined,
    tyre7_Make_Model: '',
    tyre7_Type: '',
    tyre7_Fitment_Date: '',
    tyre7_Vendor_Name: '',
    spare_tyre_serial_number: undefined,

    // Vehicle Images / Document Uploads
    vehicle_Front: undefined,
    vehicle_Right: undefined,
    vehicle_Rear: undefined,
    vehicle_Left: undefined,
    dashboard: undefined,
    front_Right_Tyre: undefined,
    rear_Left_Tyre: undefined,
    front_Left_Tyre: undefined,
    rear_Right_Tyre: undefined,
    battery_With_Serial_Number: undefined,
    rc_Front_Side: undefined,
    rc_Back_Side: undefined,
    fitness_Document: undefined,
    vault: undefined,
    insurance_Document: undefined,
    goods_Permit: undefined,
    puc: undefined,
    chassis_Number_Plate: undefined,
    road_Tax_Document: undefined,
    national_Permit: undefined,
  };

  newBattery: AddBatteryDto = {
    batteryMake: '',
    batteryModel: '',
    batteryType: '',
    batteryVoltage: undefined,
    batteryAmp: undefined,
    warrantyMonths: undefined,
    batterySerialNumber: '',
    cost: undefined,
    invoiceDate: undefined,
    vendorId: undefined,
    invoiceNumber: '',
  };

  newTyre: AddTyreDto = {
    tyreManufacturer: '',
    tyreModel: '',
    tyreType: '',
    tyreSize: '',
    cost: undefined,
    fitmentDate: undefined,
    serialNumber: '',
    vendorId: undefined,
    registrationNo: undefined,
  };

  batteryMakes: string[] = [];
  batteryModels: string[] = [];
  batteryTypes: string[] = [];
  isSerialNumberTaken: boolean = false;

  tyreManufacturers: string[] = [];
  tyreModels: string[] = [];
  tyreTypes: string[] = [];
  tyreSizes: string[] = [];
  isTyreMakeModelNotAvailable: boolean = false;

  vendors: VendorForSelectDto[] = [];

  offRoadReasons: OffRoadReasonDto[] = [];

  minDate: Date | undefined;
  maxDate: Date | undefined = new Date();
  constructor(
    private commonService: BulkUploadService,
    private adminService: AdminService,
    private batteryService: BatteryRequestService,
    private tyreService: TyreRequestService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loadVehicleOffRoadReasons();
    this.loadZones();
    this.loadBatterySerialNumbers();
    this.loadVehicleManufacturers();
    if (this.registrationNo) {
      await this.loadVehicleDetails(this.registrationNo);
      this.loadTyreSerialNumbers();
      this.loadVehicleMakes();
      this.editMode = true;
    }
  }

  async loadVehicleDetails(registrationNo: string) {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.commonService.bulkUploadGetVehicleDetailsGet(registrationNo)
      );
      if (res && res.registration_No) {
        this.vehicleDetails = { ...res };
        this.is_Vehicle_Offroad =
          this.vehicleDetails.is_Vehicle_Offroad?.toLowerCase() == 'true';

        const registrationDate = this.vehicleDetails.registration_Date;
        const isValidDateFormat = /^\d{2}-\d{2}-\d{4}$/.test(registrationDate);
        let formattedDate = registrationDate; // Default to original date

        if (isValidDateFormat) {
          const dateParts = registrationDate.split('-');
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format to yyyy-mm-dd
        }
        // Now use the formatted date to create a Date object
        this.vehicleDetails.registration_Date = new Date(formattedDate);
        this.vehicleDetails.registration_Date = formatDate(
          this.vehicleDetails.registration_Date,
          'yyyy-MM-dd',
          'en-US'
        );
        if (
          this.offRoadReasons.indexOf(this.vehicleDetails.offroad_Reason) == -1
        ) {
          this.offRoadReasons.push({
            reason: this.vehicleDetails.offroad_Reason,
            id: this.offRoadReasons.length,
          });
        }
        this.dates.offRoadStatusChangeDate = new Date(
          this.vehicleDetails.offroad_From_Date
        );
        await this.loadRegions();
        this.vehicleDetails.region_Name = res.region_Name;
        await this.loadBranches();
        this.vehicleDetails.branch_Name = res.branch_Name;
        await this.loadHubs();
        this.vehicleDetails.hub_Name = res.hub_Name;
      } else {
        // this.router.navigate(['/bulk-upload/vehicle']);
      }
    } catch (err: any) {
      console.error(err);
      // this.router.navigate(['/bulk-upload/vehicle']);
    }
  }

  async loadVehicleManufacturers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.commonService.bulkUploadGetVehicleManufacturersGet()
      );
      if (res && res.success) {
        this.vehicleManufacturers = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadVehicleMakes() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.commonService.bulkUploadGetVehicleModelsGet(
          this.vehicleDetails.manufacturer!
        )
      );
      if (res && res.success) {
        this.vehicleModels = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
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
        this.vehicleDetails!.offroad_From_Date = updatedDate;
        break;
      default:
        throw new Error('Invalid Function Call');
    }
  }

  onFileChange(event: any) {}

  async loadZones() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(this.adminService.adminGetZonesGet());
      if (res && res.length) {
        this.zones = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadRegions() {
    this.showLoader = true;
    this.vehicleDetails.region_Name = '';
    this.vehicleDetails.hub_Name = '';
    this.vehicleDetails.branch_Name = '';
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetRegionsGet(
          undefined,
          this.vehicleDetails.zone_Name
        )
      );
      if (res && res.length) {
        this.regions = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadBranches() {
    this.showLoader = true;
    this.vehicleDetails.branch_Name = '';
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetBranchesGet(
          undefined,
          this.vehicleDetails.region_Name
        )
      );
      if (res && res.length) {
        this.branches = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadHubs() {
    this.showLoader = true;
    this.vehicleDetails.hub_Name = '';
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetHubsGet(this.vehicleDetails.branch_Name)
      );
      if (res && res.length) {
        this.hubs = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
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

  createArray(count: number): number[] {
    if (!isNaN(count) && count > 0 && count < 5) return new Array(count);
    return [];
  }

  async loadBatterySerialNumbers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetAllBatterySerialNumbersGet()
      );
      if (res && res.success) {
        this.batterySerialNumbers = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadBatteryDetails() {
    if (!this.vehicleDetails.battery_Serial_Number) {
      return;
    }
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryDetailsGet(
          this.vehicleDetails.battery_Serial_Number
        )
      );
      if (res && res.success) {
        const batteryDetails = res.data;
        this.vehicleDetails.battery_Make = batteryDetails.battery_Make;
        this.vehicleDetails.battery_Model = batteryDetails.battery_Model;
        this.vehicleDetails.battery_Invoice_Date = formatDate(
          batteryDetails.invoice_Date,
          'dd-MM-yyyy',
          'en-US'
        );
        this.vehicleDetails.battery_Warranty = batteryDetails.warranty_Months;
        this.vehicleDetails.battery_Vendor_Name = batteryDetails.name;
        this.vehicleDetails.battery_Cost = batteryDetails.cost;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  toggleAddBatteryDialog() {
    this.showAddBatteryDialog = !this.showAddBatteryDialog;
    if (!this.batteryMakes.length) {
      this.loadBatteryMakes();
    }
    if (!this.batteryModels.length) {
      this.loadBatteryModels();
    }
    if (!this.batteryTypes.length) {
      this.loadBatteryTypes();
    }
    if (!this.vendors.length) {
      this.loadVendorNames();
    }
    this.newBattery = {
      batteryMake: '',
      batteryModel: '',
      batteryType: '',
      batteryVoltage: undefined,
      batteryAmp: undefined,
      warrantyMonths: undefined,
      batterySerialNumber: '',
      cost: undefined,
      invoiceDate: undefined,
      vendorId: undefined,
      invoiceNumber: '',
    };
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

  async loadBatteryTypes() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryTypesGet()
      );
      if (res && res.length) {
        this.batteryTypes = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  checkBatterySerialNumber(serialNumber: string): void {
    if (serialNumber) {
      this.isSerialNumberTaken =
        this.batterySerialNumbers.includes(serialNumber);
    } else {
      this.isSerialNumberTaken = false; // Reset if input is empty
    }
  }

  async addBattery() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestCreateBatteryPost(this.newBattery)
      );

      if (res && res.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Added Successfully',
          detail: 'Battery added successfully.',
          life: 3000,
        });
        this.toggleAddBatteryDialog(); // Optional: Clear the form after successful addition
        this.loadBatterySerialNumbers();
      }
    } catch (err: any) {
      console.error(err);

      let errorMessage = 'An unexpected error occurred';

      if (err && err.error && err.error.message) {
        if (err.error.message.includes('Duplicate battery serial number')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Conflict',
            detail: 'A battery with the same serial number already exists.',
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            life: 5000,
          });
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000,
        });
      }
    }
    this.showLoader = false;
  }

  toggleAddTyreDialog() {
    this.showAddTyreDialog = !this.showAddTyreDialog;
    if (!this.tyreManufacturers.length) {
      this.loadTyreManufacturers();
    }
    if (!this.tyreTypes.length) {
      this.loadTyreTypes();
    }
    if (!this.tyreSizes.length) {
      this.loadTyreSizes();
    }
    if (!this.vendors.length) {
      this.loadVendorNames();
    }
    this.newTyre = {
      tyreManufacturer: '',
      tyreModel: '',
      tyreType: '',
      tyreSize: '',
      cost: undefined,
      fitmentDate: undefined,
      vendorId: undefined,
      serialNumber: '',
    };
  }

  getFilteredTyreSerialNumbers() {
    if (!this.tyreSerialNumbers) {
      return;
    }
    return this.tyreSerialNumbers.filter(
      (serial: string) =>
        !this.selectedTyreSerialNumbers.some(
          (selected) => selected.serialNumber === serial
        )
    );
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
      this.vehicleDetails[
        `tyre${tyreId}_Serial_Number` as keyof VehicleDetailsDto
      ] = undefined;
      this.vehicleDetails[
        `tyre${tyreId}_Manufacturer` as keyof VehicleDetailsDto
      ] = undefined;
      this.vehicleDetails[`tyre${tyreId}_Size` as keyof VehicleDetailsDto] =
        undefined;
      this.vehicleDetails[`tyre${tyreId}_Cost` as keyof VehicleDetailsDto] =
        undefined;
      this.vehicleDetails[
        `tyre${tyreId}_Make_Model` as keyof VehicleDetailsDto
      ] = undefined;
      this.vehicleDetails[`tyre${tyreId}_Type` as keyof VehicleDetailsDto] =
        undefined;
      this.vehicleDetails[
        `tyre${tyreId}_Fitment_Date` as keyof VehicleDetailsDto
      ] = undefined;
      this.vehicleDetails[
        `tyre${tyreId}_Vendor_Name` as keyof VehicleDetailsDto
      ] = undefined;
    }

    // Load tyre details or any other necessary logic
    this.loadTyreDetails(tyreId);
  }

  async loadTyreDetails(i: number) {
    const tyreSerialNumber =
      this.vehicleDetails[`tyre${i}_Serial_Number` as keyof VehicleDetailsDto];

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
        this.vehicleDetails[
          `tyre${i}_Serial_Number` as keyof VehicleDetailsDto
        ] = res.data.serial_Number;
        this.vehicleDetails[
          `tyre${i}_Manufacturer` as keyof VehicleDetailsDto
        ] = res.data.tyre_Manufacturer;
        this.vehicleDetails[`tyre${i}_Size` as keyof VehicleDetailsDto] =
          res.data.tyre_Size;
        this.vehicleDetails[`tyre${i}_Cost` as keyof VehicleDetailsDto] =
          res.data.cost;
        this.vehicleDetails[`tyre${i}_Make_Model` as keyof VehicleDetailsDto] =
          res.data.tyre_Model;
        this.vehicleDetails[`tyre${i}_Type` as keyof VehicleDetailsDto] =
          res.data.tyre_Type;
        (this.vehicleDetails[
          `tyre${i}_Fitment_Date` as keyof VehicleDetailsDto
        ] as string) = formatDate(res.data.fitment_Date, 'dd-MM-yyyy', 'en-US');
        this.vehicleDetails[`tyre${i}_Vendor_Name` as keyof VehicleDetailsDto] =
          res.data.name;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      this.showLoader = false;
    }
  }

  async loadTyreManufacturers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreMakesGet()
      );
      if (res.success && res.data.length) {
        this.tyreManufacturers = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadTyreModels() {
    if (!this.newTyre.tyreManufacturer) {
      return;
    }
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreModelsGet(
          this.newTyre.tyreManufacturer
        )
      );
      if (res.success && res.data.length) {
        this.tyreModels = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadTyreTypes() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreTypesGet()
      );
      if (res.success && res.data.length) {
        this.tyreTypes = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadTyreSizes() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetTyreSizesGet()
      );
      if (res.success && res.data.length) {
        this.tyreSizes = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async addTyre() {
    this.showLoader = true;
    this.newTyre.registrationNo = this.vehicleDetails.registration_No;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestCreateTyrePost(this.newTyre)
      );

      if (res && res.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Added Successfully',
          detail: 'Tyre added successfully.',
          life: 3000,
        });
        this.toggleAddTyreDialog(); // Optional: Clear the form after successful addition
        this.loadTyreSerialNumbers(); // Reload serial numbers after adding
      }
    } catch (err: any) {
      console.error(err);

      let errorMessage = 'An unexpected error occurred';

      if (err && err.error && err.error.message) {
        if (err.error.message.includes('Duplicate tyre serial number')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Conflict',
            detail: 'A tyre with the same serial number already exists.',
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            life: 5000,
          });
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000,
        });
      }
    }
    this.showLoader = false;
  }

  async loadTyreSerialNumbers() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.tyreService.tyreRequestGetAllTyreSerialNumbersGet(
          this.vehicleDetails.registration_No
        )
      );
      if (res.success && res.data.length) {
        this.tyreSerialNumbers = res.data;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  toggleUploadDialog(field: string) {
    this.currentUploadField = field;
    this.showUploadAttachmentDialog = true;
  }

  async submitVehicleDetails() {
    console.log('Submitting vehicle details:', this.vehicleDetails);

    this.showLoader = true;

    try {
      const apiCall = this.editMode
        ? this.commonService.bulkUploadUpdateVehiclePut(this.vehicleDetails)
        : this.commonService.bulkUploadAddVehiclePost(this.vehicleDetails);

      const res = await firstValueFrom(apiCall);

      if (res?.success) {
        this.messageService.add({
          severity: 'success',
          summary: `Vehicle ${this.editMode ? 'Updated' : 'Added'}`,
          detail: `Vehicle ${
            this.editMode ? 'Updated' : 'Added'
          } Successfully.`,
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/bulk-upload/vehicle']);
        }, 3000);
      } else {
        console.warn('API call was not successful:', res);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      this.showLoader = false;
    }
  }
}
