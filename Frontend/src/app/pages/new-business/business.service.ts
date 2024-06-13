import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "src/app/shared";

@Injectable()

class BusinessService extends ServiceBase {
  private readonly defaultUrl = this.apiUrlDomain + 'api/business/';
  private readonly getBusinessUrl = this.defaultUrl + 'getBusiness';
  private readonly getCustomerInfoUrl = this.defaultUrl + 'getCustomerInfo';
  private readonly createUrl = this.defaultUrl + 'create';
  constructor(private http: HttpClient) {
    super();
  }

  getPolicies(param: any) {
    return this.http.post<any>(this.getBusinessUrl, param);
  }
  getCustomerInfo(param: any) {
    return this.http.post<any>(this.getCustomerInfoUrl, param);
  }
  create(param: any): Observable<any> {
    return this.http.post<any>(this.createUrl, param);
  }
  
}
export default BusinessService
