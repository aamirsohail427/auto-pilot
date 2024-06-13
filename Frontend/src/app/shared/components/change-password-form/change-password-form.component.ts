import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DxPopupModule, DxTextBoxModule, DxButtonModule, DxFormComponent, DxFormModule, DxLoadIndicatorModule } from 'devextreme-angular';
import MessagesService from 'src/app/pages/messages.service';
import { ModalViewBase } from '../../base-classes';
import { UserProfileService } from '../../system-state';
import { ButtonOptions, CustomDialogHelper } from '../../utils';
import { LoginManagerService } from '../../utils/login-manager.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-change-passsword-form',
  templateUrl: './change-password-form.component.html'
})

export class ChangePasswordComponent extends ModalViewBase implements OnInit {
  @ViewChild('frmChangePassword', { static: false }) frmChangePassword: DxFormComponent;
  public dtsChangePassword: any = {};
  public currentPassword: boolean = true;
  public nextPassword: boolean = false;
  public popupToolbarItems: any[] = [];
  public rawChangePassword: any;
  constructor(private service: LoginManagerService,
    private userProfileService: UserProfileService,
    private messageService: MessagesService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }

  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getModalToolbarItems(
      new ButtonOptions('Cancel', true, this.onBtnCancelClick),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('Next', this.currentPassword, this.onBtnNextClick, this.isDataProcessing),
      new ButtonOptions('Done', this.nextPassword, this.onBtnDoneClick, this.isDataProcessing),
    );
  }

  private onBtnNextClick = () => {
    if (this.validatePasswordForm()) {
      this.validatePassword();
    }
  }

  private onBtnDoneClick = () => {
    if (this.validatePasswordForm()) {
      this.changePassword();
    }

  }

  private onBtnCancelClick = () => {
    this.popupVisible = false;
  }

  public onPopupHiding(e) {
    this.popupVisible = false;
  }

  private validatePasswordForm() {
    const result: any = this.frmChangePassword.instance.validate();
    if (result.isValid) {
      return true;
    } else {
      result.brokenRules[0].validator.focus();
      return false;
    }
  }
  public comparePassword = () => {
    return this.frmChangePassword.instance.option("formData").newPassword;
  };

  private validatePassword() {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    const params = {
      id: this.userProfileService.id,
      oldPassword: this.dtsChangePassword.oldPassword
    }
    this.service.validatePassword(params).subscribe(response => {
      if (response.data.isValid) {
        this.currentPassword = false;
        this.nextPassword = true;
        this.isDataProcessing = false;
        this.dtsChangePassword = {
          newPassword: null,
          confirmPassword: null,
        }
        this.rawChangePassword = _.clone(this.dtsChangePassword);
        this.initPopupToolbarItems();

      }
      else {
        this.isDataProcessing = false;
        CustomDialogHelper.alertErrorMsg(this.messageService.getMessageByCode('CP01'));
      }
      super.toggleLoadingPanel(false);

    });
  }
  public showPassword() {
    this.popupVisible = true;
    this.rawChangePassword = _.clone(this.dtsChangePassword);
  }

  private changePassword() {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    const params = {
      id: this.userProfileService.id,
      newPassword: this.dtsChangePassword.newPassword
    }
    this.service.changePassword(params).subscribe(response => {
      if (response.data.isValid) {
        this.rawChangePassword = this.dtsChangePassword;
        this.popupVisible = false;
        super.toggleLoadingPanel(false);
        this.isDataProcessing = false;
        super.showSavedSuccessMsg(true);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  public onPasswordPopupInitialized(e) {
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


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxPopupModule,
    DxButtonModule,
    DxTextBoxModule,
    DxLoadIndicatorModule
  ],
  declarations: [ChangePasswordComponent],
  exports: [ChangePasswordComponent]
})
export class ChangePasswordFormModule { }
