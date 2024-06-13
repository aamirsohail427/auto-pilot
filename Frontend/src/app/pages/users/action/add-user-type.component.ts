import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { UserProfileService } from 'src/app/shared';
import { ModalViewBase } from '../../../shared/base-classes';
import { ButtonOptions, CustomDialogHelper } from '../../../shared/utils';
import MessagesService from '../../messages.service';
import UserTypeService from '../user-type.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-user-type',
  templateUrl: './add-user-type.component.html',
  styleUrls: ['./add-user-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserTypeComponent extends ModalViewBase implements OnInit {
  @ViewChild('frmUserTypes', { static: false }) frmUserTypes: DxFormComponent;
  public popupToolbarItems: any[] = [];
  public frmUserType: any;
  public currentUserType: any;
  private rawfrmUserType: any;
  constructor(private service: UserTypeService,
    private messageService: MessagesService,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
  }

  public addUserType() {
    this.initUserTypeDetail();
    this.initFormData(false);
    this.cloneRawData();
  }
  public editUserType(entity) {
    this.currentUserType = entity;
    this.initFormData(true);
  }

  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.service.getById(this.currentUserType.id).subscribe(response => {
        this.frmUserType = response;
        this.cloneRawData();
        this.popupVisible = true;
        super.toggleLoadingPanel(false);
      })
    }
    else {
      this.popupVisible = true;
    }

  }

  private cloneRawData() {
    this.rawfrmUserType = _.cloneDeep(this.frmUserType);
  }
  private initUserTypeDetail() {
    this.frmUserType = {
      id: 0,
      title: null,
      agencyId: this.userProfileService.id,
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmUserType)
      : this.service.create(this.frmUserType);
    saveMethod.subscribe(result => {
      this.frmUserType.id = result.id;
      this.frmUserType.title = result.title;
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
        this.showErrorMsg(this.messageService.getMessageByCode('UT01'));
      }
    });
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private getValidateData(isEditMode: boolean) {
    const data: any = {
      agencyId: this.userProfileService.id,
      title: this.frmUserType.title
    };

    data.id = isEditMode ? this.frmUserType.id : 0;
    return data;
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.frmUserType, this.rawfrmUserType)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmUserTypes.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  @HostListener('window:resize', ['$event'])
  public onTypePopupInitialized(e) {
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
