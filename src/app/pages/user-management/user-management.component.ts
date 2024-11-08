import { Component } from '@angular/core';
import {
  AdminService,
  AdminToAddDto,
  AdminToEditDto,
  Role,
} from '../../../swagger';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  showLoader: boolean = false;
  users: any = [];
  showUserDialog: boolean = false;
  isEditMode: boolean = false;
  oldSelectedRoles: any[] = [];
  oldSelectedAccessScopes: string[] = [];
  selectedRoles: any[] = [];
  roles!: Record<number, string>;

  assignableRoles = [
    { name: 'Branch Manager', id: 1 },
    { name: 'FSM', id: 2 },
    { name: 'HFM', id: 3 },
    { name: 'HFM (Battery & Tyre)', id: 4 },
    { name: 'Regional Manager', id: 5 },
    { name: 'National Fleet Manager', id: 6 },
    { name: 'Zonal Manager', id: 7 },
    { name: 'Vice President', id: 8 },
    { name: 'Finance', id: 9 },
  ];

  statuses: any = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  accessLevels: string[] = ['National', 'Zone', 'Region', 'Branch'];
  accessScopes: string[] = [];
  selectedAccessScope: string[] = [];
  reportingToEmails: string[] = [];

  newUser: AdminToAddDto = {
    empCode: '',
    empName: '',
    empEmail: '',
    empMobNo: '',
    roleIds: [],
    active: undefined,
    accessLevel: '',
    accessScope: '',
    reportingTo: '',
  };
  selectedUser: AdminToEditDto = {};
  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEmails();
    this.loadRoles();
  }

  async loadUsers() {
    try {
      const res = await firstValueFrom(this.adminService.adminGetUsersGet());
      if (res && res.length) {
        this.users = res;
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  async loadEmails() {
    try {
      const res = await firstValueFrom(this.adminService.adminGetEmailsGet());
      if (res && res.length) {
        this.reportingToEmails = res;
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  async loadRoles() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(this.adminService.adminGetRolesGet());
      if (res && res.length) {
        this.roles = this.convertRolesToKeyValue(res);
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
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

  getRole(id: any) {
    return this.roles[parseInt(id)];
  }

  updateRoles() {
    this.newUser.roleIds = this.selectedRoles!.map((role) => role.id);
  }

  async fetchAccessScope() {
    this.selectedAccessScope = [];
    if (this.newUser.accessLevel === 'National') {
      return;
    } else {
      this.showLoader = true;
      try {
        switch (this.newUser.accessLevel) {
          case 'Zone':
            {
              const res = await firstValueFrom(
                this.adminService.adminGetAccessScopeGet(
                  this.newUser.accessLevel
                )
              );
              if (res && res.length) {
                this.accessScopes = [...res];
              }
            }
            break;
          case 'Region':
            {
              const res = await firstValueFrom(
                this.adminService.adminGetAccessScopeGet(
                  this.newUser.accessLevel
                )
              );
              if (res && res.length) {
                this.accessScopes = [...res];
              }
            }
            break;
          case 'Branch':
            {
              const res = await firstValueFrom(
                this.adminService.adminGetAccessScopeGet(
                  this.newUser.accessLevel
                )
              );
              if (res && res.length) {
                this.accessScopes = [...res];
              }
            }
            break;
          default: {
            console.warn('Unknown access level');
          }
        }
        this.showLoader = false;
      } catch (err: any) {
        console.error(err);
        this.showLoader = false;
      }
    }
  }

  toggleDialog(edit: boolean = false, user: AdminToEditDto = {}) {
    this.newUser = {
      empCode: '',
      empName: '',
      empEmail: '',
      empMobNo: '',
      roleIds: [],
      reportingTo: '',
      active: undefined,
    };
    if (edit) {
      this.isEditMode = true;
      this.selectedUser = { ...user };
      const roleIdsArray = user.roles!.split(',').map((id) => parseInt(id, 10));
      this.oldSelectedRoles = this.selectedRoles = this.assignableRoles.filter(
        (role) => roleIdsArray.includes(role.id)
      );
      this.newUser = { ...user };
      this.updateRoles();
      this.fetchAccessScope();
      this.selectedAccessScope = this.oldSelectedAccessScopes = user.accessScope
        ? JSON.parse(user.accessScope)
        : [];
    } else {
      this.isEditMode = false;
      this.selectedUser = {};
      this.selectedRoles = [];
      this.selectedAccessScope = [];
      this.newUser = {
        empCode: '',
        empName: '',
        empEmail: '',
        empMobNo: '',
        roleIds: [],
        active: undefined,
        reportingTo: '',
      };
    }
    this.showUserDialog = !this.showUserDialog;
  }

  async saveUser() {
    this.showLoader = true;
    this.newUser.accessScope = JSON.stringify(this.selectedAccessScope);
    try {
      if (this.isEditMode) {
        const res = await firstValueFrom(
          this.adminService.adminEditUserPut(this.newUser)
        );
        if (res && res.updated) {
          this.showUserDialog = false;
          await this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Updated Successfully',
            detail: 'User Updated Successfully',
            life: 3000,
          });
        }
      } else {
        const res = await firstValueFrom(
          this.adminService.adminCreateUserPost(this.newUser)
        );
        if (res && res.created) {
          this.showUserDialog = false;
          await this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Created Successfully',
            detail: 'User Created Successfully',
            life: 3000,
          });
        }
      }
      this.clearFields();
    } catch (err: any) {
      console.error(err);

      let errorMessage = 'An unexpected error occurred';

      if (err && err.error.details) {
        if (
          err.error.details.includes('UpdateUser') ||
          err.error.details.includes('CreateUser')
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Conflict',
            detail:
              'A user with the same employee code, email id or mobile number already exists.',
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.details,
            life: 5000,
          });
        }
      } else if (err && err.error.message) {
        const errorDetail = err.error.message;
        if (errorDetail.includes('CreateUser')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Conflict',
            detail: 'A user with the same employee code already exists.',
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorDetail,
            life: 5000,
          });
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorDetail,
          life: 5000,
        });
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

  clearFields() {
    this.selectedAccessScope = [];
    this.selectedRoles = [];
  }

  suspendUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to suspend ' + user.empName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          this.showLoader = true;
          await firstValueFrom(
            this.adminService.adminSuspendUserUserIdDelete(user.userId!)
          );
          this.showLoader = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Suspended Successfully!',
            life: 3000,
          });
          this.loadUsers();
        } catch (err: any) {
          this.showLoader = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.toString(),
            life: 3000,
          });
        }
      },
    });
  }

  activateUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to activate ' + user.empName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          this.showLoader = true;
          await firstValueFrom(
            this.adminService.adminSuspendUserUserIdDelete(user.userId!)
          );
          this.showLoader = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Activated Successfully!',
            life: 3000,
          });
          this.loadUsers();
        } catch (err: any) {
          this.showLoader = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.toString(),
            life: 3000,
          });
        }
      },
    });
  }

  getSeverity(status: any) {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        return 'success';
    }
  }

  checkChanges() {
    if (
      this.selectedUser.empName !== this.newUser.empName ||
      this.selectedUser.empEmail !== this.newUser.empEmail ||
      this.selectedUser.reportingTo !== this.newUser.reportingTo ||
      this.selectedUser.empMobNo !== this.newUser.empMobNo ||
      this.selectedUser.empCode !== this.newUser.empCode ||
      this.selectedUser.active !== this.newUser.active ||
      !this.arraysAreEqualIgnoringOrder(
        this.oldSelectedRoles,
        this.selectedRoles
      ) ||
      !this.arraysAreEqualIgnoringOrder(
        this.selectedAccessScope,
        this.oldSelectedAccessScopes
      )
    ) {
      return false;
    }
    return true;
  }

  arraysAreEqualIgnoringOrder = (arr1: any[], arr2: any[]): boolean => {
    // Convert both arrays to sets
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    // If they have different sizes, they can't be equal
    if (set1.size !== set2.size) return false;

    // Check if every element in set1 exists in set2
    for (let elem of set1) {
      if (!set2.has(elem)) return false;
    }

    return true;
  };
}
