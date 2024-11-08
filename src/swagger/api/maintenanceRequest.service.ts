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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { ApproveRejectDto } from '../model/approveRejectDto';
import { CreateMaintenanceTicketDto } from '../model/createMaintenanceTicketDto';
import { InvoiceDetailsDto } from '../model/invoiceDetailsDto';
import { MaintenanceReportDto } from '../model/maintenanceReportDto';
import { ServiceRequestTypeDto } from '../model/serviceRequestTypeDto';
import { TicketDetailsDto } from '../model/ticketDetailsDto';
import { TicketsForDashboardDto } from '../model/ticketsForDashboardDto';
import { UpdateMaintenanceTicketDto } from '../model/updateMaintenanceTicketDto';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestService {

    protected basePath = '/';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * 
     * @param body 
     * @param roleId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (roleId !== undefined && roleId !== null) {
            queryParameters = queryParameters.set('roleId', <any>roleId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/MaintenanceRequest/ApproveTicket`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param roleId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestCloseTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestCloseTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestCloseTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestCloseTicketPut(body?: ApproveRejectDto, roleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (roleId !== undefined && roleId !== null) {
            queryParameters = queryParameters.set('roleId', <any>roleId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/MaintenanceRequest/CloseTicket`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestCreateMaintenanceRequestPost(body?: CreateMaintenanceTicketDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestCreateMaintenanceRequestPost(body?: CreateMaintenanceTicketDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestCreateMaintenanceRequestPost(body?: CreateMaintenanceTicketDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestCreateMaintenanceRequestPost(body?: CreateMaintenanceTicketDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('post',`${this.basePath}/MaintenanceRequest/CreateMaintenanceRequest`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestGetAllMaintenanceRequestsPost(body?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<TicketsForDashboardDto>>;
    public maintenanceRequestGetAllMaintenanceRequestsPost(body?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TicketsForDashboardDto>>>;
    public maintenanceRequestGetAllMaintenanceRequestsPost(body?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TicketsForDashboardDto>>>;
    public maintenanceRequestGetAllMaintenanceRequestsPost(body?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<Array<TicketsForDashboardDto>>('post',`${this.basePath}/MaintenanceRequest/GetAllMaintenanceRequests`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param fromDate 
     * @param toDate 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestGetMaintenanceRequestsReportPost(body?: number, fromDate?: string, toDate?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<MaintenanceReportDto>>;
    public maintenanceRequestGetMaintenanceRequestsReportPost(body?: number, fromDate?: string, toDate?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<MaintenanceReportDto>>>;
    public maintenanceRequestGetMaintenanceRequestsReportPost(body?: number, fromDate?: string, toDate?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<MaintenanceReportDto>>>;
    public maintenanceRequestGetMaintenanceRequestsReportPost(body?: number, fromDate?: string, toDate?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {




        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (fromDate !== undefined && fromDate !== null) {
            queryParameters = queryParameters.set('fromDate', <any>fromDate);
        }
        if (toDate !== undefined && toDate !== null) {
            queryParameters = queryParameters.set('toDate', <any>toDate);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<Array<MaintenanceReportDto>>('post',`${this.basePath}/MaintenanceRequest/GetMaintenanceRequestsReport`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param system_name 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestGetPartNamesGet(system_name?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public maintenanceRequestGetPartNamesGet(system_name?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public maintenanceRequestGetPartNamesGet(system_name?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public maintenanceRequestGetPartNamesGet(system_name?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (system_name !== undefined && system_name !== null) {
            queryParameters = queryParameters.set('system_name', <any>system_name);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/MaintenanceRequest/GetPartNames`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestGetServiceRequestTypesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<ServiceRequestTypeDto>>;
    public maintenanceRequestGetServiceRequestTypesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ServiceRequestTypeDto>>>;
    public maintenanceRequestGetServiceRequestTypesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ServiceRequestTypeDto>>>;
    public maintenanceRequestGetServiceRequestTypesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<ServiceRequestTypeDto>>('get',`${this.basePath}/MaintenanceRequest/GetServiceRequestTypes`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestGetSystemNamesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public maintenanceRequestGetSystemNamesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public maintenanceRequestGetSystemNamesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public maintenanceRequestGetSystemNamesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/MaintenanceRequest/GetSystemNames`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestGetTicketDetailsByIdGet(id?: number, observe?: 'body', reportProgress?: boolean): Observable<TicketDetailsDto>;
    public maintenanceRequestGetTicketDetailsByIdGet(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<TicketDetailsDto>>;
    public maintenanceRequestGetTicketDetailsByIdGet(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<TicketDetailsDto>>;
    public maintenanceRequestGetTicketDetailsByIdGet(id?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<TicketDetailsDto>('get',`${this.basePath}/MaintenanceRequest/GetTicketDetailsById`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param roleId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (roleId !== undefined && roleId !== null) {
            queryParameters = queryParameters.set('roleId', <any>roleId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/MaintenanceRequest/RejectTicket`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param roleId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestReopenTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestReopenTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestReopenTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestReopenTicketPut(body?: ApproveRejectDto, roleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (roleId !== undefined && roleId !== null) {
            queryParameters = queryParameters.set('roleId', <any>roleId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/MaintenanceRequest/ReopenTicket`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestUpdateInvoiceDetailsPut(body?: InvoiceDetailsDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestUpdateInvoiceDetailsPut(body?: InvoiceDetailsDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestUpdateInvoiceDetailsPut(body?: InvoiceDetailsDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestUpdateInvoiceDetailsPut(body?: InvoiceDetailsDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/MaintenanceRequest/UpdateInvoiceDetails`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public maintenanceRequestUpdateMaintenanceRequestPut(body?: UpdateMaintenanceTicketDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public maintenanceRequestUpdateMaintenanceRequestPut(body?: UpdateMaintenanceTicketDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public maintenanceRequestUpdateMaintenanceRequestPut(body?: UpdateMaintenanceTicketDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public maintenanceRequestUpdateMaintenanceRequestPut(body?: UpdateMaintenanceTicketDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/MaintenanceRequest/UpdateMaintenanceRequest`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
