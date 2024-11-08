import { Component } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { UserSyncService } from '../../services/user-sync.service';
import {
  NewComplianceTicket,
  SharedService,
} from '../../services/shared.service';
import { firstValueFrom, timestamp } from 'rxjs';
import {
  AdminService,
  ApproveRejectDto,
  BulkUploadService,
  ComplianceDetailsDto,
  ComplianceForDashboardDto,
  ComplianceInvoiceDetailsDto,
  ComplianceRequestService,
  FiltersDto,
  VendorForSelectDto,
} from '../../../swagger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compliance-request-management',
  templateUrl: './compliance-request-management.component.html',
  styleUrl: './compliance-request-management.component.scss',
})
export class ComplianceRequestManagementComponent {
  showLoader: boolean = false;
  formActionsDisabled: boolean = false;

  newTicket!: NewComplianceTicket;
  newInvoice: ComplianceInvoiceDetailsDto | any = {};

  tickets: any[] = [];
  filteredTickets: any[] = [];
  selectedTicket: ComplianceDetailsDto | any = {};

  zones: any = [];
  regions: any = [];
  locations: any = [];
  branches: any = [];

  initialSelectedBranches: Set<string> = new Set(); // Store initial selections
  initialSelectedHubs: Set<string> = new Set();

  filters: TreeNode[] = [];
  selectedZones: TreeNode[] = [];

  roleOptions: { name: string; code: number }[] = [];
  roleIds: number[] = JSON.parse(localStorage.getItem('roleIDs')!);
  selectedRoleId: number | undefined = undefined;
  roleId: number | undefined = undefined;

  isFilterApplied: boolean = false;

  selectedTicketApprovalStages: any[] = [];

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

  showCreateRequestDialog: boolean = false;
  showTicketDetailsDialog: boolean = false;
  showApproveTicketDialog: boolean = false;
  showRejectTicketDialog: boolean = false;
  showUploadInvoiceDialog: boolean = false;
  showFilterDialog: boolean = false;

  columns = [
    { field: 'region', header: 'Region' },
    { field: 'branch', header: 'Branch' },
    { field: 'typeOfCompliance', header: 'Type' },
    { field: 'finalAmount', header: 'Estimate' },
    { field: 'isVehicleOffRoad', header: 'Vehicle Status' },
    { field: 'registrationNumber', header: 'Registration No' },
    { field: 'currentStage', header: 'Request Status' },
    { field: 'createdOn', header: 'Created On' },
  ];

  optionalDetails: { attachment: string; comment: string } = {
    attachment: '',
    comment: '',
  };

  vendors: VendorForSelectDto[] = [];
  agentGsts: number[] = [0, 18];
  invoiceTypes: string[] = ['GST', 'NON GST'];
  companyNames: string[] = ['CMS', 'CMS-SIPL(Div)', 'SIPL'];
  modeOfPayments: string[] = ['HO', 'Imprest'];

