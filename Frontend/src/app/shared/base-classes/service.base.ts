import { AppSettings } from "../utils/app-settings";


export class ServiceBase {
    public apiUrlDomain: string;
    public blobSaasUrl: string;
    public messages: any[] = [];
    public actionCodes: any = {
        view: 'View',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        archive: 'Archive',
        publish: 'Publish'
    };

    constructor() {
        this.apiUrlDomain = AppSettings.apiEndPoint;
        this.blobSaasUrl = AppSettings.blobSasUrl;
    }

    getMessageByCode(code: string): string {
        return this.messages.find(p => p.code === code).message;
    }
}
