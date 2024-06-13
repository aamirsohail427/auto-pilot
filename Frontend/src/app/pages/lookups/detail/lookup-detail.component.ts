import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, DetailPopupViewBase } from 'src/app/shared';
import LookupService from '../lookup.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-lookup-detail',
  templateUrl: './lookup-detail.component.html',
  styleUrls: ['./lookup-detail.component.scss']
})
export class LookupDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmLookupDetails', { static: false }) frmLookupDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmLookupDetail: any = {};
  public rawLookupDetail: any = {};
  public currentLookupDetail: any;

  constructor(private service: LookupService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addLookup() {
    super.toggleLoadingPanel(true);
    this.initLookupDetails();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editLookup(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentLookupDetail = _.cloneDeep(entity);
    this.initLookupDetails();
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.getUserDetails();
    }
    setTimeout(() => {
      this.popupVisible = true;
    });
    super.toggleLoadingPanel(false);
  }
  private getUserDetails() {
    this.service.getById(this.currentLookupDetail.id).subscribe((response) => {
      this.currentLookupDetail = response.data;
      this.cloneRawData();
    });
  }
  private initLookupDetails() {
    this.currentLookupDetail = {
      id: 0,
      text: null,
      type: null,
      value: null
    };
  }


  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getDetailPopupToolbarItems(
      new ButtonOptions('', false, null),
      new ButtonOptions('Cancel', true, this.onBtnCancelClick, this.isDataProcessing),
      new ButtonOptions('', this.isEditMode, this.onBtnRefreshClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveAndNewClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveAndDoneClick, this.isDataProcessing)
    );
  }


  private onBtnRefreshClick = () => {
    if (this.isDataChanged()) {
      super.confirmUnsavedChanges(() => {
        if (this.validateFormData()) {
          this.save(() => {
            this.cloneRawData();
            super.showSavedSuccessMsg(false);
          });
        }
      }, () => {
        this.getUserDetails();
      });
    } else {
      this.getUserDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmLookupDetail.instance, 'title');
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

  private onBtnSaveClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(false, this.saveCallback);
    });
  }

  private onBtnSaveAndNewClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(false, () => {
        this.isEditMode = false;
        this.initPopupToolbarItems();
        this.initLookupDetails();
        this.cloneRawData();
        super.showSavedSuccessMsg(false);
      });
    });
  }

  private saveAndClose() {
    if (this.validateFormData()) {
      this.validateAndSave(true, this.saveAndDoneCallback);
    }
  }

  private onBtnSaveAndDoneClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(true, this.saveAndDoneCallback);
    });
  }

  private saveCallback = () => {
    super.showSavedSuccessMsg(false);
    this.isEditMode = true;
    this.initPopupToolbarItems();
    this.cloneRawData();
    this.currentLookupDetail = { id: this.currentLookupDetail.id };
    super.toggleLoadingPanel(false);
  }

  private setSaveButtonStatus(callbackFn: any = null) {
    this.isDataProcessing = true;
    this.initPopupToolbarItems();
    if (this.validateFormData()) {
      if (callbackFn != null) {
        callbackFn();
      }
    } else {
      this.isDataProcessing = false;
      this.initPopupToolbarItems();
    }
  }

  private saveAndDoneCallback = () => {
    this.cloneRawData();
    super.showSavedSuccessMsg(true);
  }
  private validateAndSave(isSaveAndDone, callbackFn: any = null, isRefresh: boolean = false) {
    const validateData = this.getValidateData(this.isEditMode);
    super.toggleLoadingPanel(true);
    this.service.validate(validateData).subscribe(response => {
      if (response.data.isValid) {
        this.save(callbackFn);
      } else {
        this.isDataProcessing = false;
        this.initPopupToolbarItems();
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.service.getMessageByCode('U06'));
      }
    });
  }

  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmLookupDetail)
      : this.service.create(this.frmLookupDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmLookupDetail.id = result.data.id;
      }

      this.isDataSaved = true;
      this.isDataProcessing = false;
      this.initPopupToolbarItems();
      if (callbackFn != null) {
        callbackFn();
      }
    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }

  private getValidateData(isEditMode: boolean) {
    const data: any = {
      id: this.frmLookupDetail.id
    };

    data.id = isEditMode ? this.frmLookupDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawLookupDetail = _.cloneDeep(this.frmLookupDetail);
  }
  private restoreRawData() {
    this.frmLookupDetail = _.cloneDeep(this.rawLookupDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmLookupDetail, this.rawLookupDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmLookupDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onPopupHiding(e) {
    this.popupVisible = false;
  }

}
