import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServiceBase } from "../../shared/base-classes";

@Injectable()
class MessagingService extends ServiceBase {

    private readonly defaultUrl = this.apiUrlDomain + 'api/messages';
    public readonly userContactsUrl = this.defaultUrl + '/getCustomerContacts';
    public readonly emailTemplatesUrl = this.defaultUrl + '/getTemplates';
    public readonly sendMessageUrl = this.defaultUrl + '/sendMessage';
    constructor(private http: HttpClient) {
        super();
    }

    getUserContactsByFilter(params: any) {
        return this.http.post<any>(this.userContactsUrl, params).toPromise();
    }

    getTemplatesByFilter(params: any) {
        return this.http.post<any>(this.emailTemplatesUrl, params).toPromise();
    }
    sendMessage(params: any) {
        return this.http.post<any>(this.sendMessageUrl, params).toPromise();
    }
}

export default MessagingService;