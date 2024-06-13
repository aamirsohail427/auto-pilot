import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationHelper, ServiceBase } from "src/app/shared";
import * as $ from 'jquery';

@Injectable()

class AppSettingService extends ServiceBase {
    private readonly defaultUrl = this.apiUrlDomain + 'api/appSettings';
    private readonly detailUrl = this.defaultUrl + '/getById/{id}';
    private readonly updateUrl = this.defaultUrl + '/update';
    private readonly uploadLogoUrl = this.defaultUrl + '/uploadLogo';
    constructor(private http: HttpClient) {
        super();
    }

    update(param: any): Observable<any> {
        return this.http.post<any>(this.updateUrl, param);
    }
    getById(id: any) {
        const url = this.detailUrl.replace('{id}', id);
        return this.http.get<any>(url).toPromise();
    }
    uploadFile(param: any, callbackFn: any = null) {
        const token = AuthenticationHelper.getToken();
        const authToken = 'Bearer ' + token;
        $.ajax({
          type: 'post',
          url: this.uploadLogoUrl,
          data: param,
          headers: { 'Authorization': authToken },
          cache: false,
          processData: false,
          contentType: false,
          complete: function (re) {
            if (callbackFn !== null) {
              callbackFn(re.responseJSON);
            }
          }
        });
      }
}
export default AppSettingService