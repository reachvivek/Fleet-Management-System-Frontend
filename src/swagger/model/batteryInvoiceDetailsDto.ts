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

export interface BatteryInvoiceDetailsDto { 
    id?: number;
    actual_Battery_Serial_Number?: string;
    actual_Battery_Make?: string;
    actual_Battery_Model?: string;
    actual_Battery_Warranty_Months?: number;
    actual_Battery_Voltage?: number;
    actual_Battery_Vendor_Id?: string;
    actual_Battery_Type?: string;
    actual_Battery_Amp?: number;
    actual_Battery_Qty?: number;
    actual_Battery_Cost?: number;
    actual_Battery_GST?: number;
    actual_Battery_Invoice_Date?: string;
    actual_Battery_Invoice_Number?: string;
    company_Name?: string;
    labor_Cost?: number;
    labor_GST?: number;
    labor_Qty?: number;
    invoice_Total?: number;
    hsn?: string;
    saC_Code?: number;
    invoice_Type?: string;
    mode_Of_Payment?: string;
    invoice_Attachment?: string;
    isAdvanceRequired?: number;
    grandTotal?: number;
    advanceAmount?: number;
    invoice_Approval_Comment?: string;
}