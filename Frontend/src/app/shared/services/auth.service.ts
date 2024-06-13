import { Injectable } from '@angular/core';
import { AppSettings } from '../utils/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthInitService {
    constructor(private http: HttpClient) {
    }

    InitAuth() {
        const initAppSetting = (resolve) => {
            this.http.get('assets/app-settings.json')
                .subscribe((jsonData: any) => {
                    AppSettings.apiEndPoint = jsonData.apiEndPoint;
                    AppSettings.appCode = jsonData.appCode;
                    AppSettings.appName = jsonData.appName;
                    AppSettings.blobSasUrl = jsonData.blobSasUrl;
                    resolve();
                });
        };
        return new Promise<void>(initAppSetting);
    }
}
