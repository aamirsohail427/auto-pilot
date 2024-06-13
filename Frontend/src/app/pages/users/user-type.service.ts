import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "../../shared/base-classes";

@Injectable()

class UserTypeService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/userTypes';
    private readonly getUsersTypeUrl = this.defaultUrl + '/getByFilter';
    private readonly detailUrl = this.defaultUrl + '/getById/{id}';
    private readonly createUrl = this.defaultUrl + '/create';
    public readonly checkUrl = this.defaultUrl + '/check';
    private readonly updateUrl = this.defaultUrl + '/update';
    public readonly deleteUrl = this.defaultUrl + '/delete';
    private readonly validateUrl = this.defaultUrl + '/validate';
    constructor(private http: HttpClient) {
        super();
    }

    getByFilter(param: any) {
        return this.http.post<any>(this.getUsersTypeUrl, param).toPromise();
    }
    delete(param: any): Observable<any> {
        return this.http.post<any>(this.deleteUrl, param);
    }
    check(param: any): Observable<any> {
        return this.http.post<any>(this.checkUrl, param);
    }

    validate(param: any): Observable<any> {
        return this.http.post<any>(this.validateUrl, param);
    }
    create(param: any): Observable<any> {
        return this.http.post<any>(this.createUrl, param);
    }

    update(param: any): Observable<any> {
        return this.http.post<any>(this.updateUrl, param);
    }
    getById(id: any): Observable<any> {
        const url = this.detailUrl.replace('{id}', id);
        return this.http.get<any>(url);
    }
}
export default UserTypeService