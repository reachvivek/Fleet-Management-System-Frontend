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
import { CreateTicketDto } from '../model/createTicketDto';
import { OffRoadReasonDto } from '../model/offRoadReasonDto';
import { ServiceRequestTypeDto } from '../model/serviceRequestTypeDto';
import { TicketDetailsDto } from '../model/ticketDetailsDto';
import { TicketsForDashboardDto } from '../model/ticketsForDashboardDto';
import { UpdateTicketDto } from '../model/updateTicketDto';
import { UpdateVehicleDetailsDto } from '../model/updateVehicleDetailsDto';
import { VehicleDetailsDto } from '../model/vehicleDetailsDto';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

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
    public ticketApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public ticketApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public ticketApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public ticketApproveTicketPut(body?: ApproveRejectDto, roleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



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

        return this.httpClient.request<any>('put',`${this.basePath}/Ticket/ApproveTicket`,
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
    public ticketCreateMaintenanceRequestPost(body?: CreateTicketDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public ticketCreateMaintenanceRequestPost(body?: CreateTicketDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public ticketCreateMaintenanceRequestPost(body?: CreateTicketDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public ticketCreateMaintenanceRequestPost(body?: CreateTicketDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/Ticket/CreateMaintenanceRequest`,
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
    public ticketGetAllMaintenanceRequestsPost(body?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<TicketsForDashboardDto>>;
    public ticketGetAllMaintenanceRequestsPost(body?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<TicketsForDashboardDto>>>;
    public ticketGetAllMaintenanceRequestsPost(body?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<TicketsForDashboardDto>>>;
    public ticketGetAllMaintenanceRequestsPost(body?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<Array<TicketsForDashboardDto>>('post',`${this.basePath}/Ticket/GetAllMaintenanceRequests`,
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
     * @param regionName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketGetBranchesGet(regionName?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetBranchesGet(regionName?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetBranchesGet(regionName?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetBranchesGet(regionName?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (regionName !== undefined && regionName !== null) {
            queryParameters = queryParameters.set('regionName', <any>regionName);
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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetBranches`,
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
     * @param branchName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketGetHubsGet(branchName?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetHubsGet(branchName?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetHubsGet(branchName?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetHubsGet(branchName?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (branchName !== undefined && branchName !== null) {
            queryParameters = queryParameters.set('branchName', <any>branchName);
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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetHubs`,
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
    public ticketGetOffRoadReasonsGet(observe?: 'body', reportProgress?: boolean): Observable<Array<OffRoadReasonDto>>;
    public ticketGetOffRoadReasonsGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<OffRoadReasonDto>>>;
    public ticketGetOffRoadReasonsGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<OffRoadReasonDto>>>;
    public ticketGetOffRoadReasonsGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<OffRoadReasonDto>>('get',`${this.basePath}/Ticket/GetOffRoadReasons`,
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
     * @param system_name 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketGetPartNamesGet(system_name?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetPartNamesGet(system_name?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetPartNamesGet(system_name?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetPartNamesGet(system_name?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetPartNames`,
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
     * @param zone 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketGetRegionsGet(zone?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetRegionsGet(zone?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetRegionsGet(zone?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetRegionsGet(zone?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (zone !== undefined && zone !== null) {
            queryParameters = queryParameters.set('zone', <any>zone);
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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetRegions`,
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
    public ticketGetServiceRequestTypesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<ServiceRequestTypeDto>>;
    public ticketGetServiceRequestTypesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ServiceRequestTypeDto>>>;
    public ticketGetServiceRequestTypesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ServiceRequestTypeDto>>>;
    public ticketGetServiceRequestTypesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<ServiceRequestTypeDto>>('get',`${this.basePath}/Ticket/GetServiceRequestTypes`,
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
    public ticketGetSystemNamesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetSystemNamesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetSystemNamesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetSystemNamesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetSystemNames`,
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
    public ticketGetTicketDetailsByIdGet(id?: number, observe?: 'body', reportProgress?: boolean): Observable<TicketDetailsDto>;
    public ticketGetTicketDetailsByIdGet(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<TicketDetailsDto>>;
    public ticketGetTicketDetailsByIdGet(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<TicketDetailsDto>>;
    public ticketGetTicketDetailsByIdGet(id?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<TicketDetailsDto>('get',`${this.basePath}/Ticket/GetTicketDetailsById`,
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
     * @param registration_no 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketGetVehicleDetailsGet(registration_no?: string, observe?: 'body', reportProgress?: boolean): Observable<VehicleDetailsDto>;
    public ticketGetVehicleDetailsGet(registration_no?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<VehicleDetailsDto>>;
    public ticketGetVehicleDetailsGet(registration_no?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<VehicleDetailsDto>>;
    public ticketGetVehicleDetailsGet(registration_no?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (registration_no !== undefined && registration_no !== null) {
            queryParameters = queryParameters.set('registration_no', <any>registration_no);
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

        return this.httpClient.request<VehicleDetailsDto>('get',`${this.basePath}/Ticket/GetVehicleDetails`,
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
     * @param hubName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketGetVehicleRegistrationNumbersGet(hubName?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetVehicleRegistrationNumbersGet(hubName?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetVehicleRegistrationNumbersGet(hubName?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetVehicleRegistrationNumbersGet(hubName?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (hubName !== undefined && hubName !== null) {
            queryParameters = queryParameters.set('hubName', <any>hubName);
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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetVehicleRegistrationNumbers`,
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
    public ticketGetVendorNamesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetVendorNamesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetVendorNamesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetVendorNamesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetVendorNames`,
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
    public ticketGetZonesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public ticketGetZonesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public ticketGetZonesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public ticketGetZonesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Ticket/GetZones`,
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
     * @param body 
     * @param roleId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ticketRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public ticketRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public ticketRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public ticketRejectTicketPut(body?: ApproveRejectDto, roleId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



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

        return this.httpClient.request<any>('put',`${this.basePath}/Ticket/RejectTicket`,
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
    public ticketUpdateMaintenanceRequestPut(body?: UpdateTicketDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public ticketUpdateMaintenanceRequestPut(body?: UpdateTicketDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public ticketUpdateMaintenanceRequestPut(body?: UpdateTicketDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public ticketUpdateMaintenanceRequestPut(body?: UpdateTicketDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('put',`${this.basePath}/Ticket/UpdateMaintenanceRequest`,
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
    public ticketUpdateVehicleDetailsPut(body?: UpdateVehicleDetailsDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public ticketUpdateVehicleDetailsPut(body?: UpdateVehicleDetailsDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public ticketUpdateVehicleDetailsPut(body?: UpdateVehicleDetailsDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public ticketUpdateVehicleDetailsPut(body?: UpdateVehicleDetailsDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('put',`${this.basePath}/Ticket/UpdateVehicleDetails`,
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