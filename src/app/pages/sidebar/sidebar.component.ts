import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';
import { AdminService } from '../../../swagger';
import { SharedService } from '../../services/shared.service';

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
  isSidebarOpen: boolean = true;
  isAdminUser: boolean = false;
  showRoleSelectDialog: boolean = false;
  selectedRoleId: number | undefined = undefined;
  role: string = '';
  roles = [
    'Branch Manager',
    'FSM',
    'HFM',
    'Regional Manager',
    'National Fleet Manager',
    'Zonal Manager',
    'Vice President',
    'Finance',
    'Admin',
  ];

  constructor(
    private router: Router,
    private userSyncService: UserSyncService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.init();
    const routeTitlesMap = new Map<string, string>([
      ['create-request', 'Create Maintenance Request'],
      ['dashboard', 'Maintenance Requests'],
      ['user-management', 'User Management'],
      ['vehicle', 'Vehicle Management'],
      ['vendor', 'Vendor Management'],
      ['system-part', 'System And Part Management'],
      ['history', 'Upload History'],
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
    // this.checkUserIsAdmin();
    this.validateRole();
    this.fetchRole();
    this.sharedService.currentRoleId.subscribe((roleId) => {
      this.role = this.roles[roleId! - 1];
      this.isAdminUser = this.role == 'Admin';
    });
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

  async checkUserIsAdmin() {
    this.isAdminUser =
      (await this.userSyncService.checkUserPrivileges()) as boolean;
  }

  fetchRole() {
    if (localStorage.getItem('rid')) {
      this.role = this.roles[parseInt(localStorage.getItem('rid')!) - 1];
    }
  }

  assignRole() {
    // Assign the default role ID if only one role is available
    this.sharedService.updateRoleId(this.selectedRoleId!);
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

  async logout() {
    this.showLoader = true;
    this.userSyncService
      .logout()
      .then(() => (this.showLoader = false))
      .catch((err) => console.log(err));
  }
}
