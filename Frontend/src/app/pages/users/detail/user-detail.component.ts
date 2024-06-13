import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, CustomDialogHelper, role, TrowserViewBase, UserProfileService } from '../../../shared';
import UserService from '../user.service';
import * as _ from 'lodash';
import MessagesService from '../../messages.service';
import UserTypeService from '../user-type.service';
import { RoleDetailComponent } from '../../roles/detail';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends TrowserViewBase implements OnInit {
  @ViewChild('frmUserDetails', { static: false }) frmUserDetails: DxFormComponent;
  @ViewChild('componentDetailContainer', { static: false, read: ViewContainerRef }) componentDetailContainer: ViewContainerRef;
  public addUserTypeComponentRef: ComponentRef<RoleDetailComponent>;
  public popupToolbarItems: any[];
  public frmUserDetail: any = {};
  public rawUserDetail: any = {};
  public currentUserDetail: any;
  public isUserGridBoxOpened: boolean = false;
  public selectedUserType: string;
  public dtsUserTypes: any[] = [];
  public addUserTypesOptions: any;
  constructor(private service: UserService,
    private messageService: MessagesService,
    private userTypeService: UserTypeService,
    private userProfileService: UserProfileService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }

  public addUser() {
    super.toggleLoadingPanel(true);
    this.initUserDetails();
    this.initFormData(false);

  }

  public editUser(entity) {
    this.isEditMode = true;
    this.currentUserDetail = _.cloneDeep(entity);
    this.initUserDetails();
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private async initEditors() {
    const param = {
      id: this.userProfileService.id
    }
    this.getUserTypes(param);
    if (this.isEditMode) {
      this.getUserDetails(this.currentUserDetail.id, () => {
        this.cloneRawData();
      });
      this.popupVisible = true;
      super.toggleLoadingPanel(false);
    }
    else {
      this.cloneRawData();
      this.popupVisible = true;
    }
    this.btnCreateOptions();
  }

  private async getUserTypes(param) {
    await this.userTypeService.getByFilter(param).then(response => {
      this.dtsUserTypes = response;
      super.toggleLoadingPanel(false);
    })
  }
  private async getUserDetails(id, callbackFn: any = null) {
    await this.service.getById(id).then((response) => {
      this.frmUserDetail = response;
      if (this.frmUserDetail.password) {
        this.frmUserDetail.confirmPassword = this.frmUserDetail.password
      }
      this.selectedUserType = this.frmUserDetail.userType;
      if (callbackFn != null) {
        callbackFn();
      }
    });
  }
  private initUserDetails() {
    this.frmUserDetail = {
      id: 0,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      userType: null,
      isLoginAllow: false,
      password: null,
      confirmPassword: null,
      roleId: role.user
    };
    this.selectedUserType = null;
  }


  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getTrowserToolbarItems(
      new ButtonOptions('', false, null),
      new ButtonOptions('', true, this.onBtnCancelClick),
      new ButtonOptions('', (this.isEditMode), this.onBtnRefreshClick),
      new ButtonOptions('', this.hasEditRight || (this.hasCreateRight && !this.isEditMode), this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', this.hasEditRight || (this.hasCreateRight && !this.isEditMode), this.onBtnSaveAndNewClick, this.isDataProcessing),
      new ButtonOptions('', this.hasEditRight || (this.hasCreateRight && !this.isEditMode), this.onBtnSaveAndDoneClick, this.isDataProcessing)
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
        this.getUserDetails(this.currentUserDetail.id);
      });
    } else {
      this.getUserDetails(this.currentUserDetail.id);
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmUserDetail.instance, 'firstName');
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
        this.initUserDetails();
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
    this.currentUserDetail = { id: this.frmUserDetail.id };
    this.getUserDetails(this.currentUserDetail.id, () => {
      this.cloneRawData();
    });
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
        this.showErrorMsg(this.messageService.getMessageByCode('U01'));
      }
    });
  }

  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    if (!this.isEditMode) {
      this.frmUserDetail.createdById = this.userProfileService.id;
    }
    else {
      this.frmUserDetail.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmUserDetail)
      : this.service.create(this.frmUserDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmUserDetail.id = result.id;
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
      title: this.frmUserDetail.email
    };

    data.id = isEditMode ? this.frmUserDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawUserDetail = _.cloneDeep(this.frmUserDetail);
  }
  private restoreRawData() {
    this.frmUserDetail = _.cloneDeep(this.rawUserDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmUserDetail, this.rawUserDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmUserDetails.instance.validate();
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
    return this.frmUserDetails.instance.option("formData").password;
  };

  public onBtnEditClicked(entity) {
    this.showUserTypeDetail('edit', entity);
  }

  public onUserTypeOptionChanged(e) {
    this.selectedUserType = e.title;
    this.frmUserDetail.userTypeId = e.id;
    this.isUserGridBoxOpened = false;
    this.ref.detectChanges();
  }
  public btnCreateOptions() {
    this.addUserTypesOptions = {
      stylingMode: 'text',
      icon: 'plus',
      disabled: this.isDataProcessing || (!this.hasEditRight && this.isEditMode),
      onClick: () => {
        this.showUserTypeDetail('create', null);
      }
    };
  }

  private showUserTypeDetail(mode: string, entity: any) {
    this.addUserTypeComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentDetailContainer, RoleDetailComponent);
    const actionInstance = this.addUserTypeComponentRef.instance;

    if (mode === 'create') {
      actionInstance.popupTitle = "User Type";
      actionInstance.addUserRole();
    }
    if (mode === 'edit') {
      actionInstance.popupTitle = "User Type - " + entity.title;
      actionInstance.editUserRole(entity);
    }
    actionInstance.popupHiddenEvent.subscribe(response => {
      if (actionInstance.isDataSaved == true) {
        const param = {
          id: this.userProfileService.id
        }
        this.frmUserDetail.userTypeId = actionInstance.frmUserRole.id;
        this.selectedUserType = actionInstance.frmUserRole.title;
        this.getUserTypes(param);
      }
      this.isDataProcessing = false;
      ComponentHelper.removeComponent(this.componentDetailContainer, this.addUserTypeComponentRef);
    });
  }
}
