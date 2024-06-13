import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, CustomDialogHelper, TrowserViewBase, UserProfileService, userRoles } from 'src/app/shared';
import * as _ from 'lodash';
import MessagesService from '../../messages.service';
import AvailableMarketService from '../available-markets.service';
import { BusinessTypeDetailComponent } from '../../business-types';
import { BusinessLineDetailComponent } from '../../business-lines';
import { CompanyDetailComponent } from '../../companies/detail';
import { AddStateComponent } from '../actions';
import BusinessLineService from '../../business-lines/business-line.service';
import BusinessTypeService from '../../business-types/business-type.service';
import CompanyService from '../../companies/company.service';


@Component({
  selector: 'app-available-market-detail',
  templateUrl: './available-market-detail.component.html',
  styleUrls: ['./available-market-detail.component.scss']
})
export class AvailableMarketDetailComponent extends TrowserViewBase implements OnInit {
  public addBusinessTypeComponentRef: ComponentRef<BusinessTypeDetailComponent>;
  public addBusinessLineComponentRef: ComponentRef<BusinessLineDetailComponent>;
  public addCompanyComponentRef: ComponentRef<CompanyDetailComponent>;
  public addStateComponentRef: ComponentRef<AddStateComponent>;
  @ViewChild('componentDetailContainer', { static: false, read: ViewContainerRef }) componentDetailContainer: ViewContainerRef;
  @ViewChild('frmMarketDetails', { static: false }) frmMarketDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmMarketDetail: any = {};
  public rawMarketDetail: any = {};
  public currentMarketDetail: any;
  public addBusinessLineOptions: any;
  public selectedBusinessLine: any;
  public isBusinessLineGridBoxOpened: boolean = false;
  public addBusinessTypeOptions: any;
  public selectedBusinessType: any;
  public isBusinessTypeGridBoxOpened: boolean = false;

  public addCompanyOptions: any;
  public selectedCompany: any;
  public isCompanyGridBoxOpened: boolean = false;
  public dtsCompanies: any;

  public addStateOptions: any;
  public selectedStates: any;
  public isStateGridBoxOpened: boolean = false;

