import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, Messages, ModalViewBase, TreeListHelper, UserProfileService } from 'src/app/shared';
import MessagesService from '../../messages.service';
import RoleService from '../role.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html'
})
export class RoleDetailComponent extends ModalViewBase implements OnInit {
  @ViewChild('roleMenus', { static: false }) roleMenus: DxDataGridComponent;
  @ViewChild('frmUserRoles', { static: false }) frmUserRoles: DxFormComponent;
  public popupToolbarItems: any[] = [];
  public frmUserRole: any = {};
  public currentUserRole: any = {};
  private rawfrmUserRole: any;
  public dtsMenus: any;
  public selectedRoleRowKeys: any = [];
  public allowViewRight = true;
  constructor(private service: RoleService,
    private messageService: MessagesService,
    private treeListHelper: TreeListHelper,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
  }

  public addUserRole() {
    super.toggleLoadingPanel(true);
    this.initUserRoleDetail();
    this.initFormData(false);
    this.cloneRawData();
  }
  public editUserRole(entity) {
    super.toggleLoadingPanel(true);
    this.currentUserRole = entity;
    this.initUserRoleDetail();
    this.initFormData(true);
    this.cloneRawData();
  }

  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    debugger;
    if (this.isEditMode) {
      this.service.getById(this.currentUserRole.id).subscribe(response => {
        this.frmUserRole = response;
        this.getUserTypeMenus(this.currentUserRole.id, () => {
          this.cloneRawData();
          this.popupVisible = true;
          super.toggleLoadingPanel(false);
        });
      })
    }
    else {
      this.getRoleMenus(() => {
        this.cloneRawData();
      })
      this.popupVisible = true;
    }

  }

  private async getRoleMenus(callbackFn: any = null) {
    await this.service.getRoleMenus().then(response => {
      this.frmUserRole.permissions = response;
      super.toggleLoadingPanel(false);
      if (callbackFn != null) {
        callbackFn();
      }
    })
  }
  private async getUserTypeMenus(id, callbackFn: any = null) {
    const param = {
      id: id
    }
    await this.service.getUserTypeMenus(param).then(response => {
      this.frmUserRole.permissions = response;
      super.toggleLoadingPanel(false);
      if (callbackFn != null) {
        callbackFn();
      }
    })
  }

  private cloneRawData() {
    this.rawfrmUserRole = _.cloneDeep(this.frmUserRole);
  }
  private initUserRoleDetail() {
    this.frmUserRole = {
      id: 0,
      title: null,
      agencyId: this.userProfileService.id,
      createdById: this.userProfileService.id,
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmUserRole)
      : this.service.create(this.frmUserRole);
    saveMethod.subscribe(result => {
      this.frmUserRole.id = result.id;
      this.frmUserRole.title = result.title;
      this.isDataSaved = true;
      this.isDataProcessing = false;
      super.notifySuccessMsg(Messages.saveSucceededMsg);
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
      title: this.frmUserRole.title
    };

    data.id = isEditMode ? this.frmUserRole.id : 0;
    return data;
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.frmUserRole, this.rawfrmUserRole)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmUserRoles.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onRoleRowUpdating(e) {
    if (e.newData.hasEditRight === true) {
      e.key.hasViewRight = false;
    }
    if (e.newData.hasViewRight === true) {
      e.key.hasEditRight = false;
    }
  }

  public onGrdRolesCellPrepared(e) {
    if (e.rowType === 'header' || e.rowType === 'data') {
      if (e.column.dataField === 'title') {
        e.cellElement.css({ 'text-align': 'left', 'text-transform': 'uppercase' });
      }
      else {
        e.cellElement.css('text-align', 'center');
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  public onRolePopupInitialized(e) {
    if (window.innerWidth > 767 && window.innerWidth < 991) {
      this.popupWidth = 500;
      this.popupHeight = 'auto';
    }
    else if (window.innerWidth > 991) {
      this.popupWidth = 800;
      this.popupHeight = 'auto';
    }
    else {
      this.popupWidth = window.innerWidth - 15;
      this.popupHeight = 'auto';
    }
  }
}
