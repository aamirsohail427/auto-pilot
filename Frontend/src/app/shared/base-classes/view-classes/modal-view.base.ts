import { ViewChild, HostListener, Component } from '@angular/core';
import { ButtonOptions} from '../../utils';
import { DxPopupComponent } from 'devextreme-angular';
import { PopupViewBase } from './popup-view.base';
import * as $ from 'jquery';

@Component({
    template: ''
  })
export abstract class ModalViewBase extends PopupViewBase {
    @ViewChild(DxPopupComponent, { static: false }) popupComponent: DxPopupComponent;
    public maxWidth = undefined;
    constructor() {
        super();
    }

    public getMinHeight(isPagerVisiable, isExistBatchAction = false) {
        let tempMinHeight = this.minHeight;
        if (isPagerVisiable) {
            tempMinHeight = this.minHeight + 57;
        }
        if (isExistBatchAction) {
            tempMinHeight = this.minHeight + 47;
        }
        return tempMinHeight;
    }

    protected getModalToolbarItems(
        btnCancelOptions: ButtonOptions,
        btnRefreshOptions: ButtonOptions,
        btnSaveOptions: ButtonOptions,
        btnSaveAndCloseOptions: ButtonOptions = null) {
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
        },
        {
            toolbar: 'bottom',
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                text: btnRefreshOptions.text,
                type: 'danger',
                elementAttr: { class: 'd-round-button d-dialog-button' },
                visible: btnRefreshOptions.visible,
                disabled: btnRefreshOptions.disabled,
                onClick: btnRefreshOptions.onClickHandler
            }
        }, {
            toolbar: 'bottom',
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                text: btnSaveOptions.text,
                type: btnSaveAndCloseOptions != null ? 'danger' : 'default',
                elementAttr: { class: 'd-round-button d-dialog-button' },
                visible: btnSaveOptions.visible,
                disabled: btnSaveOptions.disabled,
                onClick: btnSaveOptions.onClickHandler
            }
        }];

        if (btnSaveAndCloseOptions != null) {
            items.push({
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    text: btnSaveAndCloseOptions.text,
                    type: 'default',
                    elementAttr: { class: 'd-round-button d-dialog-button' },
                    visible: btnSaveAndCloseOptions.visible,
                    disabled: btnSaveAndCloseOptions.disabled,
                    onClick: btnSaveAndCloseOptions.onClickHandler,
                    onInitialized: btnSaveAndCloseOptions.onInitializedHandler
                }
            });
        }
        return items;
    }


    @HostListener('window:resize')
    public onWindowResize(): void {
        if (this.popupComponent != null) {
            if (this.popupComponent.instance.option('width') !== '100%') {
                const width = parseInt(this.popupComponent.instance.option('width'));
                if (width >= $(document).width()) {
                    this.popupComponent.instance.option('width', '100%');
                }
            }
        }
    }
}
