import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { UserProfileService } from '../../../shared';
import { ListViewBase } from '../../../shared/base-classes';
import { ActionService, ButtonOptions, ComponentHelper, FormatHelper, GridListHelper } from '../../../shared/utils'
import NewBusinessService from '../business.service';
import { NewBusinessDetailComponent } from '../detail';
@Component({
  selector: 'app-new-business-list',
  templateUrl: './new-business-list.component.html',
  styleUrls: ['./new-business-list.component.scss']
})
export class NewBusinessListComponent extends ListViewBase implements OnInit {
  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdNewBusiness', { static: false }) grdNewBusiness: DxDataGridComponent;
  public addBusinessComponentRef: ComponentRef<NewBusinessDetailComponent>;
  public dtsCSR: any;
  public dtsStatus: any;
  public dtsAgents: any = [];
  public dtsBusinessLines: any;
  public dtsNewBusiness: any;
  public dtsNewBusinessLineFilter: any;
  public dtsNewBusinessAgentFilter: any;
  public dtsNewBusinessAll: any;
  public agentFilter: boolean;
  public lineFilter: any;
  public numOfNewBusiness = 0;
  constructor(private gridListHelper: GridListHelper,
    public actionService: ActionService,
    public service: NewBusinessService,
    private dateFormatHelper: FormatHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private userProfileService: UserProfileService) {
    super(actionService);
  }

  ngOnInit(): void {
    this.getPolicies();
  }

  private getPolicies() {
    var start_date = new Date();
    var end_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate() - 30 + 1, 0, 0, 0, 0);
    var current_date = start_date.getDate() - end_date.getDate();
    super.toggleLoadingPanel(true);
    const param = {
      startDate: this.dateFormatHelper.formatShortDateTime(start_date),
      endDate: this.dateFormatHelper.formatShortDateTime(end_date),
      agencyId: this.userProfileService.agencyId
    }
    this.service.getPolicies(param).subscribe(response => {
      this.dtsNewBusiness = response.policies;
      this.numOfNewBusiness = response.policies.length;
      super.toggleLoadingPanel(false);
    })
  }
  public getCustomerInfo(rowData: any) {
    this.service.getCustomerInfo(rowData.customerId).subscribe(repsone => {
    })
  }
  public onGrdNewBusinessToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      null);
  }
  private onBtnRefreshClick = () => {
    this.getPolicies();
  }
  private onBtnExportToPDFClick = () => {

  }
  public onBtnMainActionClick(entity) {
    window.open("https://app.qqcatalyst.com/Policies/Policy/Details/" + entity.policyID + "", "_blank");
  }

  public onBtnAddNewBusinessClicked() {
    this.isDataProcessing = true;
    this.showBusinessDetail(null, 'create');
  }

  private showBusinessDetail(entity, mode) {
    this.addBusinessComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, NewBusinessDetailComponent);
    const detailInstance = this.addBusinessComponentRef.instance;
    if (mode === 'create') {
      detailInstance.popupTitle = "New Business";
      detailInstance.addNewBusiness(this.dtsAgents, this.dtsCSR, this.dtsBusinessLines, this.dtsStatus);
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Business - " + entity.company
      detailInstance.editBusiness(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {

      }
      ComponentHelper.removeComponent(this.componentContainer, this.addBusinessComponentRef);
    });
  }
}
