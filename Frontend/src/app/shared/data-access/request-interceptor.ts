import { Injectable, Injector } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
    HttpEvent, HttpInterceptor,
    HttpHandler, HttpRequest,
    HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import { CustomDialogHelper, AuthenticationHelper, SystemUtility, StorageHelper, customRequestHeaders, FormatHelper } from '../utils';
import { SystemStateService } from '../system-state';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    cookieService: CookieService;
    storageHelper: StorageHelper;
    isTimedOut = false;
    constructor(private router: Router,
        private injector: Injector,
        private systemStateService: SystemStateService,
        private formatHelper: FormatHelper) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.has(customRequestHeaders.interceptorSkipHeader)) {
            const headers = req.headers.delete(customRequestHeaders.interceptorSkipHeader);
            return next.handle(req.clone({ headers }));
        }

        this.cookieService = this.injector.get(CookieService);
        this.storageHelper = this.injector.get(StorageHelper);
        const token = AuthenticationHelper.getToken();
        const authToken = 'Bearer ' + token;
        const authReq = req.clone({
            headers: req.headers.set('Content-Type', 'application/json')
                .set('Authorization', authToken)
                .set(customRequestHeaders.localDate, this.formatHelper.formatDate(new Date(), 'MM/dd/yyyy hh:mm:ss a'))
        });
        const domain = this.storageHelper.getRootDomain();
        return next.handle(authReq)
            .do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    return event.body;
                }
            }, (err: any) => {
                if (err.status === 401) {
                    if (!this.isTimedOut) {
                        this.isTimedOut = true;
                        CustomDialogHelper.alertInfoMsg('Your session has timed out, please login again.').done((popupResult) => {
                            localStorage.clear();
                            sessionStorage.clear();
                            this.cookieService.deleteAll('/', domain);
                            this.router.navigate(['/login']);
                        });
                    }
                } else {
                    if (err instanceof HttpErrorResponse) {
                        const errorMsgPrefix = 'Following error occurred. Please call administrator for help.<br/><br/>';
                        let errorMessage = '';
                        if (err.status === 0) {
                            errorMessage = 'The URL is unreachable.';
                        } else if (err.error) {
                            const innerExceptionMsg = this.getInnerException(err.error);
                            errorMessage = innerExceptionMsg;
                        } else {
                            errorMessage = err.message;
                        }
                        const msg = errorMsgPrefix + errorMessage;
                        CustomDialogHelper.alertErrorMsg(msg).then(() => {
                            SystemUtility.toggleLoadingPanel(false);
                        });
                    }
                }
            }, () => {
            }).shareReplay();
    }

    private getInnerException = (obj) => {
        if (obj.innerException) {
            return this.getInnerException(obj.innerException);
        }
        return obj.exceptionMessage ? obj.exceptionMessage : obj.message;
    }
}
