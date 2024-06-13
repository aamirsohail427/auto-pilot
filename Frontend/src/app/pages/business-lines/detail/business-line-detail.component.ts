import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { UserProfileService } from '../../../shared/system-state';
import { ModalViewBase } from '../../../shared/base-classes';
import { ButtonOptions, CustomDialogHelper, userRoles } from '../../../shared/utils';
import MessagesService from '../../messages.service';
import * as _ from 'lodash';
import BusinessLineService from '../business-line.service';

@Component({
  selector: 'app-business-line-detail',
  templateUrl: './business-line-detail.component.html'
})
export class BusinessLineDetailComponent extends ModalViewBase implements OnInit {

  @ViewChild('frmBusinessLines', { static: false }) frmBusinessLines: DxFormComponent;
  public popupToolbarItems: any[] = [];
  public frmBusinessLine: any;
  public currentBusinessLine: any;
  private rawBusinessLine: any;
  constructor(private service: BusinessLineService,
    private messageService: MessagesService,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
  }

  public addBusinessLine() {
    this.initfrmBusinessLineDetail();
    this.initFormData(false);
    this.cloneRawData();
  }
  public editBusinessLine(entity) {
    this.currentBusinessLine = entity;
    this.initFormData(true);
  }

  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.service.getById(this.currentBusinessLine.id).subscribe(response => {
        this.frmBusinessLine = response;
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
    this.rawBusinessLine = _.cloneDeep(this.frmBusinessLine);
  }
  private initfrmBusinessLineDetail() {
    this.frmBusinessLine = {
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
      super.toggleLoadingPanel(true);
      this.validateAndSave(true);
    }
  }
  private save() {
    if (!this.isEditMode) {
      this.frmBusinessLine.createdById = this.userProfileService.id;
    }
    else {
      this.frmBusinessLine.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmBusinessLine)
      : this.service.create(this.frmBusinessLine);
    saveMethod.subscribe(result => {
      this.frmBusinessLine.id = result.id;
      this.frmBusinessLine.title = result.title;
      this.isDataSaved = true;
      this.isDataProcessing = false;
      this.cloneRawData();
      super.showSavedSuccessMsg(true);
      this.popupVisible = false;
      super.toggleLoadingPanel(false);
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
        this.showErrorMsg(this.messageService.getMessageByCode('BL01'));
      }
    });
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private getValidateData(isEditMode: boolean) {
    const data: any = {
      id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
      title: this.frmBusinessLine.title
    };

    data.id = isEditMode ? this.frmBusinessLine.id : 0;
    return data;
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.frmBusinessLine, this.rawBusinessLine)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmBusinessLines.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  @HostListener('window:resize', ['$event'])
  public onLinePopupInitialized(e) {
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
