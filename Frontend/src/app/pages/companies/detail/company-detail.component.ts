import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, ModalViewBase, UserProfileService, userRoles } from 'src/app/shared';
import MessagesService from '../../messages.service';
import CompanyService from '../company.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent extends ModalViewBase implements OnInit {

  @ViewChild('fromCompanies', { static: false }) fromCompanies: DxFormComponent;
  public popupToolbarItems: any[] = [];
  public frmCompany: any;
  public currentCompany: any;
  private rawCompany: any;
  constructor(private service: CompanyService,
    private messageService: MessagesService,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
  }

  public addCompany() {
    this.initfrmCompanyDetail();
    this.initFormData(false);
    this.cloneRawData();
  }
  public editCompany(entity) {
    this.currentCompany = entity;
    this.initFormData(true);
  }

  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.service.getById(this.currentCompany.id).subscribe(response => {
        this.frmCompany = response;
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
    this.rawCompany = _.cloneDeep(this.frmCompany);
  }
  private initfrmCompanyDetail() {
    this.frmCompany = {
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
      super.toggleLoadingPanel(true);
      this.validateAndSave(true);
    }
  }
  private save() {
    if (!this.isEditMode) {
      this.frmCompany.createdById = this.userProfileService.id;
    }
    else {
      this.frmCompany.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmCompany)
      : this.service.create(this.frmCompany);
    saveMethod.subscribe(result => {
      this.frmCompany.id = result.id;
      this.frmCompany.title = result.title;
      this.isDataSaved = true;
      this.isDataProcessing = false;
      super.showSavedSuccessMsg(true);
      this.cloneRawData();
      this.popupVisible = false;
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
        this.showErrorMsg(this.messageService.getMessageByCode('AC01'));
      }
    });
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private getValidateData(isEditMode: boolean) {
    const data: any = {
      agencyId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
      title: this.frmCompany.title
    };

    data.id = isEditMode ? this.frmCompany.id : 0;
    return data;
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.frmCompany, this.rawCompany)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.fromCompanies.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  @HostListener('window:resize', ['$event'])
  public onCompanyPopupInitialized(e) {
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
