import { Component } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { UserSyncService } from '../../services/user-sync.service';
import { NewTicket, SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import {
  AdminService,
  ApproveRejectDto,
  FiltersDto,
  MaintenanceRequestService,
  TicketDetailsDto,
  TicketsForDashboardDto,
} from '../../../swagger';

@Component({
  selector: 'app-maintenance-request-management',
  templateUrl: './maintenance-request-management.component.html',
  styleUrl: './maintenance-request-management.component.scss',
})
export class MaintenanceRequestManagementComponent {
  showLoader: boolean = false;
  tickets: TicketsForDashboardDto[] = [];
  zones: any = [];
  regions: any = [];
  locations: any = [];
  branches: any = [];

  initialSelectedBranches: Set<string> = new Set(); // Store initial selections
  initialSelectedHubs: Set<string> = new Set(); // Store initial selections
  filteredTickets: TicketsForDashboardDto[] = [];
  filters: TreeNode[] = [];
  selectedZones: TreeNode[] = [];
  isFilterApplied: boolean = false; // Initialize to false

  selectedStates = [];
  newTicket: NewTicket = {
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
  };
  roleOptions: { name: string; code: number }[] = [];
  roleIds: number[] = JSON.parse(localStorage.getItem('roleIDs')!);
  selectedRoleId: number | undefined = undefined;
  roleId: number | undefined = undefined;
  selectedTicket: TicketDetailsDto | any = {};

  showRoleSelectDialog: boolean = false;
  showCreateRequestDialog: boolean = false;
  showTicketDetailsDialog: boolean = false;
  showApproveTicketDialog: boolean = false;
  showRejectTicketDialog: boolean = false;
  showFilterDialog: boolean = false;

  optionalDetails: { attachment: string; comment: string } = {
    attachment: '',
    comment: '',
  };

  uploadMode: boolean = false;

  approvalSteps = [
    {
      id: 1,
      label: 'BRANCH MANAGER',
      status: () => 'Created',
      timestamp: () => this.selectedTicket.createdOn,
      comment: () => this.selectedTicket.overallComment,
      attachment: () => null,
      condition: () => true,
    },
    {
      id: 2,
      label: 'FSM',
      status: () => 'FSM Approved',
      timestamp: () => this.selectedTicket.fsmApprovalTimestamp,
      comment: () => this.selectedTicket.fsmApprovalComment,
      attachment: () => this.selectedTicket.fsmApprovalAttachment,
      condition: () => this.selectedTicket.hasFSMApproved,
    },
    {
      id: 3,
      label: 'HFM',
      status: () => 'HFM Recommended',
      timestamp: () => this.selectedTicket.hfmApprovalTimestamp,
      comment: () => this.selectedTicket.hfmApprovalComment,
      attachment: () => this.selectedTicket.hfmApprovalAttachment,
      condition: () =>
        this.selectedTicket.hasFSMApproved &&
        this.selectedTicket.hasHFMApproved &&
        this.selectedTicket.isRMApprovalRequired,
    },
    {
      id: 4,
      label: 'Regional Manager',
      status: () => 'Regional Manager Approved',
      timestamp: () => this.selectedTicket.rmApprovalTimestamp,
      comment: () => this.selectedTicket.rmApprovalComment,
      attachment: () => this.selectedTicket.rmApprovalAttachment,
      condition: () =>
        this.selectedTicket.hasFSMApproved &&
        this.selectedTicket.hasHFMApproved &&
        this.selectedTicket.hasRMApproved &&
        this.selectedTicket.isRMApprovalRequired,
    },
    {
      id: 5,
      label: 'National Fleet Manager',
      status: () => 'National Fleet Manager Recommended',
      timestamp: () => this.selectedTicket.nfmApprovalTimestamp,
      comment: () => this.selectedTicket.nfmApprovalComment,
      attachment: () => this.selectedTicket.nfmApprovalAttachment,
      condition: () =>
        this.selectedTicket.hasFSMApproved &&
        this.selectedTicket.hasHFMApproved &&
        this.selectedTicket.hasRMApproved &&
        this.selectedTicket.hasNFMApproved &&
        this.selectedTicket.isZMApprovalRequired,
    },
    {
      id: 6,
      label: 'Zonal Manager',
      status: () => 'Zonal Manager Approved',
      timestamp: () => this.selectedTicket.zmApprovalTimestamp,
      comment: () => this.selectedTicket.zmApprovalComment,
      attachment: () => this.selectedTicket.zmApprovalAttachment,
      condition: () =>
        this.selectedTicket.hasFSMApproved &&
        this.selectedTicket.hasHFMApproved &&
        this.selectedTicket.hasRMApproved &&
        this.selectedTicket.hasNFMApproved &&
        this.selectedTicket.hasZMApproved &&
        this.selectedTicket.isZMApprovalRequired,
    },
    {
      id: 7,
      label: 'Vice President',
      status: () => 'Vice President Approved',
      timestamp: () => this.selectedTicket.vpApprovalTimestamp,
      comment: () => this.selectedTicket.vpApprovalComment,
      attachment: () => this.selectedTicket.vpApprovalAttachment,
      condition: () =>
        this.selectedTicket.hasFSMApproved &&
        this.selectedTicket.hasHFMApproved &&
        this.selectedTicket.hasRMApproved &&
        this.selectedTicket.hasNFMApproved &&
        this.selectedTicket.hasZMApproved &&
        this.selectedTicket.hasVPApproved &&
        this.selectedTicket.isVPApprovalRequired,
    },
    {
      id: 9,
      label: 'Finance User',
      status: () => 'Advance Approved',
      timestamp: () => this.selectedTicket.advanceApprovalTimestamp,
      comment: () => this.selectedTicket.advanceApprovalComment,
      attachment: () => this.selectedTicket.advanceApprovalAttachment,
      condition: () =>
        this.selectedTicket.hasAdvanceApproved &&
        this.selectedTicket.isAdvanceRequired,
    },
    {
      id: 9,
      label: 'Branch Manager',
      status: () => 'Invoice Uploaded',
      timestamp: () => this.selectedTicket.invoiceUploadedAt,
      comment: () => 'NA',
      attachment: () => this.selectedTicket.invoiceAttachment,
      condition: () => this.selectedTicket.isInvoiceUploaded,
    },
    {
      id: 10,
      label: 'Finance User',
      status: () => 'Finance Approved',
      timestamp: () => this.selectedTicket.financeApprovalTimestamp,
      comment: () => 'NA',
      attachment: () => this.selectedTicket.financeApprovalAttachment,
      condition: () => this.selectedTicket.hasFinanceUserApproved,
    },
    {
      id: 8,
      label: 'Rejection Details',
      status: () => 'Rejected',
      timestamp: () => this.selectedTicket.rejectionTimestamp,
      comment: () => this.selectedTicket.rejectionComment,
      attachment: () => null,
      condition: () => this.selectedTicket.isRejected,
    },
  ];

  selectedTicketApprovalStages: any[] = [];

  columns = [
    { field: 'region', header: 'Region' },
    { field: 'location', header: 'Branch' },
    { field: 'totalEstimatedCost', header: 'Estimate' },
    { field: 'isVehicleOffRoad', header: 'Vehicle Status' },
    { field: 'registrationNumber', header: 'Registration No' },
    { field: 'currentStage', header: 'Request Status' },
    { field: 'createdOn', header: 'Created On' },
  ];

  constructor(
    private maintenanceRequestService: MaintenanceRequestService,
    private userSyncService: UserSyncService,
    private adminService: AdminService,
    private sharedService: SharedService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    this.userSyncService.loadState();
    this.sharedService.currentRoleId.subscribe((roleId) => {
      this.roleId = parseInt(roleId?.toString()!);
      if (this.roleId) {
        this.loadData();
      }
    });
  }

  async loadData() {
    await this.loadTickets();
  }

  toggleSelectRoleDialog() {
    this.showRoleSelectDialog = !this.showRoleSelectDialog;
  }

  async viewTicket(id: number) {
    this.showTicketDetailsDialog = true;
    this.selectedTicketApprovalStages = [];
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetTicketDetailsByIdGet(
          id
        )
      );
      if (res && res.id) {
        this.selectedTicket = { ...res };
        this.selectedTicket.componentDetails = JSON.parse(
          this.selectedTicket.componentDetails!
        );
        this.approvalSteps.forEach((step: any) => {
          if (step.condition()) {
            this.selectedTicketApprovalStages.push({
              id: this.selectedTicketApprovalStages.length + 1,
              label: step.label,
              status: step.status(),
              timestamp: step.timestamp(),
              comment: step.comment(),
              attachment: step.attachment(),
            });
          }
        });
        this.selectedTicketApprovalStages.forEach(
          (entry: any, index: number) => {
            if (entry.label == 'Rejection Details') {
              this.selectedTicketApprovalStages[index].label =
                this.selectedTicket.currentStage;
            }
          }
        );
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async loadTickets() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestGetAllMaintenanceRequestsPost(
          this.roleId
        )
      );
      if (res && res.length) {
        this.tickets = this.filteredTickets = res.map(
          (ticket: TicketsForDashboardDto) => {
            ticket.createdOn = new Date(ticket.createdOn!);
            return ticket;
          }
        );
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  generateExportName(): string {
    return `FMS_Report_${new Date().toLocaleString()}`;
  }

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

  async loadFilters() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetAllFiltersGet()
      );
      if (res && res.zones && res.zones.length) {
        this.filters = this.mapFiltersToTreeNodes(res);
        this.selectedZones = this.getAllNodes(this.filters);
      }
    } catch (err: any) {}
    this.showLoader = false;
  }

  private mapFiltersToTreeNodes(filters: FiltersDto): TreeNode[] {
    const indiaNode: TreeNode = {
      label: 'INDIA',
      data: null,
      expanded: true,
      children: filters.zones!.map((zone) => {
        return {
          label: zone.zoneName,
          data: zone,
          children: zone.regions!.map((region) => {
            return {
              label: region.regionName,
              data: region,
              children: region.branches!.map((branch) => {
                // Capture initial branches and hubs
                this.initialSelectedBranches.add(branch.branchName!);
                branch.hubs!.forEach((hub) => {
                  this.initialSelectedHubs.add(hub.hubName!);
                });

                return {
                  label: branch.branchName,
                  data: branch,
                  children: branch.hubs!.map((hub) => {
                    return {
                      label: hub.hubName,
                      data: hub,
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };

    return [indiaNode];
  }

  private getAllNodes(treeNodes: TreeNode[]): TreeNode[] {
    let allNodes: TreeNode[] = [];
    for (const node of treeNodes) {
      allNodes.push(node);
      if (node.children) {
        allNodes = allNodes.concat(this.getAllNodes(node.children));
      }
    }
    return allNodes;
  }

  hasSelections(): boolean {
    return this.selectedZones && this.selectedZones.length > 0;
  }

  viewNodes(event: any) {
    // console.log('Selected Node:', event.node);
    // console.log(this.selectedZones);
  }

  applyFilter() {
    this.showLoader = true;
    const selectedBranches = new Set<string>();
    const selectedHubs = new Set<string>();

    // Start traversing from the "India" node
    this.filters.forEach((indiaNode) => {
      if (indiaNode.children) {
        indiaNode.children.forEach((zoneNode) => {
          if (zoneNode.children) {
            zoneNode.children.forEach((regionNode) => {
              if (regionNode.children) {
                regionNode.children.forEach((branchNode) => {
                  // Check if the branch node is selected
                  if (
                    branchNode.partialSelected ||
                    this.selectedZones.includes(branchNode)
                  ) {
                    selectedBranches.add(branchNode.label!);

                    if (branchNode.children) {
                      branchNode.children.forEach((hubNode) => {
                        // Only add hubs if the branch is explicitly selected
                        if (
                          branchNode.partialSelected ||
                          this.selectedZones.includes(hubNode)
                        ) {
                          selectedHubs.add(hubNode.label!);
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });

    this.isFilterApplied =
      selectedBranches.size !== this.initialSelectedBranches.size ||
      selectedHubs.size !== this.initialSelectedHubs.size ||
      [...selectedBranches].some(
        (branch) => !this.initialSelectedBranches.has(branch)
      ) ||
      [...selectedHubs].some((hub) => !this.initialSelectedHubs.has(hub));

    // Now filter the tickets based on selected branches and hubs
    this.filteredTickets = this.tickets.filter((ticket) => {
      const isBranchSelected = selectedBranches.has(ticket.branch!);
      const isHubSelected = selectedHubs.has(ticket.hub!);

      // If a hub is selected, show tickets only for that hub
      if (isHubSelected) {
        return ticket.hub && selectedHubs.has(ticket.hub);
      }

      // If a branch is selected, show all tickets for that branch
      if (isBranchSelected) {
        return ticket.branch && selectedBranches.has(ticket.branch);
      }

      // If neither branch nor hub is selected, return false
      return false;
    });

    this.showLoader = false;
    // Optionally, close the dialog after applying the filter
    this.toggleFilterDialog();
  }

  resetFilters() {
    this.selectedZones = this.getAllNodes(this.filters); // Reset your selections
    this.isFilterApplied = false; // Reset the filter state
    this.applyFilter();
    // this.toggleFilterDialog();
  }

  async loadRegions() {
    this.showLoader = true;
    this.newTicket.region = '';
    this.newTicket.hub = '';
    this.newTicket.branch = '';
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetRegionsGet(undefined, this.newTicket.zone)
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

  toggleApproveTicketDialog(uploadMode: boolean = false) {
    if (uploadMode == true) {
      this.uploadMode = true;
    } else {
      this.uploadMode = false;
    }
    this.showApproveTicketDialog = !this.showApproveTicketDialog;
  }

  toggleRejectTicketDialog() {
    this.showRejectTicketDialog = !this.showRejectTicketDialog;
  }

  async loadHubs() {
    this.showLoader = true;
    this.newTicket.hub = '';
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetHubsGet(this.newTicket.branch)
      );
      if (res && res.length) {
        this.locations = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async loadBranches() {
    this.showLoader = true;
    this.newTicket.branch = '';
    try {
      const res = await firstValueFrom(
        this.adminService.adminGetBranchesGet(undefined, this.newTicket.region)
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

  async toggleCreateRequestDialog() {
    if (!this.zones.length) await this.loadZones();
    this.showCreateRequestDialog = !this.showCreateRequestDialog;
    this.newTicket = {
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
    };
  }

  createTicket() {
    this.sharedService.setNewTicket(this.newTicket);
    this.router.navigate(['create-request']);
  }

  showApproveRejectButtons(): boolean {
    // Return false for Branch Manager immediately
    if (this.roleId === 1) return false;

    const ticket = this.selectedTicket;
    const isRejected = ticket.isRejected;

    switch (this.roleId) {
      // Role is FSM
      case 2:
        return (
          !ticket.hasFSMApproved && !ticket.fsmApprovalTimestamp && !isRejected
        );

      // Role is HFM
      case 3:
        return (
          ticket.isRMApprovalRequired &&
          ticket.hasFSMApproved &&
          !ticket.hasHFMApproved &&
          !isRejected
        );

      // Role is RM
      case 4:
        return (
          ticket.isRMApprovalRequired &&
          ticket.hasHFMApproved &&
          !ticket.hasRMApproved &&
          !isRejected
        );

      // Role is NFM
      case 5:
        return (
          ticket.isNFMApprovalRequired &&
          ticket.hasRMApproved &&
          !ticket.hasNFMApproved &&
          !isRejected
        );

      // Role is ZM
      case 6:
        return (
          ticket.isZMApprovalRequired &&
          ticket.hasNFMApproved &&
          !ticket.hasZMApproved &&
          !isRejected
        );

      // Role is Vice President
      case 7:
        return (
          ticket.isVPApprovalRequired &&
          ticket.hasZMApproved &&
          !ticket.hasVPApproved &&
          !isRejected
        );

      // Role is Finance
      case 8:
        return (
          (ticket.isAdvanceRequired &&
            !ticket.hasAdvanceApproved &&
            ticket.currentStage === 'Advance Required') ||
          (ticket.isInvoiceUploaded && !ticket.hasFinanceUserApproved)
        );

      default:
        return false;
    }
  }

  showUploadInvoiceButton() {
    if (
      this.roleId == 1 &&
      this.selectedTicket.allApprovalStagesCompleted &&
      !this.selectedTicket.isInvoiceUploaded
    ) {
      if (
        this.selectedTicket.isAdvanceRequired &&
        this.selectedTicket.hasAdvanceApproved
      ) {
        return true;
      } else if (!this.selectedTicket.isAdvanceRequired) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async approveTicket() {
    this.showLoader = true;
    const approvalDetails: ApproveRejectDto = {
      ...this.optionalDetails,
      id: this.selectedTicket.id,
    };
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestApproveTicketPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.approved) {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: 'Maintenance Request Approved Successfully',
          life: 3000,
        });
        this.showApproveTicketDialog = false;
        this.showTicketDetailsDialog = false;
        this.optionalDetails.attachment = this.optionalDetails.comment = '';
        this.loadTickets();
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async rejectTicket() {
    this.showLoader = true;
    const rejectionDetails: ApproveRejectDto = {
      ...this.optionalDetails,
      id: this.selectedTicket.id,
    };
    try {
      const res = await firstValueFrom(
        this.maintenanceRequestService.maintenanceRequestRejectTicketPut(
          rejectionDetails,
          this.roleId
        )
      );
      if (res && res.rejected) {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Maintenance Request Rejected Successfully',
          life: 3000,
        });
        this.showRejectTicketDialog = false;
        this.showTicketDetailsDialog = false;
        this.optionalDetails.attachment = this.optionalDetails.comment = '';
        this.loadTickets();
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  editTicket(id: number) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message:
        'Editing this request will reset all current approvals. You will need to obtain approvals again after making changes. Do you wish to proceed?',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check me-2',
      rejectIcon: 'pi pi-times me-2',
      rejectButtonStyleClass: 'p-button-sm me-1',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm me-1',
      accept: () => {
        this.editServiceRequestDetails(id);
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  editServiceRequestDetails(id: number) {
    this.newTicket.id = id;
    this.sharedService.setNewTicket(this.newTicket);
    this.router.navigate(['create-request']);
  }

  async toggleFilterDialog() {
    if (!this.filters.length) await this.loadFilters();
    this.showFilterDialog = !this.showFilterDialog;
  }

  toggleUploadAttachmentDialog() {}
}
