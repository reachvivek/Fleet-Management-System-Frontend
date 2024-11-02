import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AdminService,
  ApproveRejectDto,
  BatteryDetailsDto,
  BatteryInvoiceDetailsDto,
  BatteryRequestService,
  BulkUploadService,
  FiltersDto,
  VendorForSelectDto,
} from '../../../swagger';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { UserSyncService } from '../../services/user-sync.service';
import { NewBatteryTicket, SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-battery-request-management',
  templateUrl: './battery-request-management.component.html',
  styleUrl: './battery-request-management.component.scss',
})
export class BatteryRequestManagementComponent {
  showLoader: boolean = false;
  formActionsDisabled: boolean = false;

  tickets: any[] = [];
  filteredTickets: any[] = [];

  newTicket!: NewBatteryTicket;
  newInvoice: BatteryInvoiceDetailsDto = {};

  showCreateRequestDialog: boolean = false;
  showFilterDialog: boolean = false;
  showTicketDetailsDialog: boolean = false;
  showApproveTicketDialog: boolean = false;
  showRejectTicketDialog: boolean = false;
  showUploadInvoiceDialog: boolean = false;

  optionalDetails: { attachment: string; comment: string } = {
    attachment: '',
    comment: '',
  };

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

  selectedTicket: BatteryDetailsDto | any = {};
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

  vendors: VendorForSelectDto[] = [];

  invoiceTypes: string[] = ['GST', 'NON GST'];
  companyNames: string[] = ['CMS', 'CMS-SIPL(Div)', 'SIPL'];
  modeOfPayments: string[] = ['HO', 'Imprest'];

  batteryMakes: string[] = [];
  batteryModels: string[] = [];
  batteryTypes: string[] = [];
  batterySerialNumbers: string[] = [];
  isSerialNumberTaken: boolean = false;

