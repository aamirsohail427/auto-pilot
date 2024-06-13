import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { Action, ActionService, ButtonOptions, ComponentHelper, CustomDialogHelper, GridListHelper, ListViewBase, UserProfileService, userRoles } from '../../../shared';
import AvailableMarketService from '../available-markets.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import MessagesService from '../../messages.service';
import { AvailableMarketDetailComponent } from '../detail';
import BusinessLineService from '../../business-lines/business-line.service';
import BusinessTypeService from '../../business-types/business-type.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-available-markets-list',
  templateUrl: './available-markets-list.component.html',
  styleUrls: ['./available-markets-list.component.scss']
})
export class AvailableMarketsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdMarkets', { static: false }) grdMarkets: DxDataGridComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addMarketComponentRef: ComponentRef<AvailableMarketDetailComponent>;
  public dtsMarkets: any[] = [];
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public grdMarketArchivedColumnVisible: boolean = false;
  public currentMarketDetail: any;
  public businessType: any = 0;
  public stateId: any = 0;
  public businessLine: any = 0;
  public btnAddMarketVisible = false;
  public dtsActions = [
    new Action("Delete", "Delete")
  ]
  public dtsStates: any[] = []
  public dtsBusinessLines: any[] = []
  public dtsBusinessTypes: any[] = []

  constructor(public gridListHelper: GridListHelper,
    private userProfileService: UserProfileService,
    private businessLineService: BusinessLineService,
    private bussinesTypeService: BusinessTypeService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: AvailableMarketService,
    private route: ActivatedRoute,
    public actionService: ActionService,
    private messageService: MessagesService) {
    super(actionService);
  }

  ngOnInit(): void {
    this.initPageData();
  }
  private initPageData = () => {
    const param = {
      id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
    }
    this.getStates();
    this.getBusinessTypes(param);
    this.getBusinessLines(param);
    this.initData(() => {
      this.initActions();
    });
  }

  public async initData(callbackFn: any = null) {
    super.toggleLoadingPanel(true);
    const param = {
      id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
      lineId: this.businessLine,
      typeId: this.businessType,
      stateId: this.stateId
    }
    await this.service.getByFilter(param).then(results => {
      this.dtsMarkets = results;
      if (callbackFn != null) {
        callbackFn();
      }
    })
  }
  private async getStates() {
    await this.service.getStates().then(response => {
      this.dtsStates = response;
    })
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
  private initActions() {
    super.getActions(this.userProfileService, this.route, () => {
      this.dtsActions.forEach(action => {
        if (action.code === 'Delete') {
          action.getVisibleStatus = this.getDeleteActionVisibleStatus;
        }
      });
      this.btnAddMarketVisible = this.hasCreateRight;
      this.cnmActions.instance.option('dataSource', this.dtsActions);
    })

  }
  private getDeleteActionVisibleStatus = (): boolean => {
    if (this.hasDeleteRight) {
      return true;
    } else {
      return false;
    }
  }
  public getTriangleVisibility = () => {
    if (this.hasDeleteRight) {
      return true;
    }
    return false;
  }
  public onBtnMoreActionsClick(entity, AnchorId) {
    this.isBatchAction = false;
    this.currentMarketDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdMarketsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdMarketsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }
  public onGrdRolesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }
  public getMainActionText() {
    return this.hasEditRight ? 'Edit' : 'View';
  }
  public onGrdMarketsToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      locateInMenu: 'auto',
      visible: true,
      showText: 'inMenu',
      template: 'statesFiltersTemplate',
    });
    e.toolbarOptions.items.unshift({
      location: 'before',
      locateInMenu: 'auto',
      visible: true,
      showText: 'inMenu',
      template: 'typeFiltersTemplate',
    });
    e.toolbarOptions.items.unshift({
      location: 'before',
      locateInMenu: 'auto',
      visible: true,
      showText: 'inMenu',
      template: 'businessFiltersTemplate',
    });


    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      null);
  }

  private onBtnRefreshClick = () => {
    this.initData();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdMarkets.instance
    }).then(() => {
      doc.save('Markets.pdf');
    })
  }

  public onCnmActionsItemClick(e) {
    if (e.itemData.code === 'Delete') {
      this.confirmDelete(this.currentMarketDetail.id);
    }
    this.cnmActionsVisible = false;
  }

  private confirmDelete(userId: any) {
    const msg = this.messageService.getMessageByCode('DC01');
    CustomDialogHelper.confirm(msg)
      .show().done((popupResult) => {
        if (popupResult) {
          this.delete();
        }
      });
  }

  private delete() {
    const param = {
      Id: this.currentMarketDetail.id
    }
    super.toggleLoadingPanel(true);
    this.service.delete(param)
      .subscribe((response) => {
        super.notifySuccessMsg("Item deleted successfully.");
        this.initPageData();
      }, err => {
        super.toggleLoadingPanel(false);
      });
  }
  public onBtnAddMarketClicked() {
    this.isDataProcessing = true;
    this.showMarketDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showMarketDetail(entity, 'edit');
  }

  private showMarketDetail(entity, mode) {
    this.addMarketComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, AvailableMarketDetailComponent);
    const detailInstance = this.addMarketComponentRef.instance;
    detailInstance.hasCreateRight = this.hasCreateRight;
    detailInstance.hasEditRight = this.hasEditRight;
    if (this.userProfileService.roleId === userRoles.agency) {
      detailInstance.hasCompanyEditRight = true;
      detailInstance.hasCompanyAddRight = true;
      detailInstance.hasBusinessTypeAddRight = true;
      detailInstance.hasBusinessTypeEditRight = true;
      detailInstance.hasBusinessLineAddRight = true;
      detailInstance.hasBusinessLineEditRight = true;
    }
    if (mode === 'create') {
      detailInstance.popupTitle = "Available Market";
      detailInstance.addMarket();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Market - " + entity.companyName;
      detailInstance.editMarket(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initPageData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addMarketComponentRef);
    });
  }

  public onBusinessLineChanged(e) {
    if (e.value !== e.previousValue && e.value !== null) {
      this.businessLine = e.value;
      this.initData();
    }
    else {
      this.businessLine = 0;
      this.initData();
    }
  }
  public onBusinessTypeChanged(e) {
    if (e.value !== e.previousValue && e.value !== null) {
      this.businessType = e.value;
      this.initData();
    }
    else {
      this.businessType = 0;
      this.initData();
    }
  }

  public onStateChanged(e) {
    if (e.value !== e.previousValue && e.value !== null) {
      this.stateId = e.value;
      this.initData();
    }
    else {
      this.stateId = 0;
      this.initData();
    }
  }
}
