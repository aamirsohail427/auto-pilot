import * as $ from 'jquery';
import 'devextreme/integration/jquery';
import * as _ from 'lodash';


export class SystemUtility {
    public static defaultPhoto = './app/shared/assets/images/photoUploadDefault.png';
    public static toggleLoadingPanel(isShow: boolean, target: any = 'body'): void {
        const instance = $('#loading').dxLoadPanel('instance');
        const hasShownPopup = $('body div').hasClass('d-con-popup');
        if (!isShow) {
            if (!hasShownPopup) {
                $('body').css({ 'overflow': 'auto' });
            }
            instance.hide();
            return;
        }
        $('body').css({ 'overflow': 'hidden' });

        const position = { of: target };
        instance.option('position', position);
        instance.show();
    }

    public static hasShownLoadingPanel() {
        return $('body div').hasClass('d-con-popup');
    }

    public static togglePureWindowLoadingPanel(isShow: boolean): void {
        const instance = $('#loading').dxLoadPanel('instance');
        if (!isShow) {
            instance.hide();
            return;
        }
        const position = { of: window };
        instance.option('position', position);
        instance.show();
    }

    public static setFormFocus(formInstance: any, fieldName: string, fieldInstance: any = null) {
        if (typeof (formInstance.getEditor(fieldName)) !== 'undefined') {
            formInstance.getEditor(fieldName).element().find('input').focus().select();
        } else if (fieldInstance != null) {
            fieldInstance.focus();
        }
    }

    public static resetFormValidation(form): void {
        if (typeof (form) !== 'undefined') {
            const items: any = form.items;
            if (typeof (items) !== 'undefined' && items.length > 0) {
                items.forEach(item => {
                    this.resetFormItemValidation(item, form);
                });
            }
        }
    }

    public static togglePopupLoadingPanel(isShown: boolean): void {
        SystemUtility.toggleLoadingPanel(isShown, '.d-con-popup > div:has(.d-con-popup-content)');
    }

    private static resetFormItemValidation(item, form) {
        if (item.itemType === 'group') {
            if (typeof (item.items) !== 'undefined' && item.items.length > 0) {
                item.items.forEach(filedItem => {
                    this.resetFormItemValidation(filedItem, form);
                });
            }
        } else {
            const editor: any = form.instance.getEditor(item.dataField);
            if (typeof (editor) !== 'undefined') {
                editor.option('isValid', true);
            }
        }
    }

    public static trimEditorValue(devComponent) {
        if (devComponent && devComponent.value) {
            devComponent.component.option('value', devComponent.value.trim());
        }
    }

    public static handleNumBoxPastedValue(eventArg: any, decimalPoint: number = 2) {
        let amount = eventArg.event.originalEvent.clipboardData.getData('text');
        if (amount) {
            amount = amount.replace(new RegExp(',', 'gm'), '');
        }
        if (!isNaN(amount)) {
            if (amount.includes('.')) {
                const decimalPoints = amount.split('.')[1].split('').reverse().join('');
                const decimalPointNum = parseInt(decimalPoints, 10).toString().split('').reverse().join('');

                amount = amount.split('.')[0] + '.' + decimalPointNum;
            }

            event.preventDefault();
            const amountData = parseFloat(amount);
            eventArg.component.option('value', _.round(amountData, decimalPoint));
        }
    }

    public static onlyAllowInteger(e: any) {
        if (e.event.keyCode === 46) {
            e.event.preventDefault();
        }
    }

    public static onlyPastedInteger(e: any, minNum?: number, maxNum?: number) {
        let amount: any = e.event.originalEvent.clipboardData.getData('text');
        if (amount) {
            amount = amount.replace(new RegExp(',', 'gm'), '');
        }
        if (!isNaN(amount)) {
            amount = parseInt(amount, 10);
            if (minNum != null && amount < minNum) {
                amount = minNum;
            }
            if (maxNum != null && amount > maxNum) {
                amount = maxNum;
            }
            event.preventDefault();
            e.component.option('value', amount);
        }
    }

    public static getSubStringWithEllipsis(str: string, start: number = 0, length: number = 100) {
        if (!str || str.length <= length) {
            return str;
        }
        return str.substring(start, length) + '...';
    }

    public static htmlEncode(str: string) {
        let s = '';
        if (str.length === 0) { return ''; }
        s = str.replace(/&/g, '&amp;');
        s = s.replace(/</g, '&lt;');
        s = s.replace(/>/g, '&gt;');
        // s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, '&#39;');
        s = s.replace(/\"/g, '&quot;');
        s = s.replace(/\n/g, '<br>');
        return s;
    }

    public static htmlDecode(str: string) {
        let s = '';
        if (str.length === 0) { return ''; }
        s = str.replace(/&amp;/g, '&');
        s = s.replace(/&lt;/g, '<');
        s = s.replace(/&gt;/g, '>');
        s = s.replace(/&nbsp;/g, ' ');
        s = s.replace(/&#39;/g, '\'');
        s = s.replace(/&quot;/g, '"');
        s = s.replace(/<br>/g, '\n');
        return s;
    }

    public static removeHtmlTag(str: string) {
        return str.replace(/<[^<>]*>(?!>)/g, '').replace(/&nbsp;/g, ' ');
    }

    public static getParams(url: string) {
        const param: any = {};
        const urlSeg = url.split('?');
        if (urlSeg.length === 2) {
            const vars = urlSeg[1].split('&');
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split('=');
                param[pair[0]] = decodeURIComponent(pair[1]);
            }
        }
        return param;
    }

    public static displayFullName(data) {
        if (data.firstName === '' || data.firstName === null) {
            return data.lastName;
        } else if (data.lastName === '' || data.lastName === null) {
            return data.firstName;
        } else {
            return [data.firstName + ' ' + data.lastName];
        }
    }

    public static getFileExtension(fileName) {
        if (fileName) {
            var i = fileName.lastIndexOf('.');
            return (i < 0) ? '' : fileName.substr(i).toLowerCase();
        }
        return '';
    }
}
