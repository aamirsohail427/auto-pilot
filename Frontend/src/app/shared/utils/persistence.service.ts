import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceBase } from '../base-classes/service.base';
import { Observable } from 'rxjs';

@Injectable()
export class PersistenceService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/persistence';

    private readonly getByFilterUrl = this.defaultUrl + '/GetByFilter';
    private readonly updateUrl = this.defaultUrl + '/Update';

    constructor(private http: HttpClient) {
        super();
    }

    getByFilter(params: any): Observable<any> {
        return this.http.post<any>(this.getByFilterUrl, params);
    }

    update(params: any): Observable<any> {
        return this.http.post<any>(this.updateUrl, params);
    }
}
