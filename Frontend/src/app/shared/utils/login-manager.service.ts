import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceBase } from '../base-classes';
import { SystemStateService } from '../system-state';

const defaultPath = '/';

@Injectable()
export class LoginManagerService extends ServiceBase {
  private readonly defaultUrl = this.apiUrlDomain + 'api/auths';
  private readonly loginUrl = this.defaultUrl + '/login';
  private readonly validatePasswordUrl = this.defaultUrl + '/validatePassword';
  private readonly changePasswordUrl = this.defaultUrl + '/changePassword';
  private readonly validateUsernameUrl = this.defaultUrl + '/validateUsername';
  private readonly resetPasswordUrl = this.defaultUrl + '/resetPassword';
  public isLogin: any;
  get loggedIn() {
    this.isLogin = this.systemStateService.loggedIn;
    if (this.isLogin === true)
      return true;
    return false;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(
    private http: HttpClient, private systemStateService: SystemStateService) {
    super();
  }

  public login(param: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, param);
  }
  validateUsername(param: any): Observable<any> {
    return this.http.post<any>(this.validateUsernameUrl, param);
  }

  resetPassword(param: any): Observable<any> {
    return this.http.post<any>(this.resetPasswordUrl, param);
  }

  changePassword(password: any): Observable<any> {
    return this.http.post<any>(this.changePasswordUrl, password);
  }

  validatePassword(password: any): Observable<any> {
    return this.http.post<any>(this.validatePasswordUrl, password);
  }
}