  dates = {
    invoiceDate: undefined,
    fromDate: undefined,
    toDate: undefined,
  };

  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));
  maxDate: Date = new Date();

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private userSyncService: UserSyncService,
    private sharedService: SharedService,
    private router: Router,
    private commonService: BulkUploadService,
    private batteryService: BatteryRequestService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
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
        this.batteryService.batteryRequestGetAllBatteryRequestsPost(this.roleId)
      );
      if (res && res.success) {
        this.tickets = this.filteredTickets = res.data.map(
          (ticket: NewBatteryTicket) => {
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
    return `FMS_Battery_Report_${new Date().toLocaleString()}`;
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

      // Battery Details
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
    };
  }

  createTicket() {
    this.sharedService.setNewBatteryTicket(this.newTicket);
    this.router.navigate(['create-battery-request']);
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

  async viewTicket(id: number) {
    this.showTicketDetailsDialog = true;
    this.selectedTicketApprovalStages = [];
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestGetBatteryDetailsByIdGet(id)
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
            this.selectedTicket.new_Battery_Vendor_Id
          )
        );
        if (res2 && res2.name) {
          this.selectedTicket.new_Battery_Vendor_Name = res2.name;
        }
        const res3 = await firstValueFrom(
          this.commonService.bulkUploadGetVendorDetailsGet(
            this.selectedTicket.actual_Battery_Vendor_Id
          )
        );
        if (res3 && res3.name) {
          this.selectedTicket.vendor_Name = res3.name;
          this.selectedTicket.vendor_Pan = res3.pan;
          this.selectedTicket.vendorGst = res3.gsT_NO;
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
    this.sharedService.setNewBatteryTicket(this.newTicket);
    this.router.navigate(['create-battery-request']);
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
    if (this.roleId === 9) {
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
        this.batteryService.batteryRequestReopenBatteryRequestPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Reopened',
          detail: 'Battery Request Reopened Successfully',
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
        this.batteryService.batteryRequestCloseBatteryRequestPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Closed',
          detail: 'Battery Request Closed Successfully',
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
    this.loadBatteryMakes();
    this.loadBatteryModels();
    this.loadBatteryTypes();
    this.loadBatterySerialNumbers();
    this.loadVendorNames();
    this.initInvoice();
    this.newInvoice.actual_Battery_Vendor_Id =
      this.selectedTicket.new_Battery_Vendor_Id;
    this.newInvoice.advanceAmount = this.selectedTicket.advanceAmount;
    this.showUploadInvoiceDialog = !this.showUploadInvoiceDialog;
  }

  initInvoice() {
    this.newInvoice = {
      id: undefined,
      actual_Battery_Serial_Number: '',
      actual_Battery_Make: '',
      actual_Battery_Model: '',
      actual_Battery_Warranty_Months: 0,
      actual_Battery_Voltage: 0.0,
      actual_Battery_Vendor_Id: '',
      actual_Battery_Type: '',
      actual_Battery_Amp: 0.0,
      actual_Battery_Qty: 1,
      actual_Battery_Cost: 0.0,
      actual_Battery_GST: undefined,
      actual_Battery_Invoice_Date: '',
      actual_Battery_Invoice_Number: '',
      company_Name: '',
      labor_Cost: 0.0,
      labor_GST: 0.0,
      labor_Qty: 0,
      invoice_Total: 0.0,
      hsn: '8507',
      saC_Code: 9987,
      grandTotal: 0,
      invoice_Type: '',
      mode_Of_Payment: '',
      invoice_Attachment: '',
      invoice_Approval_Comment: '',
      advanceAmount: 0,
    };
  }

  toggleUploadAttachmentDialog() {}

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

  checkSerialNumber(serialNumber: string): void {
    if (serialNumber) {
      this.isSerialNumberTaken =
        this.batterySerialNumbers.includes(serialNumber);
    } else {
      this.isSerialNumberTaken = false; // Reset if input is empty
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

  async approveTicket() {
    this.showLoader = true;
    const approvalDetails: ApproveRejectDto = {
      ...this.optionalDetails,
      id: this.selectedTicket.id,
    };
    try {
      const res = await firstValueFrom(
        this.batteryService.batteryRequestApproveRequestPut(
          approvalDetails,
          this.roleId
        )
      );
      if (res && res.success) {
        this.messageService.add({
          severity: 'success',
          summary: `${
            this.roleId == 3 || this.roleId == 5 ? 'Recommended' : 'Approved'
          }`,
          detail: `Battery Request ${
            this.roleId == 3 || this.roleId == 5 ? 'Recommended' : 'Approved'
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
        this.batteryService.batteryRequestRejectRequestPut(
          rejectionDetails,
          this.roleId
        )
      );
      if (res && res.success) {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Battery Request Rejected Successfully',
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
    if (this.newInvoice.invoice_Type == 'NON GST')
      this.newInvoice.actual_Battery_GST = this.newInvoice.labor_GST = 0;
    this.newInvoice.grandTotal =
      this.newInvoice.actual_Battery_Qty! *
        (this.newInvoice.actual_Battery_Cost! *
          (1 + this.newInvoice.actual_Battery_GST! / 100)) +
      this.newInvoice.labor_Qty! *
        (this.newInvoice.labor_Cost! * (1 + this.newInvoice.labor_GST! / 100));
  }

  convertDateToString(id: number) {
    let dateToUpdate;
    switch (id) {
      case 1:
        dateToUpdate = this.dates.invoiceDate;
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
        this.newInvoice!.actual_Battery_Invoice_Date = updatedDate;
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
        this.batteryService.batteryRequestUpdateBatteryInvoiceDetailsPut(
          this.newInvoice
        )
      );
      if (res && res.success) {
        this.formActionsDisabled = true;
        this.showUploadInvoiceDialog = false;
        this.showTicketDetailsDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Invoice Details Updated Successfully`,
          life: 3000,
        });
        this.formActionsDisabled = false;
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
