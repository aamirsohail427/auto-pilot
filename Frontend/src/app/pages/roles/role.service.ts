import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "src/app/shared";

@Injectable()

class RoleService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/userTypes';
    private readonly getUsersTypeUrl = this.defaultUrl + '/getByFilter';
    private readonly detailUrl = this.defaultUrl + '/getById/{id}';
    private readonly createUrl = this.defaultUrl + '/create';
    private readonly updateUrl = this.defaultUrl + '/update';
    public readonly checkUrl = this.defaultUrl + '/check';
    public readonly deleteUrl = this.defaultUrl + '/delete';
    private readonly validateUrl = this.defaultUrl + '/validate';
    private readonly getRoleMenusUrl = this.defaultUrl + '/getRoleMenus';
    private readonly getUserTypeMenusUrl = this.defaultUrl + '/getUserTypeMenus';
    constructor(private http: HttpClient) {
        super();
    }

    getByFilter(param: any) {
        return this.http.post<any>(this.getUsersTypeUrl, param).toPromise();
    }
    delete(param: any): Observable<any> {
        return this.http.post<any>(this.deleteUrl, param);
    }
    validate(param: any): Observable<any> {
        return this.http.post<any>(this.validateUrl, param);
    }
    create(param: any): Observable<any> {
        return this.http.post<any>(this.createUrl, param);
    }
    check(param: any): Observable<any> {
        return this.http.post<any>(this.checkUrl, param);
    }
    update(param: any): Observable<any> {
        return this.http.post<any>(this.updateUrl, param);
    }
    getUserTypeMenus(param: any) {
        return this.http.post<any>(this.getUserTypeMenusUrl, param).toPromise();
    }
    getById(id: any): Observable<any> {
        const url = this.detailUrl.replace('{id}', id);
        return this.http.get<any>(url);
    }
    getRoleMenus() {
        return this.http.get<any>(this.getRoleMenusUrl).toPromise();
    }
}
export default RoleService