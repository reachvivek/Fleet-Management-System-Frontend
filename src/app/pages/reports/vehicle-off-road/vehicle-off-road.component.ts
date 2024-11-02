import { Component } from '@angular/core';
import {
  BulkUploadService,
  VehicleDetailsOffRoad,
  VehicleOffRoadReport,
} from '../../../../swagger';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-vehicle-off-road',
  templateUrl: './vehicle-off-road.component.html',
  styleUrl: './vehicle-off-road.component.scss',
})
export class VehicleOffRoadComponent {
  showLoader: boolean = false;
  showVehicleDetailsDialog: boolean = false;

  dates: { fromDate: Date; toDate: Date } = {
    fromDate: new Date(new Date().setHours(0, 0, 0, 0)),
    toDate: new Date(new Date().setHours(23, 59, 59, 999)),
  };

  records: VehicleOffRoadReport[] | any[] = [];
  vehicleDetails: VehicleDetailsOffRoad[] = [];

  selectedRegion: string | undefined;

  grandTotal: {
    totalVehicles: number;
    totalVehiclesPercentage: number;
    offRoadVehicles: number;
    offRoadVehiclesPercentage: number;
    accidentVehicles: number;
    averageAgeInDays: number;
    documentation: number;
    repairWip: number;
    tyreBattery: number;
  } = {
    totalVehicles: 0,
    totalVehiclesPercentage: 0,
    offRoadVehicles: 0,
    offRoadVehiclesPercentage: 0,
    accidentVehicles: 0,
    averageAgeInDays: 0,
    documentation: 0,
    repairWip: 0,
    tyreBattery: 0,
  };

  offRoadReportColumns = [
    { header: 'SR. NO.', field: 'id' },
    { header: 'REGION', field: 'region' },
    { header: 'TOTAL VEHICLE', field: 'totalVehicles' },
    {
      header: 'SIZE OF THE FLEET WRT PAN INDIA',
      field: 'totalVehiclesPercentage',
    },
    { header: 'OFF ROAD VEHICLE', field: 'offRoadVehicles' },
    { header: 'OFF ROADING PERCENTAGE', field: 'offRoadVehiclesPercentage' },
    { header: 'AVERAGE AGE IN DAYS', field: 'averageAgeInDays' },
    { header: 'DOCUMENTATION', field: 'documentation' },
    { header: 'REPAIR WIP', field: 'repairWip' },
    { header: 'TYRE BATTERY', field: 'tyreBattery' },
    { header: 'ACCIDENT', field: 'accidentVehicles' },
  ];
  vehicleDetailsColumns = [
    { header: 'SR. NO.', field: 'id' },
    { header: 'DATE', field: 'date' },
    { header: 'ZONE', field: 'zone' },
    { header: 'REGION', field: 'region' },
    { header: 'BRANCH', field: 'branch' },
    { header: 'REGISTRATION NO', field: 'registration_No' },
    { header: 'MODEL NAME', field: 'model_Name' },
    { header: 'YEAR', field: 'make_Year' },
    { header: 'OFF ROAD AGE IN DAYS', field: 'offRoad_Age' },
    { header: 'OFF ROAD TYPE', field: 'offroad_Reason' },
    { header: 'OFF ROAD DATE', field: 'offroad_Date' },
  ];

  constructor(private offRoadService: BulkUploadService) {}

  ngOnInit(): void {
    this.loadOffRoadReport();
  }

