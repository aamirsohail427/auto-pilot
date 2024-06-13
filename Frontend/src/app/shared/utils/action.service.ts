import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceBase } from '../base-classes/service.base';

@Injectable()
export class ActionService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/actions';
    private readonly getByFilterUrl = this.defaultUrl + '/getByFilter';

    constructor(private http: HttpClient) {
        super();
    }

    getByFilter(params: any): Observable<any> {
        return this.http.post<any>(this.getByFilterUrl, params);
    }
}
