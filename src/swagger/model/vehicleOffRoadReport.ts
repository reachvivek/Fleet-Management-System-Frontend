/**
 * fms
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { VehicleDetailsOffRoad } from './vehicleDetailsOffRoad';

export interface VehicleOffRoadReport { 
    region?: string;
    totalVehicles?: number;
    offRoadVehicles?: number;
    totalVehiclesPercentage?: number;
    offRoadVehiclesPercentage?: number;
    averageAgeInDays?: number;
    documentation?: number;
    repairWip?: number;
    tyreBattery?: number;
    accidentVehicles?: number;
    vehicleDetails?: Array<VehicleDetailsOffRoad>;
}