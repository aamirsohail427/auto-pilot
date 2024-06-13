import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "../../shared/base-classes";

@Injectable()

class UserService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/users';
    private readonly getUsersUrl = this.defaultUrl + '/getByFilter';
    private readonly usersTilesUrl = this.defaultUrl + '/getTiles/{id}';
    private readonly detailUrl = this.defaultUrl + '/getById/{id}';
    private readonly createUrl = this.defaultUrl + '/create';
    private readonly updateUrl = this.defaultUrl + '/update';
    public readonly deleteUrl = this.defaultUrl + '/delete';
    public readonly checkUrl = this.defaultUrl + '/check';
    private readonly archiveUrl = this.defaultUrl + '/archive';
    private readonly validateUrl = this.defaultUrl + '/validate';
    constructor(private http: HttpClient) {
        super();
    }

    getByFilter(param: any) {
        return this.http.post<any>(this.getUsersUrl, param).toPromise();
    }

    getTiles(id: any) {
        const url = this.usersTilesUrl.replace('{id}', id);
        return this.http.get<any>(url).toPromise();
    }

    archive(param: any): Observable<any> {
        return this.http.post<any>(this.archiveUrl, param);
    }

    check(param: any): Observable<any> {
        return this.http.post<any>(this.checkUrl, param);
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

    update(param: any): Observable<any> {
        return this.http.post<any>(this.updateUrl, param);
    }
    getById(id: any) {
        const url = this.detailUrl.replace('{id}', id);
        return this.http.get<any>(url).toPromise();
    }
}
export default UserService