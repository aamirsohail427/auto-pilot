import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxButtonModule, DxFormComponent, DxFormModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { AuthenticationHelper, authStatus, LoginType, role, StorageHelper, storageKeys, SystemUtility } from '../../utils';
import { SystemStateService, UserProfileService } from '../../system-state';
import { InitSystemService } from '../../utils/init-system.service';
import { LoginDto } from './login.dto';
import { LoginManagerService } from '../../utils/login-manager.service';
import MessagesService from 'src/app/pages/messages.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginFormComponent implements OnInit {
  @ViewChild('loginForm', { static: false }) loginForm: DxFormComponent;
  @ViewChild('forgetPasswordForm', { static: false }) forgetPasswordForm: DxFormComponent;
  public isDataProcessing = false;
  public loginInfo: LoginDto = new LoginDto();
  public showLoginForm: boolean = true;
  public btnSigninText = 'Sign in';
  public isBtnSigninDisabled = false;
  public loginFailed = false;
  public isPassword = false;
  public isPasswordResult = false;
  public isLogin = true;
  public currentYear: number = new Date().getFullYear();
  public loginMsg: string;
  public email: string;
  public emailPattern: any = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  public loginPanelWidth = 550;
  public loginFailedMsg: string;
  public emailValidateFailed: any;
  public userIdValidateFailed: boolean;
  public emailValidateMsg: string;
  public userIdValidateMsg: string;

  constructor(private service: LoginManagerService,
    private router: Router,
    private storageHelper: StorageHelper,
    public userProfileService: UserProfileService,
    public initService: InitSystemService,
    public messageService: MessagesService,
    public systemStateService: SystemStateService) { }

  public ngOnInit(): void {
    this.onWindowResize();
  }

  private autologin() {
    const isRememberMeInfoCompleted = this.userProfileService.isRememberMeInfoCompleted();
    if (isRememberMeInfoCompleted) {
      this.showLoginForm = false;
      this.loginInfo.loginType = LoginType.RememberMe;
      this.loginInfo.rememberMe = this.userProfileService.isRememberMe;
      this.loginInfo.rememberMeToken = this.userProfileService.rememberMeToken;
      this.loginInfo.userId = this.storageHelper.getCookie(storageKeys.id);
      this.loadSystem(this.loginInfo);
    } else {
      this.showLoginForm = true;
    }
  }

  public onSignInBtnClick() {
    if (this.validateFormData()) {
      this.btnSigninText = 'Signing In ...';
      this.isBtnSigninDisabled = true;
      this.loginInfo.loginType = LoginType.Manual;
      SystemUtility.toggleLoadingPanel(true);
      this.loadSystem(this.loginInfo);
    }
  }
  public loadSystem(param: any) {
    this.service.login(param).subscribe(result => {
      debugger;
      if (result.status === authStatus.failed) {
        this.loginFailed = true;
        this.btnSigninText = 'Sign in';
        this.isBtnSigninDisabled = false;
        if (result.message == "notauthorized") {
          this.loginFailedMsg = "You are not authorized to access. Please call administrator for help.";
        }
        else {
          this.loginFailedMsg = "Invalid username or password.";
        }

        this.systemStateService.loggedIn = false;
        if (this.loginInfo.rememberMe) {
          this.loginInfo.rememberMe = false;
          this.userProfileService.isRememberMe = false;
        }
        SystemUtility.toggleLoadingPanel(false);
        return;
      }
      if (result.status === authStatus.success) {
        this.isDataProcessing = false;
        this.userProfileService.isRememberMe = param.rememberMe;
        this.initService.storeUserData(result.data);
        AuthenticationHelper.setToken(result.data.authToken);
        SystemUtility.toggleLoadingPanel(false);
        if (result.data.roleId === role.admin)
          this.router.navigate(['/agencies']);
        else if (result.data.roleId === role.agency)
          this.router.navigate(['/available-markets']);
        else if (result.data.roleId === role.user)
          this.router.navigate(['/users']);
        return;
      }
    })
  }
  private validateFormData(): boolean {
    const result: any = this.loginForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  onFrmFieldDataChanged(e): void {
    if (this.loginFailed && (e.dataField === 'userName' || e.dataField === 'password')) {
      this.loginFailed = false;
    }
  }

  public onFrmLoginEditorEnterKey(e) {
    this.onSignInBtnClick();
  }
  public onChangeScreenClick(type): void {
    if (type === 'password') {
      this.isLogin = false;
      this.isPassword = true;
      this.isPasswordResult = false;
      this.userIdValidateFailed = false;
      this.emailValidateFailed = false;
    }
    if (type === 'login') {
      this.isLogin = true;
      this.isPassword = false;
      this.isPasswordResult = false;
      this.userIdValidateFailed = false;
      this.loginInfo.loginId = '';
    }
    if (type === 'passwordResult') {
      const result: any = this.forgetPasswordForm.instance.validate();
      if (result.isValid) {
        this.isDataProcessing = true;
        SystemUtility.toggleLoadingPanel(true);
        this.service.validateUsername({ email: this.loginInfo.email }).subscribe(response => {
          if (response.data.isValid) {
            this.resetPassword(response.data.data);
          } else {
            this.isDataProcessing = false;
            this.userIdValidateFailed = true;
            SystemUtility.toggleLoadingPanel(false);
            this.userIdValidateMsg = this.messageService.getMessageByCode('RP01');
          }
        }, err => {
          SystemUtility.toggleLoadingPanel(false);
        });
      } else {
        result.brokenRules[0].validator.focus();
      }
    }
  }

  private resetPassword = (entity) => {
    const param = {
      id: entity.id,
      password: entity.password,
      email: entity.username
    }
    this.service.resetPassword(param).subscribe(response => {
      this.isPasswordResult = true;
      this.isLogin = false;
      this.isPassword = false;
    }, err => {
      SystemUtility.toggleLoadingPanel(false);
    }, () => {
      SystemUtility.toggleLoadingPanel(false);
    })
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth < 590) {
      this.loginPanelWidth = window.innerWidth - 40;
    } else {
      this.loginPanelWidth = 550;
    }
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent]
})
export class LoginFormModule { }
