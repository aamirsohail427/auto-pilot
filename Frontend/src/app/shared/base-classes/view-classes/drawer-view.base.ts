
import { ButtonOptions } from '../../utils/utility-classes';
import { PopupViewBase } from './popup-view.base';

export class DrawerViewBase extends PopupViewBase {
    public drawerSize = {
        small: 200,
        medium: 565,
        large: 900
    };

    public popupAnimation = {
        show: {
            type: 'slideIn',
            direction: 'right'
        },
        hide: {
            type: 'slideOut',
            direction: 'right'
        }
    };

    public popupPosition = {
        at: 'right',
        my: 'right'
    };

    constructor() {
        super();
    }

    protected getDrawerToolbarItems(
        btnCancelOptions: ButtonOptions,
        btnSaveAndNewOptions: ButtonOptions,
        btnSaveAndDoneOptions: ButtonOptions = null) {
        const items: any[] = [{
            toolbar: 'bottom',
            location: 'before',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                text: btnCancelOptions.text,
                type: 'danger',
                elementAttr: { class: 'd-round-button d-dialog-button' },
                visible: btnCancelOptions.visible,
                disabled: btnCancelOptions.disabled,
                onClick: btnCancelOptions.onClickHandler
            }
        }, {
            toolbar: 'bottom',
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                text: btnSaveAndNewOptions.text,
                type: btnSaveAndDoneOptions != null ? 'danger' : 'default',
                elementAttr: { class: 'd-round-button d-dialog-button' },
                visible: btnSaveAndNewOptions.visible,
                disabled: btnSaveAndNewOptions.disabled,
                onClick: btnSaveAndNewOptions.onClickHandler
            }
        }];

        if (btnSaveAndDoneOptions != null) {
            items.push({
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    text: btnSaveAndDoneOptions.text,
                    type: 'default',
                    visible: btnSaveAndDoneOptions.visible,
                    elementAttr: { class: 'd-round-button d-dialog-button' },
                    disabled: btnSaveAndDoneOptions.disabled,
                    onClick: btnSaveAndDoneOptions.onClickHandler
                }
            });
        }
        return items;
    }
}
