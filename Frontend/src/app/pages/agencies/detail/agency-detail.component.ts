import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, role, TrowserViewBase, UserProfileService } from '../../../shared';
import AgencyService from '../agency.service';
import * as _ from 'lodash';
import MessagesService from '../../messages.service';

@Component({
  selector: 'app-agency-detail',
  templateUrl: './agency-detail.component.html',
  styleUrls: ['./agency-detail.component.scss']
})
export class AgencyDetailComponent extends TrowserViewBase implements OnInit {
  @ViewChild('frmAgencyDetails', { static: false }) frmAgencyDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmAgencyDetail: any = {};
  public rawAgencyDetail: any = {};
  public currentAgencyDetail: any;

  public dtsWirthBusiness: any[] = [{
    lookupValue: false,
    lookupText: "No"
  }, {
    lookupValue: true,
    lookupText: "Yes"
  }]
  constructor(private service: AgencyService, private userProfileService: UserProfileService, private messageSerive: MessagesService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addAgency() {
    super.toggleLoadingPanel(true);
    this.initAgencyDetails();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editAgency(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.initAgencyDetails();
    this.currentAgencyDetail = _.cloneDeep(entity);
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.getAgencyDetails();
    }
    else {
      this.popupVisible = true;
      super.toggleLoadingPanel(false);
    }
  }
  private getAgencyDetails() {
    this.service.getById(this.currentAgencyDetail.id).subscribe((response) => {
      this.frmAgencyDetail = response;
      if (this.frmAgencyDetail.password) {
        this.frmAgencyDetail.confirmPassword = this.frmAgencyDetail.password
      }
      this.cloneRawData();
      this.popupVisible = true;
      super.toggleLoadingPanel(false);
    });
  }
  private initAgencyDetails() {
    this.frmAgencyDetail = {
      id: 0,
      firstName: null,
      email: null,
      phone: null,
      roleId: role.agency,
      password: null,
      isLoginAllow: false,
      photoPath: null,
      photoBase64String: null,
      confirmPassword: null
    };
  }

  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getTrowserToolbarItems(
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
        this.getAgencyDetails();
      });
    } else {
      this.getAgencyDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmAgencyDetail.instance, 'firstName');
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
        this.initAgencyDetails();
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
    this.currentAgencyDetail = { id: this.frmAgencyDetail.id };
    this.getAgencyDetails();
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
      if (response.isValid) {
        this.save(callbackFn);
      } else {
        this.isDataProcessing = false;
        this.initPopupToolbarItems();
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.messageSerive.getMessageByCode('U01'));
      }
    });
  }

  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    if (!this.isEditMode) {
      this.frmAgencyDetail.createdById = this.userProfileService.id;
    }
    else {
      this.frmAgencyDetail.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmAgencyDetail)
      : this.service.create(this.frmAgencyDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmAgencyDetail.id = result.id;
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
      title: this.frmAgencyDetail.email
    };

    data.id = isEditMode ? this.frmAgencyDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawAgencyDetail = _.cloneDeep(this.frmAgencyDetail);
  }
  private restoreRawData() {
    this.frmAgencyDetail = _.cloneDeep(this.rawAgencyDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmAgencyDetail, this.rawAgencyDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmAgencyDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
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
  public comparePassword = () => {
    return this.frmAgencyDetails.instance.option("formData").password;
  };
}
