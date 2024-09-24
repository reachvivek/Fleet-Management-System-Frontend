import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

export interface NewTicket {
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
  vendorName: string;
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
  overallComment: string;
  isAdvanceRequired: boolean;
  advanceAmount: number;
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

  constructor(private router: Router) {
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

  public loadRoles() {
    // Define roles with their IDs and names
    const allRoles: { [key: number]: string } = {
      1: 'Branch Manager',
      2: 'FSM',
      3: 'HFM',
      4: 'Regional Manager',
      5: 'National Fleet Manager',
      6: 'Zonal Manager',
      7: 'Vice President',
      8: 'Finance',
      9: 'Admin',
    };

    // Map available role IDs to role names
    this.roleOptions = this.roleIds.map((roleId) => ({
      name: allRoles[roleId],
      code: roleId,
    }));
    // Update the BehaviorSubject
    this.roleOptions$.next(this.roleOptions);
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

  private newTicketSubject = new BehaviorSubject<NewTicket>({
    id: '',
    zone: '',
    region: '',
    branch: '',
    hub: '',
    registrationNumber: '',
    vehicleAge: '',
    manufacturer: '',
    model: '',
    vehicleSubStatus: '',
    isVehicleOffRoad: false,
    dateOfLastService: '',
    offRoadReason: '',
    offRoadStatusChangeDate: '',
    serviceRequestType: '',
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
    overallComment: '',
    isAdvanceRequired: false,
    advanceAmount: 0,
  });

  newTicket$ = this.newTicketSubject.asObservable();

  setNewTicket(newTicket: NewTicket) {
    this.newTicketSubject.next(newTicket);
  }
}