  async loadOffRoadReport() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.offRoadService.bulkUploadGetVehicleOffRoadReportGet()
      );
      if (res && res.length) {
        // // Calculate Grand Total Vehicles, Off Road Vehicles, and Accident Vehicles
        res.forEach((entry: VehicleOffRoadReport | any, index: number) => {
          entry.id = index + 1;
          this.grandTotal.totalVehicles += entry.totalVehicles!;
          this.grandTotal.offRoadVehicles += entry.offRoadVehicles!;
          this.grandTotal.accidentVehicles += entry.accidentVehicles!;
          this.grandTotal.totalVehiclesPercentage +=
            entry.totalVehiclesPercentage!;
          this.grandTotal.documentation += entry.documentation!;
          this.grandTotal.repairWip += entry.repairWip!;
          this.grandTotal.tyreBattery += entry.tyreBattery!;
          let totalAgeInDays = 0; // Total age in days for the current region
          let validAgeCount = 0; // Count of valid average age entries for the current region
          const currentDate = new Date(); // Current date for calculations

          // Calculate the age from vehicleDetails
          entry.vehicleDetails!.forEach((vehicle: any) => {
            const offroadDate = vehicle.offroad_From_Date!;
            if (offroadDate && offroadDate !== 'NA') {
              // Extract date portion and parse it
              const dateString = offroadDate.substring(0, 19); // Format: yyyy-MM-dd HH:mm:ss
              const vehicleDate = new Date(dateString + 'Z'); // Adding 'Z' to treat as UTC
              const ageInDays = Math.floor(
                (currentDate.getTime() - vehicleDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              // Accumulate total age in days
              if (ageInDays >= 0) {
                // Only count if age is valid (not negative)
                totalAgeInDays += ageInDays;
                validAgeCount++; // Increment the count of valid ages
              }
            }
          });

          entry.averageAgeInDays =
            validAgeCount > 0 ? Math.floor(totalAgeInDays / validAgeCount) : 0;

          this.grandTotal.averageAgeInDays += entry.averageAgeInDays;
        });
        this.grandTotal.totalVehiclesPercentage = Math.round(
          this.grandTotal.totalVehiclesPercentage
        );
        this.grandTotal.offRoadVehiclesPercentage = parseFloat(
          (
            (this.grandTotal.offRoadVehicles / this.grandTotal.totalVehicles) *
            100
          ).toFixed(2)
        );
        this.records = res;
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  showVehicleAgeingDetails(
    region: string,
    offroad_Reason: string | null = null
  ) {
    this.vehicleDetails = [];
    this.selectedRegion = region;
    this.vehicleDetails = [
      ...this.records
        .filter((entry: VehicleOffRoadReport) => entry.region === region)
        .flatMap((entry) => entry.vehicleDetails),
    ]; // Flatten the array of vehicle details
    this.vehicleDetails = [
      ...this.vehicleDetails.filter(
        (entry: VehicleDetailsOffRoad) =>
          entry.is_vehicle_offroad == 'TRUE' &&
          (!offroad_Reason || entry.offroad_Reason == offroad_Reason)
      ),
    ];
    const currentDate = new Date(); // Current date for calculations
    this.vehicleDetails.forEach(
      (entry: VehicleDetailsOffRoad | any, index: number) => {
        entry.id = index + 1;
        entry.date = new Date();
        const offroadDate = entry.offroad_From_Date!;
        if (
          offroadDate &&
          offroadDate !== 'NA' &&
          typeof offroadDate === 'string'
        ) {
          // Extract date portion and parse it
          const dateString = offroadDate.substring(0, 19); // Format: yyyy-MM-dd HH:mm:ss
          const vehicleDate = new Date(dateString + 'Z'); // Adding 'Z' to treat as UTC
          entry.offroad_Date = vehicleDate;
          const ageInDays = Math.floor(
            (currentDate.getTime() - vehicleDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          // Accumulate total age in days
          if (ageInDays >= 0) {
            // Only count if age is valid (not negative)
            entry.offRoad_Age! += ageInDays;
          }
        }
      }
    );

    if (this.vehicleDetails.length > 0) {
      this.showVehicleDetailsDialog = true;
    }
    console.log(this.vehicleDetails);
  }

  generateExportName(reportTypeId: number): string {
    const reportType =
      reportTypeId === 1
        ? 'Daily_Off_Road_Report'
        : `Drill_Down_Report_${this.selectedRegion}`; // Adjust based on your report types
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format: yyyy-MM-dd
    const timestamp = currentDate.getTime(); // Unique timestamp for the filename

    return `${reportType}_${formattedDate}_${timestamp}`;
  }
}
