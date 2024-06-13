import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { Messages, UserProfileService, userRoles, ViewBase } from '../../shared';
import MessagesService from '../messages.service';
import AppSettingService from './app.setting.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent extends ViewBase implements OnInit {
  @ViewChild('frmAppSettingDetails', { static: false }) frmAppSettingDetails: DxFormComponent;
  private defaultAgencyPhoto = './app/shared/assets/images/AgencyPhoto.png';
  public dtsAppSettings: any = {};
  public isDataProcessing = false;
  public isPhotoPreview = false;
  private fudPhoto: any = {};
  public isImageEditMode = false;
  constructor(private messageSerive: MessagesService,
    private service: AppSettingService,
    private userProfileService: UserProfileService) {
    super(null);
  }

  ngOnInit(): void {
    this.initSettings();
    this.initData();
  }

  private async initData() {
    super.toggleLoadingPanel(true);
    const param = this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId;
    await this.service.getById(param).then(response => {
      this.dtsAppSettings = response;
      this.isImageEditMode = true;
      super.toggleLoadingPanel(false);
    })
  }

  private initSettings() {
    this.dtsAppSettings = {
      id: 0,
      companyName: null,
      billingAddress: null,
      shippingAddress: null,
      severe: 0,
      moderate: 0,
      low: 0,
      userName: null,
      password: null,
      primaryEmail: null,
      Smtp: null,
      clientId: null,
      clientSecret: null,
      logoUrl:null,
      agencyId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId
    }
  }
  private initPhotoPreview() {
    if (this.fudPhoto._files) {
      this.fudPhoto.reset();
    }
    $('#preview').html('');
    this.isPhotoPreview = false;
  }
  private previewPhoto(file) {
    const reader = new FileReader();
    $('#preview').html('');
    reader.onload = ((theFile) => {
      return (e) => {
        const span = $('<span>');
        span.html(['<img class="thumb" width="150" src="', e.target.result, '" title="', '"/>'].join(''));
        $('#preview').append(span);
        const index = e.target.result.indexOf(',');
        this.dtsAppSettings.photoBase64String = e.target.result.substring(index + 1);
      };
    })(file);
    reader.readAsDataURL(file);
  }

  public onFudPhotoValueChanged(e: any) {
    this.fudPhoto = e.component;
    const files = e.value;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image')) {
        this.previewPhoto(file);
        this.isPhotoPreview = true;
        const param = new FormData();
        param.append('files', file, file.name);
        this.service.uploadFile(param, (res) => {
          this.isImageEditMode = false;
          super.togglePopupLoadingPanel(false);
          this.dtsAppSettings.logoUrl = res[0].filePath;
        });
      } else {
        super.notifyErrorMsg(this.messageSerive.getMessageByCode('U09'));
        this.onBtnDeletePhotoClick();
      }
    }
  }
  public onBtnDeletePhotoClick() {
    this.dtsAppSettings.photoPath = this.defaultAgencyPhoto;
    this.dtsAppSettings.photoBase64String = null;
    if (this.dtsAppSettings.hasOwnProperty('photoBase64String')) {
      delete this.dtsAppSettings.photoBase64String;
    }
    this.initPhotoPreview();
  }
  public onBtnSaveSettingClicked() {
    debugger;
    if (this.validateFormData()) {
      this.isDataProcessing = true;
      super.toggleLoadingPanel(true);
      this.update();
    }
  }
  private update() {
    this.service.update(this.dtsAppSettings).subscribe(response => {
      this.initData();
      this.isDataProcessing = false;
      super.notifySuccessMsg(Messages.saveSucceededMsg);
    })
  }
  private validateFormData(): boolean {
    const result: any = this.frmAppSettingDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
}
