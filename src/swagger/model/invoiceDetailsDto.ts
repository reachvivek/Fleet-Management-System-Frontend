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

export interface InvoiceDetailsDto { 
    id?: number;
    invoiceTotalSpareCost?: number;
    invoiceTotalLaborCost?: number;
    invoiceTotalEstimatedCost?: number;
    actualServiceDetails?: string;
    invoiceType?: string;
    modeOfPayment?: string;
    invoiceNumber?: string;
    invoiceDate?: string;
    invoiceAmount?: number;
    serviceDate?: string;
    companyName?: string;
    jobcardAttachment?: string;
    invoiceAttachment?: string;
    vendorId?: string;
}