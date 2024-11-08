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

export interface BatteryReportDto { 
    id?: number;
    serviceId?: string;
    createdOn?: Date;
    currentStage?: string;
    updatedOn?: Date;
    isVehicleOffRoad?: number;
    registrationNumber?: string;
    quotationAttachment?: string;
    overallComment?: string;
    new_battery_total?: number;
    battery_scrap_value?: number;
    battery_Make?: string;
    battery_Model?: string;
    battery_Warranty_Months?: number;
    battery_Serial_Number?: string;
    battery_invoice_date?: string;
    battery_vendor_name?: string;
    actual_Battery_Type?: string;
    actual_Battery_Voltage?: number;
    actual_Battery_Amp?: number;
    actual_Battery_Invoice_Date?: string;
    actual_Battery_Serial_Number?: string;
    actual_Battery_Vendor_Id?: string;
    actual_Battery_Vendor_Name?: string;
    invoice_Total?: number;
    actual_Battery_Qty?: number;
    actual_Battery_Invoice_Number?: string;
    invoiceAttachment?: string;
    modeOfPayment?: string;
    hub?: string;
    branch?: string;
    zone?: string;
    region?: string;
    invoiceType?: string;
    rejectionComment?: string;
    utrNumber?: string;
    paymentDate?: string;
    isAdvanceRequired?: number;
    isInvoiceUploaded?: number;
    isRejected?: number;
    isClosed?: number;
    status?: string;
    batteryAttachment?: string;
    warrantyAttachment?: string;
}