  public dtsWirthBusiness: any[] = [{
    lookupValue: false,
    lookupText: "No"
  }, {
    lookupValue: true,
    lookupText: "Yes"
  }]
  public hasBusinessTypeAddRight = false;
  public hasBusinessLineAddRight = false;
  public hasCompanyAddRight = false;
  public hasBusinessTypeEditRight = false;
  public hasBusinessLineEditRight = false;
  public hasCompanyEditRight = false;
  public dtsBusinessLines: any[] = []
  public dtsStates: any[] = [];
  public dtsBusinessTypes: any[] = []
  constructor(private service: AvailableMarketService,
    private businessLineService: BusinessLineService,
    private bussinesTypeService: BusinessTypeService,
    private messageService: MessagesService,
    private companyService: CompanyService,
    private userProfileService: UserProfileService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageSerive: MessagesService, private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addMarket() {
    super.toggleLoadingPanel(true);
    this.initMarketDetails();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editMarket(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.initMarketDetails();
    this.currentMarketDetail = _.cloneDeep(entity);
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    const param = {
      id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
    }
    this.getStates();
    this.getBusinessTypes(param);
    this.getBusinessLines(param);
    this.getCompanies(param);
    if (this.isEditMode) {
      this.getMarketDetails();
      this.popupVisible = true;
    }
    else {
      this.popupVisible = true;
      super.toggleLoadingPanel(false);
    }
    this.btnBusinessLineCreateOptions();
    this.btnBusinessTypeCreateOptions();
    this.btnCompanyCreateOptions();
    this.btnStatesCreateOptions();
  }

  private async getBusinessTypes(param) {
    await this.bussinesTypeService.getByFilter(param).then(response => {
      this.dtsBusinessTypes = response;
      super.toggleLoadingPanel(false);
    })
  }
  private async getBusinessLines(param) {
    await this.businessLineService.getByFilter(param).then(response => {
      this.dtsBusinessLines = response;
      super.toggleLoadingPanel(false);
    })
  }
  private async getCompanies(param) {
    await this.companyService.getByFilter(param).then(response => {
      this.dtsCompanies = response;
      super.toggleLoadingPanel(false);
    })
  }
  private async getStates() {
    await this.service.getStates().then(response => {
      this.dtsStates = response;
    })
  }
  private getMarketDetails() {
    this.service.getById(this.currentMarketDetail.id).subscribe((response) => {
      this.frmMarketDetail = response;
      if (this.frmMarketDetail.line)
        this.selectedBusinessLine = this.frmMarketDetail.line;
      if (this.frmMarketDetail.type)
        this.selectedBusinessType = this.frmMarketDetail.type;
      if (this.frmMarketDetail.company)
        this.selectedCompany = this.frmMarketDetail.company;
      this.cloneRawData();
      super.toggleLoadingPanel(false);
    });
  }
  private initMarketDetails() {
    this.frmMarketDetail = {
      id: 0,
      insuranceCompanyId: null,
      businessLineId: null,
      businessTypeId: null,
      stateId: null,
      wirth: false,
      isFavorite: false,
      notes: null,
      agencyId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId
    };
    this.selectedBusinessLine = null;
    this.selectedBusinessType = null;
    this.selectedCompany = null;
    this.selectedBusinessType = null;
    this.selectedStates = null;
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
        this.getMarketDetails();
      });
    } else {
      this.getMarketDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmMarketDetail.instance, 'insuranceCompany');
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
        this.initMarketDetails();
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
    this.cloneRawData();
    this.currentMarketDetail = { id: this.frmMarketDetail.id };
    this.getMarketDetails();
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
        this.showErrorMsg(this.messageSerive.getMessageByCode('U02'));
      }
    });
  }

  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    if (!this.isEditMode) {
      this.frmMarketDetail.createdById = this.userProfileService.id;
    }
    else {
      this.frmMarketDetail.modifiedById = this.userProfileService.id;
    }
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmMarketDetail)
      : this.service.create(this.frmMarketDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmMarketDetail.id = result.id;
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
      insuranceCompanyId: this.frmMarketDetail.insuranceCompanyId,
      businessLineId: this.frmMarketDetail.businessLineId,
      businessTypeId: this.frmMarketDetail.businessTypeId,
      agencyId: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId
    };
    data.id = isEditMode ? this.frmMarketDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawMarketDetail = _.cloneDeep(this.frmMarketDetail);
  }
  private restoreRawData() {
    this.frmMarketDetail = _.cloneDeep(this.rawMarketDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmMarketDetail, this.rawMarketDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmMarketDetails.instance.validate();
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
  public btnBusinessLineCreateOptions() {
    this.addBusinessLineOptions = {
      stylingMode: 'text',
      icon: 'plus',
      visible: this.hasBusinessLineAddRight,
      disabled: this.isDataProcessing || (!this.hasEditRight && this.isEditMode),
      onClick: () => {
        this.showBusinessLineDetail(null, 'create');
      }
    };
  }

  public btnBusinessTypeCreateOptions() {
    this.addBusinessTypeOptions = {
      stylingMode: 'text',
      icon: 'plus',
      visible: this.hasBusinessTypeAddRight,
      disabled: this.isDataProcessing || (!this.hasEditRight && this.isEditMode),
      onClick: () => {
        this.showBusinessTypeDetail(null, 'create');
      }
    };
  }

  public onStatesOptionChanged(e) {
    this.selectedStates = e.lookupText;
    this.frmMarketDetail.state = e.lookupValue;
    this.isStateGridBoxOpened = false;
    this.ref.detectChanges();
  }
  public btnStatesCreateOptions() {
    this.addStateOptions = {
      stylingMode: 'text',
      icon: 'plus',
      disabled: this.isDataProcessing || (!this.hasEditRight && this.isEditMode),
      onClick: () => {
        this.showStateDetail('create', null);
      }
    };
  }
  public btnCompanyCreateOptions() {
    this.addCompanyOptions = {
      stylingMode: 'text',
      icon: 'plus',
      visible: this.hasCompanyAddRight,
      disabled: this.isDataProcessing || (!this.hasEditRight && this.isEditMode),
      onClick: () => {
        this.showCompanyDetail(null, 'create');
      }
    };
  }

  public onBusinessTypeOptionChanged(e) {
    this.selectedBusinessType = e.title;
    this.frmMarketDetail.businessTypeId = e.id;
    this.isBusinessTypeGridBoxOpened = false;
    this.ref.detectChanges();
  }
  private showBusinessTypeDetail(entity: any, mode: string) {
    this.addBusinessTypeComponentRef =

      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentDetailContainer, BusinessTypeDetailComponent);
    const actionInstance = this.addBusinessTypeComponentRef.instance;
    actionInstance.hasCreateRight = true;
    actionInstance.hasEditRight = true;
    if (mode === 'create') {
      actionInstance.popupTitle = "Business Type";
      actionInstance.addBusinessType();
    }
    if (mode === 'edit') {
      actionInstance.popupTitle = "Business Type - " + entity.title;
      actionInstance.editBusinessType(entity);
    }
    actionInstance.popupHiddenEvent.subscribe(response => {
      if (actionInstance.isDataSaved == true) {
        const param = {
          id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
        }
        this.frmMarketDetail.businessTypeId = actionInstance.frmBusinessType.id;
        this.selectedBusinessType = actionInstance.frmBusinessType.title;
        this.getBusinessTypes(param);
      }
      this.isDataProcessing = false;
      ComponentHelper.removeComponent(this.componentDetailContainer, this.addBusinessTypeComponentRef);
    });
  }

  public onBusinessLineOptionChanged(e) {
    this.selectedBusinessLine = e.title;
    this.frmMarketDetail.businessLineId = e.id;
    this.isBusinessLineGridBoxOpened = false;
    this.ref.detectChanges();
  }
  private showBusinessLineDetail(entity: any, mode: string) {
    this.addBusinessLineComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentDetailContainer, BusinessLineDetailComponent);
    const actionInstance = this.addBusinessLineComponentRef.instance;
    actionInstance.hasCreateRight = true;
    actionInstance.hasEditRight = true;
    if (mode === 'create') {
      actionInstance.popupTitle = "Business Line";
      actionInstance.addBusinessLine();
    }
    if (mode === 'edit') {
      actionInstance.popupTitle = "Business Line - " + entity.title;
      actionInstance.editBusinessLine(entity);
    }
    actionInstance.popupHiddenEvent.subscribe(response => {
      if (actionInstance.isDataSaved == true) {
        const param = {
          id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
        }
        this.frmMarketDetail.businessLineId = actionInstance.frmBusinessLine.id;
        this.selectedBusinessLine = actionInstance.frmBusinessLine.title;
        this.getBusinessLines(param);
      }
      this.isDataProcessing = false;
      ComponentHelper.removeComponent(this.componentDetailContainer, this.addBusinessLineComponentRef);
    });
  }
  public onCompanyOptionChanged(e) {
    this.selectedCompany = e.title;
    this.frmMarketDetail.insuranceCompanyId = e.id;
    this.isCompanyGridBoxOpened = false;
    this.ref.detectChanges();
  }
  private showCompanyDetail(entity: any, mode: string) {

    this.addCompanyComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentDetailContainer, CompanyDetailComponent);
    const actionInstance = this.addCompanyComponentRef.instance;
    actionInstance.hasCreateRight = true;
    actionInstance.hasEditRight = true;
    if (mode === 'create') {
      actionInstance.popupTitle = "Company";
      actionInstance.addCompany();
    }
    if (mode === 'edit') {
      actionInstance.popupTitle = "Company - " + entity.title;
      actionInstance.editCompany(entity);
    }
    actionInstance.popupHiddenEvent.subscribe(response => {
      if (actionInstance.isDataSaved == true) {
        const param = {
          id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
        }
        this.frmMarketDetail.insuranceCompanyId = actionInstance.frmCompany.id;
        this.selectedCompany = actionInstance.frmCompany.title;
        this.getCompanies(param);
      }
      this.isDataProcessing = false;
      ComponentHelper.removeComponent(this.componentDetailContainer, this.addCompanyComponentRef);
    });
  }

  private showStateDetail(mode: string, entity: any) {
    this.addStateComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentDetailContainer, AddStateComponent);
    const actionInstance = this.addStateComponentRef.instance;

    if (mode === 'create') {
      actionInstance.popupTitle = "State";
      actionInstance.addState();
    }
    actionInstance.popupHiddenEvent.subscribe(response => {
      if (actionInstance.isDataSaved == true) {
        this.getStates();
      }
      this.isDataProcessing = false;
      ComponentHelper.removeComponent(this.componentDetailContainer, this.addStateComponentRef);
    });
  }

  public onBtnComapnyEditClicked(entity) {
    this.showCompanyDetail(entity, 'edit');
  }

  public onBtnTypeEditClicked(entity) {
    this.showBusinessTypeDetail(entity, 'edit');
  }

  public onBtnLineEditClicked(entity) {
    this.showBusinessLineDetail(entity, 'edit');
  }
}