  dates = {
    invoiceDate: undefined,
    fromDate: undefined,
    toDate: undefined,
  };

  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));
  maxDate: Date = new Date();

  constructor(
    private userSyncService: UserSyncService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService,
    private adminService: AdminService,
    private router: Router,
    private commonService: BulkUploadService,
    private complianceService: ComplianceRequestService,
    private messageService: MessageService
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

  async loadTickets() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestGetAllComplianceRequestsPost(
          this.roleId
        )
      );
      if (res && res.length) {
        this.tickets = this.filteredTickets = res.map(
          (ticket: ComplianceForDashboardDto) => {
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

  async toggleCreateRequestDialog() {
    if (!this.zones.length) await this.loadZones();
    this.showCreateRequestDialog = !this.showCreateRequestDialog;
    this.createNewTicket();
  }

  createNewTicket() {
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
      offRoadReason: '',
      offRoadStatusChangeDate: '',
      typeOfCompliance: '',
      vendorId: undefined,
      vendorName: undefined,
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
      overallComment: '',
      isAdvanceRequired: false,
      advanceAmount: 0,
      invoiceApprovalComment: '',

      hasAdvanceRejected: false,
    };
  }

  createTicket() {
    this.sharedService.setNewComplianceTicket(this.newTicket);
    this.router.navigate(['create-compliance-request']);
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

  generateExportName(): string {
    return `FMS_Compliance_Report_${new Date().toLocaleString()}`;
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

  async viewTicket(id: number) {
    this.showTicketDetailsDialog = true;
    this.selectedTicketApprovalStages = [];
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestGetTicketDetailsByIdGet(id)
      );
      if (res && res.id) {
        this.selectedTicket = { ...res };

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
            if (entry.label == 'Rejection Details' || entry.label == 'Closed') {
              this.selectedTicketApprovalStages[index].label =
                this.selectedTicket.currentStage;
            }
          }
        );
        const res2 = await firstValueFrom(
          this.commonService.bulkUploadGetVendorDetailsGet(
            this.selectedTicket.vendorId
          )
        );
        if (res2 && res2.name) {
          this.selectedTicket.vendorName = res2.name;
          this.selectedTicket.vendorId = res2.id;
          this.selectedTicket.vendorGst = res2.gsT_NO;
          this.selectedTicket.vendorPan = res2.pan;
        }
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
    this.createNewTicket();
    this.newTicket.id = id;
    this.sharedService.setNewComplianceTicket(this.newTicket);
    this.router.navigate(['create-compliance-request']);
  }

  showApproveRejectButtons(): boolean {
    // Return false for Branch Manager immediately
    if (
      this.roleId === 1 ||
      this.selectedTicket.isClosed ||
      this.selectedTicket.isRejected
    )
      return false;

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
      case 5:
        return (
          ticket.isRMApprovalRequired &&
          ticket.hasHFMApproved &&
          !ticket.hasRMApproved &&
          !isRejected
        );

      // Role is NFM
      case 6:
        return (
          ticket.isNFMApprovalRequired &&
          ticket.hasRMApproved &&
          !ticket.hasNFMApproved &&
          !isRejected
        );

      // Role is ZM
      case 7:
        return (
          ticket.isZMApprovalRequired &&
          ticket.hasNFMApproved &&
          !ticket.hasZMApproved &&
          !isRejected
        );

      // Role is Vice President
      case 8:
        return (
          ticket.isVPApprovalRequired &&
          ticket.hasZMApproved &&
          !ticket.hasVPApproved &&
          !isRejected
        );

      // Role is Finance
      case 9:
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

  toggleApproveTicketDialog() {
    this.showApproveTicketDialog = !this.showApproveTicketDialog;
  }

  toggleRejectTicketDialog() {
    this.showRejectTicketDialog = !this.showRejectTicketDialog;
  }

  showTicketCloseButton(): boolean {
    if (this.roleId === 1 || this.roleId === 2) {
      if (
        !this.selectedTicket.hasFinanceUserApproved &&
        !this.selectedTicket.hasAdvanceApproved &&
        !this.selectedTicket.isInvoiceUploaded &&
        !this.selectedTicket.isClosed
      ) {
        return true;
      }
    }
    return false;
  }

  confirmTicketClose() {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message:
        'Are you sure you want to close this ticket? Once closed, you will not be able to make any further edits to this ticket.',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check me-2',
      rejectIcon: 'pi pi-times me-2',
      rejectButtonStyleClass: 'p-button-sm me-1',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm me-1',
      accept: () => {
        this.closeTicket();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  showTicketReopenButton(): boolean {
    if (this.roleId === 10) {
      if (this.selectedTicket.isClosed) {
        return true;
      }
    }
    return false;
  }

  confirmTicketReopen() {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message:
        'Are you sure you want to reopen this ticket? Once reopened, the ticket will be restored to its last approval status.',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check me-2',
      rejectIcon: 'pi pi-times me-2',
      rejectButtonStyleClass: 'p-button-sm me-1',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm me-1',
      accept: () => {
        this.reopenTicket();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  async reopenTicket() {
    this.showLoader = true;
    const approvalDetails: ApproveRejectDto = {
      ...this.optionalDetails,
      id: this.selectedTicket.id,
    };
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestReopenTicketPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.reopened) {
        this.messageService.add({
          severity: 'success',
          summary: 'Reopened',
          detail: 'Compliance Request Reopened Successfully',
          life: 3000,
        });
        this.confirmationService.close();
        this.showTicketDetailsDialog = false;
        this.optionalDetails.attachment = this.optionalDetails.comment = '';
        this.loadTickets();
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  async closeTicket() {
    this.showLoader = true;
    const approvalDetails: ApproveRejectDto = {
      ...this.optionalDetails,
      id: this.selectedTicket.id,
    };
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestCloseTicketPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.closed) {
        this.messageService.add({
          severity: 'success',
          summary: 'Closed',
          detail: 'Compliance Request Closed Successfully',
          life: 3000,
        });
        this.confirmationService.close();
        this.showTicketDetailsDialog = false;
        this.optionalDetails.attachment = this.optionalDetails.comment = '';
        this.loadTickets();
      }
    } catch (err: any) {
      console.error(err);
    }
    this.showLoader = false;
  }

  showUploadInvoiceButton() {
    if (
      this.roleId == 1 &&
      this.selectedTicket.allApprovalStagesCompleted &&
      (!this.selectedTicket.isInvoiceUploaded ||
        this.selectedTicket.currentStage == 'Finance Rejected') &&
      !this.selectedTicket.isClosed
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

  toggleUploadInvoiceDialog() {
    this.loadVendorNames();
    this.initInvoice();
    this.newInvoice.vendorId = this.selectedTicket.vendorId;
    this.newInvoice.advanceAmount = this.selectedTicket.advanceAmount;
    this.newInvoice.vendorName = this.selectedTicket.vendorName;
    this.showUploadInvoiceDialog = !this.showUploadInvoiceDialog;
  }

  initInvoice() {
    this.formActionsDisabled = false;
    this.newInvoice = {
      hsn: '9987',
      complianceQty: 1,
      complianceGst: 0,
      compliancePrice: 0,
      sacCode: 9987,
      agentQty: 1,
      agentCost: 0,
      invoiceGst: 0,
      grandTotal: 0,
      invoiceAmount: 0,
      fromDate: '',
      toDate: '',
      invoiceType: '',
      modeOfPayment: '',
      invoiceNumber: '',
      invoiceDate: '',
      companyName: '',
      invoiceAttachment: '',
      invoiceApprovalComment: '',
      isAdvanceRequired: false,
      advanceAmount: 0,
    };
  }

  toggleUploadAttachmentDialog() {}

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

  async approveTicket() {
    this.showLoader = true;
    const approvalDetails: ApproveRejectDto = {
      ...this.optionalDetails,
      id: this.selectedTicket.id,
    };
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestApproveTicketPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.approved) {
        this.messageService.add({
          severity: 'success',
          summary: `${
            this.roleId == 3 || this.roleId == 6 ? 'Recommended' : 'Approved'
          }`,
          detail: `Compliance Request ${
            this.roleId == 3 || this.roleId == 6 ? 'Recommended' : 'Approved'
          } Successfully`,
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
        this.complianceService.complianceRequestRejectTicketPut(
          rejectionDetails,
          this.roleId
        )
      );
      if (res && res.rejected) {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Compliance Request Rejected Successfully',
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

  updateTotalCost() {
    if (this.newInvoice.invoiceType == 'NON GST')
      this.newInvoice.invoiceGst = 0;
    this.newInvoice.grandTotal =
      (this.newInvoice.complianceQty * this.newInvoice.compliancePrice || 0) +
      this.newInvoice.agentQty *
        (this.newInvoice.agentCost * (1 + this.newInvoice.invoiceGst / 100));
  }

  checkInvoiceTotal() {}

  convertDateToString(id: number) {
    let dateToUpdate;
    switch (id) {
      case 1:
        dateToUpdate = this.dates.invoiceDate;
        break;
      case 2:
        dateToUpdate = this.dates.fromDate;
        break;
      case 3:
        dateToUpdate = this.dates.toDate;
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
        this.newInvoice!.invoiceDate = updatedDate;
        break;
      case 2:
        this.newInvoice!.fromDate = updatedDate;
        break;
      case 3:
        this.newInvoice!.toDate = updatedDate;
        break;
      default:
        throw new Error('Invalid Function Call');
    }
  }

  async submitInvoiceDetails() {
    this.showLoader = true;
    this.newInvoice.id = this.selectedTicket.id;
    try {
      const res = await firstValueFrom(
        this.complianceService.complianceRequestUpdateInvoiceDetailsPut(
          this.newInvoice
        )
      );
      if (res && res.updated) {
        this.formActionsDisabled = true;
        this.showUploadInvoiceDialog = false;
        this.showTicketDetailsDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Invoice Details Updated Successfully`,
          life: 3000,
        });
        this.loadData();
      }
    } catch (err: any) {
      this.showLoader = false;
      if (err.error.message) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 20000,
        });
        console.log(err.error.message);
      }
      if (err.error.details) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.details,
          life: 20000,
        });
        console.log(err.error.details);
      }
      console.log(err);
    }
  }
}
