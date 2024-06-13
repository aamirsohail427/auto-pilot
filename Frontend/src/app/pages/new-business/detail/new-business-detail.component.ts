import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, TrowserViewBase, UserProfileService } from '../../../shared';
import * as _ from 'lodash';
import BusinessService from '../business.service';

@Component({
  selector: 'app-new-business-detail',
  templateUrl: './new-business-detail.component.html'
})
export class NewBusinessDetailComponent extends TrowserViewBase implements OnInit {
  @ViewChild('frmNewBusinessDetails', { static: false }) frmNewBusinessDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmNewBusiness: any = {};
  public rawNewBusiness: any = {};
  public dtsCSR: any;
  public dtsAgents: any;
  public dtsStatus: any;
  public dtsBusinessLines: any;
  public currentBusinessDetail: any;
  public selectedBusinessType: string;
  constructor(private service: BusinessService, private userProfileService: UserProfileService) {
    super();
  }

  ngOnInit(): void {

    this.initPopupToolbarItems();
  }
  public editBusiness(entity) {
    this.isEditMode = true;
    this.currentBusinessDetail = _.cloneDeep(entity);
    this.initBusinessDetails();
    this.initFormData(true);
  }
  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }
  private async initEditors() {
    
  
    if (this.isEditMode) {
      this.getBussinessDetails( () => {
        this.cloneRawData();
      });
      this.popupVisible = true;
      super.toggleLoadingPanel(false);
    }
    else {
      this.cloneRawData();
      this.popupVisible = true;
    }
  }
  
  private async getBussinessDetails(callbackFn: any = null) {
    this.frmNewBusiness = this.currentBusinessDetail;
  }
  private cloneRawData() {
    this.rawNewBusiness = _.cloneDeep(this.frmNewBusiness);
  }
  private initBusinessDetails() {
    this.frmNewBusiness = {
      id: 0,
      companyName: null,
      customerName: null,
      businessLine: null,
      csr: null,
      agent: null,
      status: false,
 
    };
    this.selectedBusinessType = null;
  }
  public addNewBusiness(agents, csrs, lines,statusList) {
    this.popupVisible = true;
    this.dtsStatus = statusList;
    if (agents != null) {
      this.dtsAgents = Object.keys(agents).map(function (index) {
        let agent = agents[index].name;
        return agent;
      });
    }
    if (csrs != null) {
      this.dtsCSR = Object.keys(csrs).map(function (index) {
        let csr = csrs[index].name;
        return csr;
      });
    }
    if (lines != null) {
      this.dtsBusinessLines = Object.keys(lines).map(function (index) {
        let line = lines[index].name;
        return line;
      });
    }
  }

  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getTrowserToolbarItems(
      new ButtonOptions('', false, null),
      new ButtonOptions('Cancel', true, this.onBtnCancelClick, this.isDataProcessing),
      new ButtonOptions('', this.isEditMode, this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveClick, this.isDataProcessing)
    );
  }
  private onBtnSaveClick = () => {
    this.save();
  }
  private save() {
    debugger;
    this.frmNewBusiness.agencyId = this.userProfileService.agencyId;
    const saveMethod: any =  this.service.create(this.frmNewBusiness)
     
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmNewBusiness.id = result.id;
      }

      this.isDataSaved = true;
      this.isDataProcessing = false;
      this.initPopupToolbarItems();

    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }
  private onBtnCancelClick = () => {
    this.popupVisible = false;
  }
  public onPopupHiding(e) {

  }
}
