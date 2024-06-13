
import { ServiceBase } from '../base-classes/service.base';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TimeZoneService extends ServiceBase {

    private readonly defaultUrl = this.apiUrlDomain + 'api/timeZone';
    public readonly getEntityTodayUrl = this.defaultUrl + '/getEntityToday';

    constructor(private http: HttpClient) {
        super();
    }
    getEntityToday(): Observable<any> {
        return this.http.get(this.getEntityTodayUrl);
    }
}