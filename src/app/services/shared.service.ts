import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AdminService, Role } from '../../swagger';

export interface NewMaintenanceTicket {
  id: any;
  zone: string;
  region: string;
  branch: string;
  hub: string;
  registrationNumber: string | undefined;
  vehicleAge: string;
  manufacturer: string;
  model: string;
  vehicleSubStatus: string;
  isVehicleOffRoad: boolean;
  dateOfLastService: string;
  offRoadReason: string;
  offRoadStatusChangeDate: string;
  serviceRequestType: string;
  vendorId: string | undefined;
  vendorName: string | undefined;
  totalSpareCost: number;
  totalLaborCost: number;
  totalEstimatedCost: number;
  quotationAttachment: string;
  componentDetails: [
    {
      systemName: string;
      partName: string;
      partNames: string[];
      spareCost: number;
      spareGst: number;
      laborCost: number;
      laborGst: number;
      comment: string;
    }
  ];
  invoiceTotalSpareCost: number;
  invoiceTotalLaborCost: number;
  invoiceTotalEstimatedCost: number;
  actualServiceDetails: [
    {
      systemName: string;
      partName: string;
      partHSN: string;
      partQty: number;
      partNames: string[];
      partCost: number;
      partGst: number;
      sacCode: number;
      laborQty: number;
      laborCost: number;
      laborGst: number;
      comment: string;
    }
  ];
  invoiceType: string;
  modeOfPayment: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  serviceDate: string;
  companyName: string;
  invoiceAttachment: string;
  jobcardAttachment: string;
  overallComment: string;
  isAdvanceRequired: boolean;
  advanceAmount: number;
  hasAdvanceRejected: boolean;
}

export interface NewComplianceTicket {
  id: any;
  zone: string;
  region: string;
  branch: string;
  hub: string;
  registrationNumber: string | undefined;
  vehicleAge: string;
  manufacturer: string;
  model: string;
  vehicleSubStatus: string;
  isVehicleOffRoad: boolean;
  offRoadReason: string;
  offRoadStatusChangeDate: string;
  typeOfCompliance: string;
  vendorId: string | undefined;
  vendorName: string | undefined;
  renewalFees: number;
  agentFees: number;
  miscAmount: number;
  penaltyFees: number;
  gstAmount: number;
  finalAmount: number;
  quotationAttachment: string;
  hsn: string;
  complianceQty: number;
  complianceGst: number;
  compliancePrice: number;
  sacCode: number;
  agentQty: number;
  agentCost: number;
  invoiceGst: number;
  fromDate: string;
  toDate: string;
  invoiceType: string;
  modeOfPayment: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  companyName: string;
  invoiceAttachment: string;
  invoiceApprovalComment: string;
  isAdvanceRequired: boolean;
  advanceAmount: number;
  overallComment: string;
  hasAdvanceRejected: boolean;
}

export interface NewBatteryTicket {
  id: any;
  zone: string;
  region: string;
  branch: string;
  hub: string;
  registrationNumber: string | undefined;
  vehicleAge: string;
  manufacturer: string;
  model: string;
  vehicleSubStatus: string;
  isVehicleOffRoad: boolean;
  offRoadReason: string;
  offRoadStatusChangeDate: string;

  // Current Battery Details
  battery_Serial_Number: string | undefined;
  battery_Make: string | undefined;
  battery_Model: string | undefined;
  battery_Invoice_Date: string | undefined;
  battery_Warranty: number;
  battery_Vendor_Name: string | undefined;
  battery_Cost: string | number | undefined;
  battery_Age: number;
  battery_Scrap_Value: string | number | undefined;

  // New Battery Details
  new_Battery_Make: string | undefined;
  new_Battery_Model: string | undefined;
  new_Battery_VendorId: string | number | undefined;
  new_Battery_Cost: number;
  new_Battery_GST: number;
  new_Battery_Estimated_Cost: number;

  current_Battery_Serial_Number: string | undefined;
  quotationAttachment: string | undefined;
  isAdvanceRequired: boolean;
  advanceAmount: number;
  overallComment: string;

  createdOn: any | undefined;
  hasAdvanceRejected: boolean;
}

export interface NewTyreTicket {
  id: any;
  zone: string;
  region: string;
  branch: string;
  hub: string;
  registrationNumber: string | undefined;
  vehicleAge: string;
  manufacturer: string;
  model: string;
  vehicleSubStatus: string;
  isVehicleOffRoad: boolean;
  offRoadReason: string;
  offRoadStatusChangeDate: string;

