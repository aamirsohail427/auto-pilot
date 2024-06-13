import { custom, alert } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Messages } from '../messages';

export class CustomDialogHelper {
    public static confirm(message: string, title: string = 'Confirmation') {
        return custom({
            title: title,
            messageHtml: message,
            buttons: [
                { text: 'Yes', onClick: () => true },
                { text: 'No', onClick: () => false }
            ]
        });
    }

    public static confirmAsync(message: string, title: string = 'Confirmation') {
        return new Promise(resolve => {
            custom({
                title: title,
                messageHtml: message,
                buttons: [
                    { text: 'Yes', onClick: () => true },
                    { text: 'No', onClick: () => false }
                ]
            }).show().done((confirmResult) => {
                resolve(confirmResult);
            });
        });
    }

    public static unsavedChangesConfirm() {
        return custom({
            title: 'Confirmation',
            messageHtml: Messages.unsavedConfirmationMsg,
            buttons: [
                {
                    text: 'Save', onClick: () => {
                        sessionStorage.setItem('unsavedConfirmResult', 'Save');
                        return true;
                    }
                },
                {
                    text: 'Don\'t Save', onClick: () => true
                },
                { text: 'Cancel', onClick: () => false }
            ]
        });
    }

    private static notifyMsg(message: string, type: string) {
        notify({
            message: message,
            type: type,
            displayTime: 1000,
            position: { my: 'center', at: 'top', offset: '0 100' },
            animation: {
                show: { type: 'slideIn', duration: 400, direction: 'top' },
                hide: { type: 'slideOut', duration: 400, direction: 'top' }
            },
        });
    }

    public static notifySuccessMsg(message: string) {
        this.notifyMsg(message, 'success');
    }

    public static alertErrorMsg(message: string) {
        return alert(message, 'Warning');
    }

    public static alertInfoMsg(message: string) {
        return alert(message, 'Information');
    }
}
