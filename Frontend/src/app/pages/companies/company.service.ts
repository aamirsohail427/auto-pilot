import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "src/app/shared";

@Injectable()

class CompanyService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/companies';
    private readonly getCompaniesUrl = this.defaultUrl + '/getByFilter';
    private readonly companyTilesUrl = this.defaultUrl + '/getTiles';
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
        return this.http.post<any>(this.getCompaniesUrl, param).toPromise();
    }

    getTiles(param: any) {
        return this.http.post<any>(this.companyTilesUrl, param).toPromise();
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
    getById(id: any): Observable<any> {
        const url = this.detailUrl.replace('{id}', id);
        return this.http.get<any>(url);
    }
}
export default CompanyService