  tyreQty: number | undefined;

  // Tyre Details
  selected_tyre1_serial_number: string | undefined;
  typed_tyre1_serial_number: string | undefined;
  selected_tyre1_Manufacturer: string | undefined;
  selected_tyre1_Model: string | undefined;
  selected_tyre1_Size: string | undefined;
  selected_tyre1_Fitment_Date: string | Date | undefined;
  tyre1_attachment: string | undefined;

  selected_tyre2_serial_number: string | undefined;
  typed_tyre2_serial_number: string | undefined;
  selected_tyre2_Manufacturer: string | undefined;
  selected_tyre2_Model: string | undefined;
  selected_tyre2_Size: string | undefined;
  selected_tyre2_Fitment_Date: string | Date | undefined;
  tyre2_attachment: string | undefined;

  selected_tyre3_serial_number: string | undefined;
  typed_tyre3_serial_number: string | undefined;
  selected_tyre3_Manufacturer: string | undefined;
  selected_tyre3_Model: string | undefined;
  selected_tyre3_Size: string | undefined;
  selected_tyre3_Fitment_Date: string | Date | undefined;
  tyre3_attachment: string | undefined;

  selected_tyre4_serial_number: string | undefined;
  typed_tyre4_serial_number: string | undefined;
  selected_tyre4_Manufacturer: string | undefined;
  selected_tyre4_Model: string | undefined;
  selected_tyre4_Size: string | undefined;
  selected_tyre4_Fitment_Date: string | Date | undefined;
  tyre4_attachment: string | undefined;

  selected_tyre5_serial_number: string | undefined;
  typed_tyre5_serial_number: string | undefined;
  selected_tyre5_Manufacturer: string | undefined;
  selected_tyre5_Model: string | undefined;
  selected_tyre5_Size: string | undefined;
  selected_tyre5_Fitment_Date: string | Date | undefined;
  tyre5_attachment: string | undefined;

  // Cost Details
  estimated_Tyre_Cost: number;
  estimated_Tyre_GST: number;
  estimated_Tyre_Total: number;
  selected_VendorId: string | number | undefined;

  quotationAttachment: string | undefined;
  isAdvanceRequired: boolean;
  advanceAmount: number;
  overallComment: string;

  hasAdvanceRejected: boolean;

  createdOn: any | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private roleIds: number[] = [];
  roleOptions: { name: string; code: number }[] = [];
  roleOptions$ = new BehaviorSubject<{ name: string; code: number }[]>([]);

  private roleIdSource = new BehaviorSubject<number | undefined>(undefined);

  currentRoleId = this.roleIdSource.asObservable();

  constructor(private router: Router, public adminService: AdminService) {
    this.loadRoleIds();
    this.loadRoles();
    this.setRoleId();
  }

  public init() {
    this.loadRoleIds();
    this.loadRoles();
  }

  public loadRoleIds() {
    let token = localStorage.getItem('token');
    const decodedToken: any = jwtDecode(token!);
    // Assuming roleIds are stored in localStorage
    if (!decodedToken.roleIDs) {
      localStorage.removeItem('token');
      this.router.navigate(['auth/login']);
    }
    const roleIDs = decodedToken.roleIDs
      ? decodedToken.roleIDs
          .split(',')
          .map((role: string) => parseInt(role.trim(), 10))
      : [];

    this.roleIds = [...roleIDs];
  }

