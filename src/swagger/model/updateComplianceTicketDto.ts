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

export interface UpdateComplianceTicketDto { 
    id?: number;
    zone?: string;
    region?: string;
    branch?: string;
    hub?: string;
    registrationNumber?: string;
    vehicleAge?: string;
    manufacturer?: string;
    model?: string;
    vehicleSubStatus?: string;
    isVehicleOffRoad?: number;
    dateOfLastService?: string;
    offRoadReason?: string;
    offRoadStatusChangeDate?: string;
    typeOfCompliance?: string;
    vendorId?: string;
    renewalFees?: number;
    agentFees?: number;
    miscAmount?: number;
    penaltyFees?: number;
    gstAmount?: number;
    finalAmount?: number;
    quotationAttachment?: string;
    overallComment?: string;
    isAdvanceRequired?: number;
    advanceAmount?: number;
    isRMApprovalRequired?: number;
    isNFMApprovalRequired?: number;
    isZMApprovalRequired?: number;
    isVPApprovalRequired?: number;
    currentStage?: string;
}