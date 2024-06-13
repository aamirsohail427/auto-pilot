import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, SystemUtility, userRoles } from '../../shared/utils';
import { DrawerViewBase } from '../../shared/base-classes';
import MessagingService from './messaging.service';
import { UserProfileService } from 'src/app/shared';
import AppSettingService from '../app-settings/app.setting.service';
import MessagesService from '../messages.service';

@Component({
  selector: 'app-messaging-app',
  templateUrl: './messaging-app.component.html',
  styleUrls: ['./messaging-app.component.scss']
})
export class MessagingAppComponent extends DrawerViewBase implements OnInit {
  @ViewChild('frmMessagingDetails', { static: false }) frmMessagingDetails: DxFormComponent;
  @ViewChild('grdCustomerContacts', { static: false }) grdCustomerContacts: DxDataGridComponent;
  public dtsMessaging: any = {};
  public toEmails: any = [];
  public dtsCustomers: any;
  public isTemplate: boolean = false;
  public grdCustomerSelectedRowKeys: any = [];
  public popupToolbarItems: any[] = [];
  public dtsTemplates: any = [];
  public dtsTypes: any = [{
    lookupValue: 1,
    lookupText: "Custom"
  },
  {
    lookupValue: 2,
    lookupText: "Choose Template"
  }]
  constructor(
    public service: MessagingService, private messageService: MessagesService, public userProfileService: UserProfileService, public appSettingService: AppSettingService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }
  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getDrawerToolbarItems(
      new ButtonOptions('Cancel', false, null),
      new ButtonOptions('Send Message', true, this.onDoneBtnClick, this.isDataProcessing),
    );
  }
  private initMessageDetail() {
    this.dtsMessaging = {
      sendTo: [],
      subject: null,
      emailBody: null,
      templateId: 0,
      smtp: null,
      smtPassword: null,
      userId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
    }
  }
  public onContactSelectionChanged = (e) => {
    this.toEmails = e.selectedRowsData.map(row => { return { id: row.id, email: row.email } });
  }
  private onDoneBtnClick = () => {
    if (this.validateFormData()) {
      this.sendMessage();
     // this.validateSmtpSettings();
    }
  }

  private async validateSmtpSettings() {
    const param = this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId;
    await this.appSettingService.getById(param).then(response => {
      if (response.smtp !== null && response.smtpassword != null) {
        this.dtsMessaging.smtp = response.smtp;
        this.dtsMessaging.smtpassword = response.smtpassword;
        this.sendMessage();
      }
      else {
        this.showErrorMsg(this.messageService.getMessageByCode('SM01'));
        return false;
      }
    })
  }
  private sendMessage() {
    this.isDataProcessing = true;
    super.toggleLoadingPanel(true);
    this.dtsMessaging.sendTo = this.toEmails;
    this.service.sendMessage(this.dtsMessaging).then(response => {
      debugger;
      if (response === true) {
        this.isDataProcessing = false;
        super.toggleLoadingPanel(false);
        this.popupVisible = false;
      }
      else {
        super.toggleLoadingPanel(false);
        this.isDataProcessing = false;
        super.notifyErrorMsg("The SMTP server requires a secure connection or the client was not authenticated");
      }
    })
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private validateFormData(): boolean {
    const result: any = this.frmMessagingDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public showMessagingApp() {
    this.getUserContacts(() => {
      this.initMessageDetail();
      this.popupVisible = true;
    })
  }
  private async getUserContacts(callbackFn: any = null) {
    const param = {
      id: this.userProfileService.id
    }
    await this.service.getUserContactsByFilter(param).then(response => {
      this.dtsCustomers = response;
      if (callbackFn != null) {
        callbackFn();
      }
    })
  }
  public emailEditorHeight() {
    return window.innerHeight - 450;
  }
  public getUserDisplayName(rowData: any) {
    return SystemUtility.displayFullName(rowData);
  }
  public async onTypeValueChanged(e) {
    if (e.value !== e.previousValue) {

      if (e.value == 1) {
        this.isTemplate = false;
        this.dtsMessaging.templateId = 0;
      }
      else {
        if (this.dtsTemplates.length === 0) {
          super.toggleLoadingPanel(true);
          const param = {
            id: this.userProfileService.id
          }
          await this.service.getTemplatesByFilter(param).then(response => {
            this.dtsTemplates = response;
            this.isTemplate = true;
            this.dtsMessaging.emailBody = null;
            super.toggleLoadingPanel(false);
          })
        }
        else {
          this.isTemplate = true;
        }
      }
    }
  }
}
