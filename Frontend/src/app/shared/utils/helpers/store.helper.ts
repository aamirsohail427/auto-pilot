import CustomStore from 'devextreme/data/custom_store';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { AuthenticationHelper } from './authentication.helper';
import {SystemUtility } from '../../utils/system-utility';
import * as _ from 'lodash';

export class StoreHelper {
    constructor() {
    }

    public initStore(options, filterOption = null): CustomStore {
        const defaultOptions = {
            onBeforeSend: (operation: string, ajaxSettings: JQueryAjaxSettings | any) => {
                if (filterOption !== null && filterOption !== undefined) {
                    if (ajaxSettings.data.hasOwnProperty('filter')) {
                        const filter = [];
                        filter.push(JSON.parse(ajaxSettings.data.filter));
                        filter.push('and');
                        filter.push(filterOption);
                        ajaxSettings.data.filter = JSON.stringify(filter);
                    } else {
                        ajaxSettings.data.filter = JSON.stringify(filterOption);
                    }
                }
                this.toggleLoadingPanel(true);
                if (operation === 'insert' || operation === 'update' || operation === 'delete' || (operation === 'load' && ajaxSettings.method.toUpperCase() === 'POST')) {
                    ajaxSettings.contentType = 'application/json; charset=utf-8';
                    ajaxSettings.dataType = 'json';
                    ajaxSettings.data = JSON.stringify(ajaxSettings.data);
                    ajaxSettings.xhrFields = { responseType: 'json' };
                    if ((operation === 'load' && ajaxSettings.method.toUpperCase() === 'POST')) {
                        ajaxSettings.xhrFields = { responseType: 'text' };
                    }
                    ajaxSettings.processData = true;
                  }
                return this.setAuthToken(operation, ajaxSettings);
            },
            onLoaded: (response) => {
                this.toggleLoadingPanel(false);
            }
        };
        const finalOptions = _.assign(defaultOptions, options);
        return this.getStore(finalOptions);
    }

    private getStore(options): CustomStore {
        const defaultOptions = {
            key: 'id',
            onBeforeSend: (operation: string, ajaxSettings: JQueryAjaxSettings) => {
                return this.setAuthToken(operation, ajaxSettings);
            }
        };
        const finalOptions = _.assign(defaultOptions, options);
        return createStore(finalOptions);
    }

    private setAuthToken(operation: string, ajaxSettings: JQueryAjaxSettings) {
        const token = AuthenticationHelper.getToken();
        ajaxSettings.contentType = 'application/json';
        const headers = ajaxSettings.headers ? ajaxSettings.headers : ajaxSettings.headers = {};
        headers['Authorization'] = `Bearer ${token}`;
    }

    private toggleLoadingPanel(isShown: boolean, target: any = 'body'): void {
        SystemUtility.toggleLoadingPanel(isShown, target);
    }

}
