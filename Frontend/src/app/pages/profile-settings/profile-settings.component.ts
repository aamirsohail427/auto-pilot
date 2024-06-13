import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { Messages, UserProfileService, ViewBase } from '../../shared';
import MessagesService from '../messages.service';
import * as $ from 'jquery';
import UserService from '../users/user.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent extends ViewBase implements OnInit {
  @ViewChild('frmProfileSettingDetail', { static: false }) frmProfileSettingDetail: DxFormComponent;
  private defaultAgencyPhoto = './app/shared/assets/images/AgencyPhoto.png';
  public dtsProfileSetting: any = {};
  public isDataProcessing = false;
  public isPhotoPreview = false;
  private fudPhoto: any = {};
  constructor(private messageSerive: MessagesService, public userProfileService: UserProfileService,
    public service: UserService) {
    super(null);
  }


  ngOnInit(): void {
    this.initData();
  }

  private async initData() {
    super.toggleLoadingPanel(true);
    const param = this.userProfileService.id;
    await this.service.getById(param).then(response => {
      this.dtsProfileSetting = response;
      super.toggleLoadingPanel(false);
    })
  }
  public onBtnSaveSettingClicked() {
    if (this.validateFormData()) {
      this.isDataProcessing = true;
      super.toggleLoadingPanel(true);
      this.update();
    }
  }
  private update() {
    this.service.update(this.dtsProfileSetting).subscribe(response => {
      this.initData();
      this.isDataProcessing = false;
      super.notifySuccessMsg(Messages.saveSucceededMsg);
    })
  }
  private validateFormData(): boolean {
    const result: any = this.frmProfileSettingDetail.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
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
        span.html(['<img class="thumb" width="143" height="143" src="', e.target.result, '" title="', '"/>'].join(''));
        $('#preview').append(span);
        const index = e.target.result.indexOf(',');
        this.dtsProfileSetting.photoBase64String = e.target.result.substring(index + 1);
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
      } else {
        super.notifyErrorMsg(this.messageSerive.getMessageByCode('U09'));
        this.onBtnDeletePhotoClick();
      }
    }
  }
  public onBtnDeletePhotoClick() {
    this.dtsProfileSetting.photoPath = this.defaultAgencyPhoto;
    this.dtsProfileSetting.photoBase64String = null;
    if (this.dtsProfileSetting.hasOwnProperty('photoBase64String')) {
      delete this.dtsProfileSetting.photoBase64String;
    }
    this.initPhotoPreview();
  }
}
