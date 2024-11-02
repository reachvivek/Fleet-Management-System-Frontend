import { Component } from '@angular/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { AdminService, FiltersDto } from '../../../swagger';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-scrap-request-management',
  templateUrl: './scrap-request-management.component.html',
  styleUrl: './scrap-request-management.component.scss',
})
export class ScrapRequestManagementComponent {
  showLoader: boolean = false;

  tickets: any[] = [];
  filteredTickets: any[] = [];

  showCreateRequestDialog: boolean = false;
  showFilterDialog: boolean = false;
  showTicketDetailsDialog: boolean = false;

  roleId: number | undefined = undefined;

  zones: any = [];
  regions: any = [];
  locations: any = [];
  branches: any = [];

  filters: TreeNode[] = [];
  selectedZones: TreeNode[] = [];
  isFilterApplied: boolean = false;
  initialSelectedBranches: Set<string> = new Set();
  initialSelectedHubs: Set<string> = new Set();

  columns = [
    { field: 'region', header: 'Region' },
    { field: 'branch', header: 'Branch' },
    { field: 'finalAmount', header: 'Estimate' },
    { field: 'isVehicleOffRoad', header: 'Vehicle Status' },
    { field: 'registrationNumber', header: 'Registration No' },
    { field: 'currentStage', header: 'Request Status' },
    { field: 'createdOn', header: 'Created On' },
  ];

  selectedTicket: any = {};
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
      id: 8,
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
      id: 11,
      label: 'Rejection Details',
      status: () => 'Rejected',
      timestamp: () => this.selectedTicket.rejectionTimestamp,
      comment: () => this.selectedTicket.rejectionComment,
      attachment: () => null,
      condition: () => this.selectedTicket.isRejected,
    },
    {
      id: 12,
      label: 'Closed',
      status: () => 'Closed',
      comment: () => 'NA',
      attachment: () => null,
      timestamp: () => this.selectedTicket.closedTimestamp,
      condition: () => this.selectedTicket.isClosed,
    },
  ];
  selectedTicketApprovalStages: any[] = [];

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  generateExportName(): string {
    return `FMS_Battery_Report_${new Date().toLocaleString()}`;
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

  async loadRegions() {
    // this.showLoader = true;
    //   this.newTicket.region = '';
    //   this.newTicket.hub = '';
    //   this.newTicket.branch = '';
    // try {
    //   const res = await firstValueFrom(
    //     this.adminService.adminGetRegionsGet(undefined, this.newTicket.zone)
    //   );
    //   if (res && res.length) {
    //     this.regions = res;
    //   }
    //   this.showLoader = false;
    // } catch (err: any) {
    //   console.error(err);
    //   this.showLoader = false;
    // }
  }

  async loadBranches() {
    //   this.showLoader = true;
    //   this.newTicket.branch = '';
    //   try {
    //     const res = await firstValueFrom(
    //       this.adminService.adminGetBranchesGet(undefined, this.newTicket.region)
    //     );
    //     if (res && res.length) {
    //       this.branches = res;
    //     }
    //     this.showLoader = false;
    //   } catch (err: any) {
    //     console.error(err);
    //     this.showLoader = false;
    //   }
  }

  async loadHubs() {
    //   this.showLoader = true;
    //   this.newTicket.hub = '';
    //   try {
    //     const res = await firstValueFrom(
    //       this.adminService.adminGetHubsGet(this.newTicket.branch)
    //     );
    //     if (res && res.length) {
    //       this.locations = res;
    //     }
    //     this.showLoader = false;
    //   } catch (err: any) {
    //     console.error(err);
    //     this.showLoader = false;
    //   }
  }

  async toggleCreateRequestDialog() {
    if (!this.zones.length) await this.loadZones();
    this.showCreateRequestDialog = !this.showCreateRequestDialog;
    this.createNewTicket();
  }

  async toggleFilterDialog() {
    if (!this.filters.length) await this.loadFilters();
    this.showFilterDialog = !this.showFilterDialog;
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

  viewNodes(event: any) {
    // console.log('Selected Node:', event.node);
    // console.log(this.selectedZones);
  }

  resetFilters() {
    this.selectedZones = this.getAllNodes(this.filters); // Reset your selections
    this.isFilterApplied = false; // Reset the filter state
    this.applyFilter();
    // this.toggleFilterDialog();
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

  createNewTicket() {}

  async viewTicket(id: number) {
    this.showTicketDetailsDialog = true;
    this.selectedTicketApprovalStages = [];
    // this.showLoader = true;
    // try {
    //   const res = await firstValueFrom(
    //     this.complianceService.complianceRequestGetTicketDetailsByIdGet(id)
    //   );
    //   if (res && res.id) {
    //     this.selectedTicket = { ...res };

    //     this.approvalSteps.forEach((step: any) => {
    //       if (step.condition()) {
    //         this.selectedTicketApprovalStages.push({
    //           id: this.selectedTicketApprovalStages.length + 1,
    //           label: step.label,
    //           status: step.status(),
    //           timestamp: step.timestamp(),
    //           comment: step.comment(),
    //           attachment: step.attachment(),
    //         });
    //       }
    //     });
    //     this.selectedTicketApprovalStages.forEach(
    //       (entry: any, index: number) => {
    //         if (entry.label == 'Rejection Details' || entry.label == 'Closed') {
    //           this.selectedTicketApprovalStages[index].label =
    //             this.selectedTicket.currentStage;
    //         }
    //       }
    //     );
    //     const res2 = await firstValueFrom(
    //       this.commonService.bulkUploadGetVendorDetailsGet(
    //         this.selectedTicket.vendorId
    //       )
    //     );
    //     if (res2 && res2.name) {
    //       this.selectedTicket.vendorName = res2.name;
    //       this.selectedTicket.vendorId = res2.id;
    //       this.selectedTicket.vendorGst = res2.gsT_NO;
    //       this.selectedTicket.vendorPan = res2.pan;
    //     }
    //   }
    // } catch (err: any) {
    //   console.error(err);
    // }
    // this.showLoader = false;
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
    // this.createNewTicket();
    // this.newTicket.id = id;
    // this.sharedService.setNewComplianceTicket(this.newTicket);
    // this.router.navigate(['create-compliance-request']);
  }
}
