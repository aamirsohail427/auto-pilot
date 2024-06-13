import { Component, OnInit, ViewChild } from '@angular/core';
import { DxPopupComponent, DxContextMenuComponent, DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, TrowserViewBase, UserProfileService, userRoles } from '../../../shared';
import { EmailEditorComponent } from 'angular-email-editor';
import { DomSanitizer } from '@angular/platform-browser';
import EmailTemplateService from '../email-template.service';
import * as $ from "jquery";
import * as _ from 'lodash';
import MessagesService from '../../messages.service';

@Component({
  selector: 'app-email-template-detail',
  templateUrl: './email-template-detail.component.html',
  styleUrls: ['./email-template-detail.component.scss']
})
export class EmailTemplateDetailComponent extends TrowserViewBase implements OnInit {

  @ViewChild('emailTemplateDetail', { static: false }) emailTemplateDetail: DxPopupComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;
  @ViewChild('frmEmailTemplateDetail', { static: false }) frmEmailTemplateDetail: DxFormComponent;
  @ViewChild('editor') emailEditor: EmailEditorComponent;
  public templateBody: any;
  public rawTemplateData: any;
  public rawTemplateStructure: any;
  public popupToolbarItems: any = [];
  public dtsEmailTemplates: any = {};
  public rawDtsEmailTemplate: any = {};
  public currentTemplateDetail: any;
  private isDesignLoaded: boolean = false;
  public templateData = {
    'counters': {
      'u_row': 7,
      'u_column': 12,
      'u_content_text': 5,
      'u_content_image': 1,
      'u_content_button': 5,
      'u_content_divider': 2,
      'u_content_social': 1
    },
    'body': {
      'rows': [{
        'cells': [1],
        'columns': [{
          'contents': [],
          'values': {
            '_meta': {
              'htmlID': 'u_column_12',
              'htmlClassNames': 'u_column'
            },
            'border': {},
            'padding': '0px',
            'backgroundColor': ''
          }
        }],
        'values': {
          'displayCondition': null,
          'columns': false,
          'backgroundColor': '',
          'columnsBackgroundColor': '',
          'backgroundImage': {
            'url': '',
            'fullWidth': true,
            'repeat': false,
            'center': true,
            'cover': false
          },
          'padding': '0px',
          'hideDesktop': false,
          'hideMobile': false,
          'noStackMobile': false,
          '_meta': {
            'htmlID': 'u_row_7',
            'htmlClassNames': 'u_row'
          },
          'selectable': true,
          'draggable': true,
          'duplicatable': true,
          'deletable': true
        }
      }],
      'values': {
        'backgroundColor': '#ced4d9',
        'backgroundImage': {
          'url': '',
          'fullWidth': true,
          'repeat': false,
          'center': true,
          'cover': false
        },
        'contentWidth': '1400px',
        'fontFamily': {
          'label': 'Arial',
          'value': 'arial,helvetica,sans-serif'
        },
        'linkStyle': {
          'body': true,
          'linkColor': '#0000ee',
          'linkHoverColor': '#0000ee',
          'linkUnderline': true,
          'linkHoverUnderline': true
        },
        '_meta': {
          'htmlID': 'u_body',
          'htmlClassNames': 'u_body'
        }
      }
    },
    'schemaVersion': 5
  };
  public options: any = {
    mergeTags: {
      first_name: {
        name: "First Name",
        value: "{{first_name}}",
        sample: "John"
      },
      last_name: {
        name: "Last Name",
        value: "{{last_name}}",
        sample: "Doe"
      },
      email: {
        name: "Email",
        value: "{{email}}",
        sample: "autopilot@info.com"
      },
      Phone: {
        name: "Phone",
        value: "{{phone}}",
        sample: "21432141234234"
      }
    },
    features: {
      preview: false
    },
    tools: {
      social: {
        enabled: true,
        properties: {
          icons: {
            value: {
              iconType: "squared",
              icons: [
                { name: "Facebook", url: "https://facebook.com/" },
                { name: "Twitter", url: "https://twitter.com/" },
              ]
            }
          }
        }
      }
    },
    customJS: [
      'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
    ],
    customCSS: [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
    ],
  };
  constructor(private sanitizer: DomSanitizer,
    public service: EmailTemplateService,
    private messageService: MessagesService,
    private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {
    if (!this.isEditMode) {
      this.options.templateId = 14082;
    }
    this.rawTemplateData = this.templateData;
    this.rawTemplateStructure = this.templateData;
    this.initPopupToolbarItems();
  }


  public editorLoaded(e) {
    if (!this.isDesignLoaded) {
      this.emailEditor.loadDesign(this.templateData);
      this.isDesignLoaded = true;
    }
    this.emailEditor.loadDesign(this.templateData);
  }
  public addTemplate() {
    this.initTemplateDetails();
    this.cloneRawData();
    this.popupVisible = true;
  }
  public async editTemplate(entity) {
    this.isEditMode = true;
    this.initTemplateDetails();
    await this.service.getById(entity.id).then(response => {
      this.dtsEmailTemplates = response;
      this.templateData = JSON.parse(this.dtsEmailTemplates.templateStructure);
      this.rawTemplateData = this.templateData;
      if (this.isDesignLoaded) {
        this.emailEditor.loadDesign(this.templateData);
      }
      this.cloneRawData();
      this.popupVisible = true;
    });
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
        this.getTemplateDetails(this.currentTemplateDetail.id);
      });
    } else {
      this.getTemplateDetails(this.currentTemplateDetail.id);
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmEmailTemplateDetail.instance, 'title');
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
        this.initTemplateDetails();
        this.cloneRawData();
        super.showSavedSuccessMsg(false);
      });
    });
  }


  private onBtnCancelClick = () => {
    this.popupVisible = false;
  }
  private async getTemplateDetails(id) {
    await this.service.getById(id).then((response) => {
      this.dtsEmailTemplates = response;
    });
  }

  private saveCallback = () => {
    super.showSavedSuccessMsg(false);
    this.isEditMode = true;
    this.initPopupToolbarItems();
    this.cloneRawData();
    this.currentTemplateDetail = { id: this.dtsEmailTemplates.id };
    this.getTemplateDetails(this.currentTemplateDetail.id);
    super.toggleLoadingPanel(false);
  }

  private initTemplateDetails() {
    this.dtsEmailTemplates = {
      id: 0,
      templateTitle: null,
      templateSubject: null,
      sourceId: this.userProfileService.id,
    };
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

  private onBtnSaveAndDoneClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(true, this.saveAndDoneCallback);
    });
  }

  private saveAndDoneCallback = () => {
    this.cloneRawData();
    super.showSavedSuccessMsg(true);
  }

  private validateAndSave(isSaveAndDone, callbackFn: any = null, isRefresh: boolean = false) {
    super.toggleLoadingPanel(true);
    const validateData = this.getValidateData(this.isEditMode);
    this.service.validate(validateData).subscribe(response => {
      if (response.isValid) {
        this.saveEmailChanges(() => {
          this.save(callbackFn);
        });
      } else {
        this.isDataProcessing = false;
        this.initPopupToolbarItems();
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.messageService.getMessageByCode('ET01'));
      }
    });
  }
  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    if (!this.isEditMode) {
      this.dtsEmailTemplates.createdById = this.userProfileService.id;
    }
    else {
      this.dtsEmailTemplates.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.dtsEmailTemplates)
      : this.service.create(this.dtsEmailTemplates);
    saveMethod.subscribe(result => {
      this.dtsEmailTemplates.id = result.id;
      this.dtsEmailTemplates.title = result.title;
      this.isDataSaved = true;
      this.isDataProcessing = false;
      super.showSavedSuccessMsg(true);
      this.cloneRawData();
      super.toggleLoadingPanel(true);
      this.popupVisible = false;
    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }
  private cloneRawData() {
    this.rawDtsEmailTemplate = _.cloneDeep(this.dtsEmailTemplates);
    this.rawTemplateData = _.cloneDeep(this.templateData);
  }
  private saveEmailChanges(callbackFn: any = null) {
    debugger;
    this.emailEditor.exportHtml((data: any) => {
      const design: any = data.design;
      this.dtsEmailTemplates.templateStructure = JSON.stringify(design);
      this.dtsEmailTemplates.templateContent = data.html;
      if (callbackFn) {
        callbackFn();
      }
    });
  }

  private isDataChanged(): boolean {
    if (super.isEqual(this.dtsEmailTemplates, this.rawDtsEmailTemplate) && super.isEqual(this.templateData, this.rawTemplateData)) {
      return false;
    } else {
      return true;
    }
  }

  private validateFormData(): boolean {
    const result: any = this.frmEmailTemplateDetail.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  private getValidateData(isEditMode: boolean) {
    const data: any = {
      agencyId: this.userProfileService.id,
      title: this.dtsEmailTemplates.templateTitle,
    };
    data.id = isEditMode ? this.dtsEmailTemplates.id : 0;
    return data;
  }

  public onTemplateHiding(e) {
    if (this.isChangesDiscarded) {
      return;
    }
    if (this.isDataChanged()) {
      e.cancel = true;
      super.confirmUnsavedChanges(() => {
        if (this.validateFormData()) {
          this.validateAndSave(true, this.saveAndDoneCallback);
        }
      }, () => {
        this.isChangesDiscarded = true;
        this.popupVisible = false;
      });
    }
  }
}