  setRoleId() {
    try {
      const storedRoleId = localStorage.getItem('rid');
      if (storedRoleId) {
        const roleId = parseInt(storedRoleId, 10);
        if (!isNaN(roleId) && this.roleIds.includes(roleId)) {
          this.roleIdSource.next(roleId);
        } else {
          console.warn('Stored roleId is not a valid number');
          // Handle the case where storedRoleId is not a valid number
          localStorage.removeItem('rid'); // Optionally clear invalid data
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Handle the error, e.g., log it or provide a fallback
    }
  }

  get currentRole() {
    return this.roleIdSource.value;
  }

  public async loadRoles() {
    // Define roles with their IDs and names
    const roles = await firstValueFrom(this.adminService.adminGetRolesGet());

    const allRoles = this.convertRolesToKeyValue(roles);

    // Map available role IDs to role names
    this.roleOptions = this.roleIds.map((roleId) => ({
      name: allRoles[roleId],
      code: roleId,
    }));
    // Update the BehaviorSubject
    this.roleOptions$.next(this.roleOptions);
  }

  convertRolesToKeyValue(roles: Role[]): Record<number, string> {
    return roles.reduce((acc, role) => {
      if (role.roleName) {
        // Ensure roleName is defined
        acc[role.roleID!] = role.roleName;
      }
      return acc;
    }, {} as Record<number, string>);
  }

  userHasMultipleRoles(): boolean {
    return this.roleIds.length > 1;
  }

  setDefaultRoleId() {
    const newRoleId = this.roleIds[0];
    try {
      this.roleIdSource.next(newRoleId);
    } catch (error) {
      console.error('Error updating localStorage:', error);
      // Handle the error, e.g., log it or provide a fallback
    }
  }

  // Method to update the roleId
  updateRoleId(newRoleId: number) {
    try {
      // Check if newRoleId exists in the roleIds array (which are numbers)
      if (this.roleIds.includes(parseInt(newRoleId.toString()))) {
        localStorage.setItem('rid', newRoleId.toString());
        this.roleIdSource.next(newRoleId);
      } else {
        localStorage.removeItem('rid');
        console.log('removed rid');
      }
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }

  private newMaintenanceTicketSubject =
    new BehaviorSubject<NewMaintenanceTicket>({
      id: '',
      zone: '',
      region: '',
      branch: '',
      hub: '',
      registrationNumber: undefined,
      vehicleAge: '',
      manufacturer: '',
      model: '',
      vehicleSubStatus: '',
      isVehicleOffRoad: false,
      dateOfLastService: '',
      offRoadReason: '',
      offRoadStatusChangeDate: '',
      serviceRequestType: '',
      vendorId: '',
      vendorName: '',
      totalSpareCost: 0,
      totalLaborCost: 0,
      totalEstimatedCost: 0,
      quotationAttachment: '',
      componentDetails: [
        {
          systemName: '',
          partName: '',
          partNames: [],
          spareCost: 0,
          spareGst: 0,
          laborCost: 0,
          laborGst: 0,
          comment: '',
        },
      ],
      invoiceTotalSpareCost: 0,
      invoiceTotalLaborCost: 0,
      invoiceTotalEstimatedCost: 0,
      actualServiceDetails: [
        {
          systemName: '',
          partName: '',
          partHSN: '',
          partQty: 0,
          partNames: [],
          partCost: 0,
          partGst: 0,
          sacCode: 0,
          laborQty: 0,
          laborCost: 0,
          laborGst: 0,
          comment: '',
        },
      ],
      invoiceType: '',
      modeOfPayment: '',
      invoiceNumber: '',
      invoiceDate: '',
      invoiceAmount: 0,
      serviceDate: '',
      companyName: '',
      invoiceAttachment: '',
      jobcardAttachment: '',
      overallComment: '',
      isAdvanceRequired: false,
      advanceAmount: 0,
      hasAdvanceRejected: false,
    });

  private newComplianceTicketSubject = new BehaviorSubject<NewComplianceTicket>(
    {
      id: '',
      zone: '',
      region: '',
      branch: '',
      hub: '',
      registrationNumber: undefined,
      vehicleAge: '',
      manufacturer: '',
      model: '',
      vehicleSubStatus: '',
      isVehicleOffRoad: false,
      offRoadReason: '',
      offRoadStatusChangeDate: '',
      typeOfCompliance: '',
      vendorId: '',
      vendorName: '',
      renewalFees: 0,
      agentFees: 0,
      miscAmount: 0,
      penaltyFees: 0,
      gstAmount: 0,
      finalAmount: 0,
      quotationAttachment: '',
      hsn: '',
      complianceQty: 0,
      complianceGst: 0,
      compliancePrice: 0,
      sacCode: 0,
      agentQty: 0,
      agentCost: 0,
      invoiceGst: 0,
      fromDate: '',
      toDate: '',
      invoiceType: '',
      modeOfPayment: '',
      invoiceNumber: '',
      invoiceDate: '',
      invoiceAmount: 0,
      companyName: '',
      invoiceAttachment: '',
      invoiceApprovalComment: '',
      isAdvanceRequired: false,
      advanceAmount: 0,
      overallComment: '',
      hasAdvanceRejected: false,
    }
  );

  private newBatteryTicketSubject = new BehaviorSubject<NewBatteryTicket>({
    id: '',
    zone: '',
    region: '',
    branch: '',
    hub: '',
    registrationNumber: undefined,
    vehicleAge: '',
    manufacturer: '',
    model: '',
    vehicleSubStatus: '',
    isVehicleOffRoad: false,
    offRoadReason: '',
    offRoadStatusChangeDate: '',

    // Current Battery Details
    battery_Serial_Number: undefined,
    battery_Make: '',
    battery_Model: '',
    battery_Invoice_Date: undefined,
    battery_Warranty: 0,
    battery_Vendor_Name: '',
    battery_Cost: undefined,
    battery_Age: 0,
    battery_Scrap_Value: undefined,

    // New Battery Details
    new_Battery_Make: '',
    new_Battery_Model: '',
    new_Battery_VendorId: undefined,
    new_Battery_Cost: 0,
    new_Battery_GST: 0,
    new_Battery_Estimated_Cost: 0,

    quotationAttachment: undefined,

    current_Battery_Serial_Number: undefined,
    isAdvanceRequired: false,
    advanceAmount: 0,
    overallComment: '',

    createdOn: undefined,
    hasAdvanceRejected: false,
  });

  private newTyreTicketSubject = new BehaviorSubject<NewTyreTicket>({
    id: '',
    zone: '',
    region: '',
    branch: '',
    hub: '',
    registrationNumber: undefined,
    vehicleAge: '',
    manufacturer: '',
    model: '',
    vehicleSubStatus: '',
    isVehicleOffRoad: false,
    offRoadReason: '',
    offRoadStatusChangeDate: '',

    tyreQty: undefined,

    // Tyre Details
    selected_tyre1_serial_number: undefined,
    typed_tyre1_serial_number: undefined,
    selected_tyre1_Manufacturer: undefined,
    selected_tyre1_Model: undefined,
    selected_tyre1_Size: undefined,
    selected_tyre1_Fitment_Date: undefined,
    tyre1_attachment: undefined,

    selected_tyre2_serial_number: undefined,
    typed_tyre2_serial_number: undefined,
    selected_tyre2_Manufacturer: undefined,
    selected_tyre2_Model: undefined,
    selected_tyre2_Size: undefined,
    selected_tyre2_Fitment_Date: undefined,
    tyre2_attachment: undefined,

    selected_tyre3_serial_number: undefined,
    typed_tyre3_serial_number: undefined,
    selected_tyre3_Manufacturer: undefined,
    selected_tyre3_Model: undefined,
    selected_tyre3_Size: undefined,
    selected_tyre3_Fitment_Date: undefined,
    tyre3_attachment: undefined,

    selected_tyre4_serial_number: undefined,
    typed_tyre4_serial_number: undefined,
    selected_tyre4_Manufacturer: undefined,
    selected_tyre4_Model: undefined,
    selected_tyre4_Size: undefined,
    selected_tyre4_Fitment_Date: undefined,
    tyre4_attachment: undefined,

    selected_tyre5_serial_number: undefined,
    typed_tyre5_serial_number: undefined,
    selected_tyre5_Manufacturer: undefined,
    selected_tyre5_Model: undefined,
    selected_tyre5_Size: undefined,
    selected_tyre5_Fitment_Date: undefined,
    tyre5_attachment: undefined,

    estimated_Tyre_Cost: 0.0,
    estimated_Tyre_GST: 0.0,
    estimated_Tyre_Total: 0.0,
    selected_VendorId: undefined,
    quotationAttachment: undefined,

    isAdvanceRequired: false,
    advanceAmount: 0,
    overallComment: '',

    createdOn: undefined,
    hasAdvanceRejected: false,
  });

  newMaintenanceTicket$ = this.newMaintenanceTicketSubject.asObservable();
  newComplianceTicket$ = this.newComplianceTicketSubject.asObservable();
  newBatteryTicket$ = this.newBatteryTicketSubject.asObservable();
  newTyreTicket$ = this.newTyreTicketSubject.asObservable();

  setNewMaintenanceTicket(newTicket: NewMaintenanceTicket) {
    this.newMaintenanceTicketSubject.next(newTicket);
  }

  setNewComplianceTicket(newTicket: NewComplianceTicket) {
    this.newComplianceTicketSubject.next(newTicket);
  }

  setNewBatteryTicket(newTicket: NewBatteryTicket) {
    this.newBatteryTicketSubject.next(newTicket);
  }

  setNewTyreTicket(newTicket: NewTyreTicket) {
    this.newTyreTicketSubject.next(newTicket);
  }
}
