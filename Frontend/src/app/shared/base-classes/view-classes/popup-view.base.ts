import { Output, EventEmitter, Component } from '@angular/core';
import * as $ from 'jquery';
import { ViewBase } from './view.base';
import { SystemUtility } from '../../utils/system-utility';
import { Messages } from '../../utils/messages';

@Component({
    template: ''
  })


export abstract class PopupViewBase extends ViewBase {
    @Output() popupHiddenEvent = new EventEmitter<any>();
    @Output() savedEvent = new EventEmitter<any>();
    @Output() deleteEvent = new EventEmitter<any>();

    public popupTitle;
    public isEditMode = false;
    public isViewMode = false;
    public isDataSaved = false;
    public popupVisible = false;
    public minWidth = 515;
    public minHeight = 253;
    protected isChangesDiscarded = false;

    constructor() {
        super(null);
    }


    protected emitSavedEvent() {
        this.savedEvent.emit();
    }

    public onPopupHidden(e) {
        this.setScrollDisplayStatus();
        this.popupHiddenEvent.emit();
    }

    protected showSavedSuccessMsg(closeTrowser: boolean): void {
        super.notifySuccessMsg(Messages.saveSucceededMsg);
        if (closeTrowser) {
            this.popupVisible = false;
        }
    }

    protected getPopupContentHeight(e: any, reducedHeight: number): number {
        const minHeight = e.component.option('minHeight');
        let height = minHeight;
        if (typeof (e.actionValue) === 'undefined' || e.actionValue.length === 0) {
            height = (e.component.option('height') < minHeight ? minHeight : e.component.option('height'));
        } else {
            height = (e.actionValue[0].height < minHeight ? minHeight : e.actionValue[0].height);
        }
        return height - reducedHeight;
    }

    protected setListHeight(e: any, listInstances: any[], reducedHeight: number): void {
        const height = this.getPopupContentHeight(e, reducedHeight);
        if (listInstances.length === 1) {
            listInstances[0].option('elementAttr', { 'style': 'max-height:' + height + 'px;' });
            setTimeout(() => {
                listInstances[0].updateDimensions();
            }, 500);
        } else {
            listInstances.forEach((listInstance, index) => {
                listInstance.option('elementAttr', { 'style': 'max-height:' + height / listInstances.length + 'px;' });
                setTimeout(() => {
                    listInstance.updateDimensions();
                }, 500);
            });
        }
    }

    protected setScrollDisplayStatus() {
        const hasShownPopup = $('body div').hasClass('d-con-popup');
        hasShownPopup ? $('body').css({ 'overflow': 'hidden' }) : $('body').css({ 'overflow': 'auto' });
    }

    protected setFormFocus(formInstance: any, fieldName: string, filedInstance: any = null) {
        SystemUtility.setFormFocus(formInstance, fieldName, filedInstance);
    }

    protected resetFormValidation(form: any) {
        SystemUtility.resetFormValidation(form);
    }

    protected orderByAlias(dataSource: any[]) {
        dataSource.sort((a, b) => {
            const numa = Number(a.alias.replace('S', ''));
            const numb = Number(b.alias.replace('S', ''));
            return numa - numb;
        });
    }
}
