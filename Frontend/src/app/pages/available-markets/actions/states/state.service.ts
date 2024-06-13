import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "../../.././../shared/base-classes";

@Injectable()

class StateService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/markets';
    private readonly createUrl = this.defaultUrl + '/createState';
    private readonly validateUrl = this.defaultUrl + '/validateState';
    constructor(private http: HttpClient) {
        super();
    }


    validate(param: any): Observable<any> {
        return this.http.post<any>(this.validateUrl, param);
    }
    create(param: any): Observable<any> {
        return this.http.post<any>(this.createUrl, param);
    }
}
export default StateService