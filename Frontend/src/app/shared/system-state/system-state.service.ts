import { Injectable } from '@angular/core';
import { storageKeys } from '../utils';

@Injectable()
export class SystemStateService {
    private _isSessionExpired = false;
   
    set isSessionExpired(isSessionExpired: boolean) {
        this._isSessionExpired = isSessionExpired;
        sessionStorage.setItem('isSessionExpired', String(isSessionExpired));
    }

    get isSessionExpired() {
        const isSessionExpired = sessionStorage.getItem('isSessionExpired');
        if (isSessionExpired === 'true') {
            return true;
        } else {
            return false;
        }
    }

    set currentTimeZoneId(timeZoneId: string) {
        sessionStorage.setItem('timeZoneId', timeZoneId);
    }
    get currentTimeZoneId(): string {
        return sessionStorage.getItem('timeZoneId');
    }

    private _loggedIn = false;
    set loggedIn(login: boolean) {
        this._loggedIn = login;
        sessionStorage.setItem('loggedIn', String(login));
    }

    get loggedIn() {
        const loggedIn = sessionStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
            return true;
        } else {
            return false;
        }
    }

    private _role: string;
    set role(title: string) {
        this._role = title;
        sessionStorage.setItem('role', title);
    }

    get role() {
        const login = sessionStorage.getItem('role');
        if (login) {
            return login;
        }
        return this._role;
    }


    set menus(menus: any) {
        sessionStorage.setItem(storageKeys.menus, JSON.stringify(menus));
    }

    get menus() {
        return JSON.parse(sessionStorage.getItem(storageKeys.menus));
    }
}
