import { Component, NgModule, Input, Output, EventEmitter, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule, DxToolbarModule } from 'devextreme-angular';
import { ChangePasswordComponent } from '../change-password-form/change-password-form.component';
import { SystemStateService, UserProfileService } from '../../system-state';
import { ComponentHelper, CustomDialogHelper } from '../../utils/helpers';
import { MessagingAppComponent } from '../../../pages/messaging';
import { Router } from '@angular/router';
import { userRoles } from '../..';
import { AppSettings } from '../../utils/app-settings';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  public addChangePasswordComponentRef: ComponentRef<ChangePasswordComponent>;
  public addSendMessageComponentRef: ComponentRef<MessagingAppComponent>;
  public isDataProcessing = false;
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title: string;

  user = { email: '' };

  userMenuItems = [
    {
      text: 'Change Password',
      icon: 'bx bx-lock-alt',
      onClick: () => {
        this.showPasswordDetail();
      }
    },
    {
      text: 'Profile Settings',
      icon: 'user',
      visible: this.getProfileVisible(),
      onClick: () => {
        this.router.navigate(['/profile-settings']);
      }
    },
    {
      text: 'Logout',
      icon: 'arrowright',
      onClick: () => {
        this.logout();
      }
    }];

  constructor(private router: Router, private componentFactoryResolver: ComponentFactoryResolver, public userProfileService: UserProfileService, public systemStateService: SystemStateService) { }

  ngOnInit() {

  }
  toggleMenu = () => {
    this.menuToggle.emit();
  }
  private getProfileVisible() {
    if (this.userProfileService.roleId === userRoles.user) {
      return true;
    }
    return false;
  }
  private logout() {
    CustomDialogHelper.confirm('Do you want to sign out?')
      .show().done((popupReuslt) => {
        if (popupReuslt) {
          this.userProfileService.logout();
        }
      });
  }

  public onSendMessageBusttonClick() {
    this.isDataProcessing = true;
    this.showMessagingAppDetail();
  }
  public showPasswordDetail = () => {
    this.addChangePasswordComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, ChangePasswordComponent);
    const detailInstance = this.addChangePasswordComponentRef.instance;
    detailInstance.popupTitle = "Change Password";
    detailInstance.showPassword();
    detailInstance.popupHiddenEvent.subscribe(response => {
      detailInstance.popupVisible = false;
      ComponentHelper.removeComponent(this.componentContainer, this.addChangePasswordComponentRef);
    });
  }

  public showMessagingAppDetail = () => {
    this.addSendMessageComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, MessagingAppComponent);
    const detailInstance = this.addSendMessageComponentRef.instance;
    detailInstance.popupTitle = "Send Message";
    detailInstance.showMessagingApp();
    detailInstance.popupHiddenEvent.subscribe(response => {
      detailInstance.popupVisible = false;
      this.isDataProcessing = false;
      ComponentHelper.removeComponent(this.componentContainer, this.addSendMessageComponentRef);
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }
