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

import { AdminToAddDto } from '../model/adminToAddDto';
import { AdminToEditDto } from '../model/adminToEditDto';
import { FiltersDto } from '../model/filtersDto';
import { Role } from '../model/role';
import { UserAccessDto } from '../model/userAccessDto';
import { UserToShowDto } from '../model/userToShowDto';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminCreateUserPost(body?: AdminToAddDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public adminCreateUserPost(body?: AdminToAddDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public adminCreateUserPost(body?: AdminToAddDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public adminCreateUserPost(body?: AdminToAddDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/Admin/CreateUser`,
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
    public adminEditUserPut(body?: AdminToEditDto, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public adminEditUserPut(body?: AdminToEditDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public adminEditUserPut(body?: AdminToEditDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public adminEditUserPut(body?: AdminToEditDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('put',`${this.basePath}/Admin/EditUser`,
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
     * @param accessLevel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetAccessScopeGet(accessLevel?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public adminGetAccessScopeGet(accessLevel?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public adminGetAccessScopeGet(accessLevel?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public adminGetAccessScopeGet(accessLevel?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (accessLevel !== undefined && accessLevel !== null) {
            queryParameters = queryParameters.set('accessLevel', <any>accessLevel);
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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Admin/GetAccessScope`,
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
    public adminGetAllFiltersGet(observe?: 'body', reportProgress?: boolean): Observable<FiltersDto>;
    public adminGetAllFiltersGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<FiltersDto>>;
    public adminGetAllFiltersGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<FiltersDto>>;
    public adminGetAllFiltersGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<FiltersDto>('get',`${this.basePath}/Admin/GetAllFilters`,
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
     * @param regionName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetBranchesGet(body?: UserAccessDto, regionName?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public adminGetBranchesGet(body?: UserAccessDto, regionName?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public adminGetBranchesGet(body?: UserAccessDto, regionName?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public adminGetBranchesGet(body?: UserAccessDto, regionName?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



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
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Admin/GetBranches`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetEmailsGet(observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public adminGetEmailsGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public adminGetEmailsGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public adminGetEmailsGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Admin/GetEmails`,
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
     * @param branchName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetHubsGet(branchName?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public adminGetHubsGet(branchName?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public adminGetHubsGet(branchName?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public adminGetHubsGet(branchName?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Admin/GetHubs`,
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
     * @param zone 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetRegionsGet(body?: UserAccessDto, zone?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public adminGetRegionsGet(body?: UserAccessDto, zone?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public adminGetRegionsGet(body?: UserAccessDto, zone?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public adminGetRegionsGet(body?: UserAccessDto, zone?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



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
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Admin/GetRegions`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetRolesGet(observe?: 'body', reportProgress?: boolean): Observable<Array<Role>>;
    public adminGetRolesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Role>>>;
    public adminGetRolesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Role>>>;
    public adminGetRolesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<Role>>('get',`${this.basePath}/Admin/GetRoles`,
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
    public adminGetUsersGet(observe?: 'body', reportProgress?: boolean): Observable<Array<UserToShowDto>>;
    public adminGetUsersGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<UserToShowDto>>>;
    public adminGetUsersGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<UserToShowDto>>>;
    public adminGetUsersGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<UserToShowDto>>('get',`${this.basePath}/Admin/GetUsers`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminGetZonesGet(body?: UserAccessDto, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public adminGetZonesGet(body?: UserAccessDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public adminGetZonesGet(body?: UserAccessDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public adminGetZonesGet(body?: UserAccessDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/Admin/GetZones`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminIsAdminGet(observe?: 'body', reportProgress?: boolean): Observable<boolean>;
    public adminIsAdminGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<boolean>>;
    public adminIsAdminGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<boolean>>;
    public adminIsAdminGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<boolean>('get',`${this.basePath}/Admin/IsAdmin`,
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
     * @param UserId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public adminSuspendUserUserIdDelete(UserId: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public adminSuspendUserUserIdDelete(UserId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public adminSuspendUserUserIdDelete(UserId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public adminSuspendUserUserIdDelete(UserId: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (UserId === null || UserId === undefined) {
            throw new Error('Required parameter UserId was null or undefined when calling adminSuspendUserUserIdDelete.');
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
        ];

        return this.httpClient.request<any>('delete',`${this.basePath}/Admin/SuspendUser/${encodeURIComponent(String(UserId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
