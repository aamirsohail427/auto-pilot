
import { ButtonOptions } from '../../utils';
import { PopupViewBase } from './popup-view.base';

export class TrowserViewBase extends PopupViewBase {
    public isEditMode = false;
    public cnmActionsVisible = false;
    public popupAnimation = {
        show: {
            type: 'slideIn',
            direction: 'top'
        },
        hide: {
            type: 'slideOut',
            direction: 'top'
        }
    };

    constructor() {
        super();
    }

    protected getTrowserToolbarItems(
        btnActionsOptions: ButtonOptions,
        btnCancelOptions: ButtonOptions,
        btnRefreshOptions: ButtonOptions,
        btnSaveOptions: ButtonOptions,
        btnSaveAndNewOptions: ButtonOptions,
        btnSaveAndDoneOptions: ButtonOptions) {
        const items: any[] = [
            {
                toolbar: 'top',
                location: 'after',
                widget: 'dxButton',
                visible: btnActionsOptions.visible,
                disabled: btnActionsOptions.disabled,
                options: {
                    type: 'default',
                    icon: 'fa fa-caret-down',
                    text: 'Actions',
                    rtlEnabled: true,
                    elementAttr: { 'id': 'btnActions' },
                    onClick: btnActionsOptions.onClickHandler === null ?
                        () => { this.cnmActionsVisible = true; } : btnActionsOptions.onClickHandler
                }
            },
            {
                toolbar: 'bottom',
                location: 'before',
                widget: 'dxButton',
                visible: btnCancelOptions.visible,
                disabled: btnCancelOptions.disabled,
                options: {
                    text: btnCancelOptions.text !== '' ?
                        btnCancelOptions.text : 'Cancel',
                    type: 'success',
                    elementAttr: { class: 'd-round-button d-trowser-button' },
                    onClick: btnCancelOptions.onClickHandler == null ? () => { this.popupVisible = false; }
                        : btnCancelOptions.onClickHandler
                }
            },
            {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                visible: btnRefreshOptions.visible,
                disabled: btnRefreshOptions.disabled,
                options: {
                    text: 'Refresh',
                    type: 'success',
                    elementAttr: { class: 'd-round-button d-trowser-button' },
                    onClick: btnRefreshOptions.onClickHandler
                }
            },
            {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                visible: btnSaveOptions.visible,
                disabled: btnSaveOptions.disabled,
                options: {
                    text: btnSaveOptions.text !== '' ? btnSaveOptions.text : 'Save',
                    type: 'success',
                    elementAttr: { class: 'd-round-button d-trowser-button' },
                    onClick: btnSaveOptions.onClickHandler
                }
            }, {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                visible: btnSaveAndNewOptions.visible,
                disabled: btnSaveAndNewOptions.disabled,
                options: {
                    type: 'default',
                    elementAttr: { class: 'd-round-button d-trowser-button' },
                    onClick: btnSaveAndNewOptions.onClickHandler,
                    text: btnSaveAndNewOptions.text !== '' ? btnSaveAndNewOptions.text : 'Save and New'
                }
            }, {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'never',
                visible: btnSaveAndDoneOptions.visible,
                disabled: btnSaveAndDoneOptions.disabled,
                options: {
                    text: btnSaveAndDoneOptions.text !== '' ?
                        btnSaveAndDoneOptions.text :
                        'Save and Done',
                    type: 'default',
                    elementAttr: { class: 'd-round-button d-trowser-button' },
                    onClick: btnSaveAndDoneOptions.onClickHandler
                }
            }
        ];

        return items;
    }
}
