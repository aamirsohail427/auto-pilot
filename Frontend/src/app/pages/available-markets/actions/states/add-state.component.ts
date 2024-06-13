import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { UserProfileService } from 'src/app/shared';
import { ModalViewBase } from '../../../../shared/base-classes';
import { ButtonOptions, CustomDialogHelper } from '../../../../shared/utils';
import MessagesService from '../../../messages.service';
import * as _ from 'lodash';
import StateService from './state.service';

@Component({
  selector: 'app-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddStateComponent extends ModalViewBase implements OnInit {
  @ViewChild('frmStates', { static: false }) frmStates: DxFormComponent;
  public popupToolbarItems: any[] = [];
  public frmState: any;
  public currentState: any;
  private rawState: any;
  constructor(private service: StateService,
    private messageService: MessagesService,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
  }

  public addState() {
    this.initStateDetail();
    this.initFormData(false);
    this.cloneRawData();
  }
  public editState(entity) {
    this.currentState = entity;
    this.initFormData(true);
  }

  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    this.popupVisible = true;

  }

  private cloneRawData() {
    this.rawState = _.cloneDeep(this.frmState);
  }
  private initStateDetail() {
    this.frmState = {
      id: 0,
      name: null,
    }
  }
  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getModalToolbarItems(
      new ButtonOptions('Cancel', true, this.onBtnCancelClick),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('Save', true, this.onBtnDoneClick, this.isDataProcessing),
    );
  }
  private onBtnDoneClick = () => {
    if (this.validateFormData()) {
      this.validateAndSave(true);
    }
  }
  private onBtnCancelClick = () => {
    if (this.isDataChanged()) {
      super.confirmUnsavedChanges(() => {
        this.saveAndClose();
      }, () => {
        this.isChangesDiscarded = true;
        this.popupVisible = false;
      });
    } else {
      this.popupVisible = false;
    }
  }
  public onPopupHiding(e) {
    if (this.isChangesDiscarded) {
      return;
    }
    if (this.isDataChanged()) {
      e.cancel = true;
      super.confirmUnsavedChanges(() => {
        this.saveAndClose();
      }, () => {
        this.isChangesDiscarded = true;
        this.popupVisible = false;
      });
    }
  }

  private saveAndClose() {
    if (this.validateFormData()) {
      this.validateAndSave(true);
    }
  }
  private save() {
    const saveMethod: any = this.service.create(this.frmState);
    saveMethod.subscribe(result => {
      this.frmState.id = result.id;
      this.frmState.title = result.title;
      this.isDataSaved = true;
      this.isDataProcessing = false;
      this.cloneRawData();
      this.popupVisible = false;
    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }

  private validateAndSave(isSaveAndDone) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    const validateData = this.getValidateData(this.isEditMode);
    super.toggleLoadingPanel(true);
    this.service.validate(validateData).subscribe(response => {
      if (response.isValid) {
        this.save();
      } else {
        this.isDataProcessing = false;
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.messageService.getMessageByCode('ST01'));
      }
    });
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private getValidateData(isEditMode: boolean) {
    const data: any = {
      title: this.frmState.name
    };

    data.id = isEditMode ? this.frmState.id : 0;
    return data;
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.frmState, this.rawState)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmStates.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  @HostListener('window:resize', ['$event'])
  public onStatePopupInitialized(e) {
    if (window.innerWidth > 767) {
      this.popupWidth = 500;
      this.popupHeight = 'auto';
    }
    else {
      this.popupWidth = window.innerWidth - 15;
      this.popupHeight = 'auto';
    }
  }
}
