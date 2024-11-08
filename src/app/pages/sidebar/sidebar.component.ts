import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';
import { SharedService } from '../../services/shared.service';
import { firstValueFrom } from 'rxjs';
import { AdminService, Role } from '../../../swagger';
import { roleRedirectGuard } from '../../guards/role-redirect.guard';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  routeTitle: string = 'Dashboard';
  showLoader: boolean = false;
  isUploadRoute: boolean = false;
  isReportsRoute: boolean = false;
  isReportsMenuOpen: boolean = false;
  isSubMenuOpen: boolean = false;
  isSidebarOpen: boolean = false;
  isAdminUser: boolean = false;
  isHFMBT: boolean = false;
  isHFM: boolean = false;
  showRoleSelectDialog: boolean = false;
  selectedRoleId: number | undefined = undefined;
  role: string = '';
  roles!: Record<number, string>;

  constructor(
    private router: Router,
    private userSyncService: UserSyncService,
    public sharedService: SharedService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.toggleSidebar();
    this.sharedService.init();
    const routeTitlesMap = new Map<string, string>([
      ['create-maintenance-request', 'Create Maintenance Request'],
      ['create-compliance-request', 'Create Compliance Request'],
      ['create-battery-request', 'Create Battery Request'],
      ['create-tyre-request', 'Create Tyre Request'],
      ['dashboard/compliance-requests', 'Compliance Requests'],
      ['tyre-requests', 'Tyre Requests'],
      ['battery-requests', 'Battery Requests'],
      ['compliance-requests', 'Compliance Requests'],
      ['dashboard', 'Maintenance Requests'],
      ['user-management', 'User Management'],
      ['requests-dump', 'Requests Insights'],
      ['vehicle-off-road', 'Vehicle Off Road Report'],
      ['vehicle', 'Vehicle Management'],
      ['vendor', 'Vendor Management'],
      ['system-part', 'System And Part Management'],
      ['history', 'Upload History'],
      ['compliance', 'Compliance Status'],
      ['fastag', 'Fastag Transactions'],
    ]);

    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      for (const [route, title] of routeTitlesMap) {
        if (currentUrl.includes(route)) {
          this.routeTitle = title;
          break;
        } else {
          this.routeTitle = 'Dashboard';
        }
      }
      if (currentUrl.includes('bulk-upload')) {
        this.isUploadRoute = true;
      }
      if (currentUrl.includes('reports')) {
        this.isReportsRoute = true;
      }
    });
    this.userSyncService.loadState();
    this.loadRoles();
  }

  async loadRoles() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(this.adminService.adminGetRolesGet());
      if (res && res.length) {
        this.roles = this.convertRolesToKeyValue(res);
      }
      this.validateRole();
      this.fetchCurrentRole();
      this.sharedService.currentRoleId.subscribe((roleId: any) => {
        this.role = this.roles[roleId!];
        this.isAdminUser = this.role == 'Admin';
        this.isHFM = this.role == 'HFM';
        this.isHFMBT = this.role == 'HFM (Battery & Tyre)';
      });
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  validateRole() {
    try {
      const storedRoleId = localStorage.getItem('rid');
      const roleId = storedRoleId ? parseInt(storedRoleId, 10) : NaN;

      if (!isNaN(roleId)) {
        this.sharedService.updateRoleId(roleId);
      } else {
        console.warn('No valid roleId found in localStorage');
        if (this.sharedService.userHasMultipleRoles()) {
          this.toggleSelectRoleDialog();
        } else {
          this.sharedService.setDefaultRoleId();
        }
      }
    } catch (error) {
      console.error('Error validating role:', error);
      // Handle error gracefully if needed
    }
  }

  toggleSelectRoleDialog() {
    this.showRoleSelectDialog = !this.showRoleSelectDialog;
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

  fetchCurrentRole() {
    if (localStorage.getItem('rid')) {
      this.role = this.roles[parseInt(localStorage.getItem('rid')!)];
    }
  }

  assignRole() {
    // Assign the default role ID if only one role is available
    this.sharedService.updateRoleId(this.selectedRoleId!);
    window.location.reload();
    this.showRoleSelectDialog = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }

  toggleReportsMenu() {
    this.isReportsMenuOpen = !this.isReportsMenuOpen;
  }

  closeSubMenu() {
    this.isSubMenuOpen = false;
  }

  closeReportsMenu() {
    this.isReportsMenuOpen = false;
  }

  async logout() {
    this.showLoader = true;
    this.userSyncService
      .logout()
      .then(() => (this.showLoader = false))
      .catch((err) => console.log(err));
  }
}
