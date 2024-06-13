import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { UserProfileService } from '../../../shared/system-state';
import { ModalViewBase } from '../../../shared/base-classes';
import { ButtonOptions, CustomDialogHelper, userRoles } from '../../../shared/utils';
import MessagesService from '../../messages.service';
import * as _ from 'lodash';
import BusinessTypeService from '../business-type.service';


@Component({
  selector: 'app-business-type-detail',
  templateUrl: './business-type-detail.component.html'
})
export class BusinessTypeDetailComponent extends ModalViewBase implements OnInit {

  @ViewChild('frmBusinessTypes', { static: false }) frmBusinessTypes: DxFormComponent;
  public popupToolbarItems: any[] = [];
  public frmBusinessType: any;
  public currentBusinessType: any;
  private rawBusinessType: any;
  constructor(private service: BusinessTypeService,
    private messageService: MessagesService,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
  }

  public addBusinessType() {
    this.initBusinessTypeDetail();
    this.initFormData(false);
    this.cloneRawData();
  }
  public editBusinessType(entity) {
    this.currentBusinessType = entity;
    this.initFormData(true);
  }

  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.service.getById(this.currentBusinessType.id).subscribe(response => {
        this.frmBusinessType = response;
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
    this.rawBusinessType = _.cloneDeep(this.frmBusinessType);
  }
  private initBusinessTypeDetail() {
    this.frmBusinessType = {
      id: 0,
      title: null,
      isArchived: false,
      agencyId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
    }
  }
  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getModalToolbarItems(
      new ButtonOptions('Cancel', true, this.onBtnCancelClick),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('Save', this.hasEditRight || (this.hasCreateRight && !this.isEditMode), this.onBtnDoneClick, this.isDataProcessing),
    );
  }
  private onBtnDoneClick = () => {
    if (this.validateFormData()) {
      super.toggleLoadingPanel(true);
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
      this.isDataSaved = false;
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
        this.isDataSaved = false;
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
    if (!this.isEditMode) {
      this.frmBusinessType.createdById = this.userProfileService.id;
    }
    else {
      this.frmBusinessType.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmBusinessType)
      : this.service.create(this.frmBusinessType);
    saveMethod.subscribe(result => {
      this.frmBusinessType.id = result.id;
      this.frmBusinessType.title = result.title;
      this.isDataSaved = true;
      this.isDataProcessing = false;
      super.showSavedSuccessMsg(true);
      this.cloneRawData();
      this.popupVisible = false;
      super.toggleLoadingPanel(true);
    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }

  private validateAndSave(isSaveAndDone) {
    this.isDataProcessing = true;
    const validateData = this.getValidateData(this.isEditMode);
    this.service.validate(validateData).subscribe(response => {
      if (response.isValid) {
        this.save();
      } else {
        this.isDataProcessing = false;
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.messageService.getMessageByCode('BT01'));
      }
    });
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private getValidateData(isEditMode: boolean) {
    const data: any = {
      agencyId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
      title: this.frmBusinessType.title
    };

    data.id = isEditMode ? this.frmBusinessType.id : 0;
    return data;
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.frmBusinessType, this.rawBusinessType)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmBusinessTypes.instance.validate();
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
