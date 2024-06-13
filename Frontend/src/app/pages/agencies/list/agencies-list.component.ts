import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { Action, ButtonOptions, ComponentHelper, CustomDialogHelper, GridListHelper, ListViewBase } from '../../../shared';
import { AgencyDetailComponent } from '../detail';
import AgencyService from '../agency.service';
import { activeStates, DropDownListOptions } from '../../../shared';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import MessagesService from '../../messages.service';

@Component({
  selector: 'app-agencies-list',
  templateUrl: './agencies-list.component.html',
  styleUrls: ['./agencies-list.component.scss']
})
export class AgenciesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdAgencies', { static: false }) grdAgencies: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addAgencyComponentRef: ComponentRef<AgencyDetailComponent>;
  public dtsAgencies: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public grdAgenciesSelectedRowKeys: any[] = [];
  public grdAgencyArchivedColumnVisible: boolean = false;
  public cnmBatchActionsVisible = false;
  public currentAgencyDetail: any;
  public dtsActiveStates: any[] = activeStates;
  public dtsPageTiles: any = {
    numOfActive: 0,
    numOfInactive: 0,
    numOfTotal: 0
  };
  public dtsActions = [
    new Action("Delete", "Delete"),
    new Action("Archive", "Archive/Restore")
  ]
  public dtsBatchActions = [
    new Action("Archive", "Archive/Restore")
  ]
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: AgencyService,
    private messageService: MessagesService) {
    super(null);
  }

  ngOnInit() {
    this.initPageData();
  }
  private initPageData = () => {
    this.initData();
  }

  private initData() {
    super.toggleLoadingPanel(true);
    this.getTiles();
    this.getAgencies();
  }

  private async getTiles() {
    await this.service.getTiles().then(result => {
      this.dtsPageTiles = result;
    })
  }

  private async getAgencies() {
    super.toggleLoadingPanel(true);
    const param = {
      activeState: this.activeState
    }
    await this.service.getByFilter(param).then(response => {
      this.dtsAgencies = response;
      if (this.dtsAgencies.length > 0) {
        this.initActions();
      }
    })
  }

  private initActions() {
    this.dtsActions.forEach(action => {
      if (action.code === 'Archive') {
        action.getText = this.getArchiveActionText;
        action.getVisibleStatus = this.getArchiveActionVisibleStatus;
      }
      if (action.code === 'Delete') {
        action.getVisibleStatus = this.getDeleteActionVisibleStatus;
      }
    });
    this.dtsBatchActions.forEach(action => {
      if (action.code === 'Archive') {
        action.getText = this.getArchiveActionText;
        action.getVisibleStatus = this.getArchiveActionVisibleStatus;
      }
    });
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
  }

  private getArchiveActionText = (): string => {
    if (this.isBatchAction) {
      const archiveItems = this.grdAgencies.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdAgencies.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdAgenciesSelectedRowKeys.length) {
        return super.getArchiveText(true);
      }
      if (restoreItems.length === this.grdAgenciesSelectedRowKeys.length) {
        return super.getArchiveText(false);
      }
      return super.getArchiveText(null);
    } else {
      return super.getArchiveText(this.currentAgencyDetail.isArchived);
    }
  }

  private getDeleteActionVisibleStatus = (): boolean => {
    if (this.currentAgencyDetail.isArchived) {
      return true;
    } else {
      return false;
    }
  }

  private getArchiveActionVisibleStatus = (): boolean => {
    if (this.isBatchAction) {
      const archiveItems = this.grdAgencies.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdAgencies.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdAgenciesSelectedRowKeys.length) {
        return true;
      }
      if (restoreItems.length === this.grdAgenciesSelectedRowKeys.length) {
        return true;
      }
      return false;
    }
  }

  public onBtnMoreActionsClick(entity, AnchorId) {
    this.isBatchAction = false;
    this.currentAgencyDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdAgenciesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdAgenciesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdAgenciesToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick),
      new DropDownListOptions(120, this.dtsActiveStates, 'value', 'text', 'Active', this.onDdlArchiveValueChange, this.onDdlArchiveInit, true));
  }

  protected onDdlArchiveInit = (e: any) => {
    this.ddlArchiveInstance = e.component;
  }

  private onDdlArchiveValueChange = (args) => {
    super.toggleLoadingPanel(true);
    this.activeState = args.value;
    this.getAgencies();
    if (args.value === 'All') {
      this.grdAgencyArchivedColumnVisible = true;
    } else {
      this.grdAgencyArchivedColumnVisible = false;
    }
  }
  private onBtnRefreshClick = () => {
    this.getAgencies();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdAgencies.instance
    }).then(() => {
      doc.save('Agencies.pdf');
    })
  }
  private onBtnBatchActionClick = () => {
    this.isBatchAction = true;
    if (this.grdAgenciesSelectedRowKeys.length === 0) {
      super.disableAllActions(this.dtsBatchActions);
    } else {
      super.setActionsStatus(this.dtsBatchActions);
    }
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmBatchActionsVisible = true;
  }
  public onCnmBatchActionsItemClick(e: any) {
    super.toggleLoadingPanel(true);
    const selectedItems = this.grdAgenciesSelectedRowKeys;
    this.doAction(e, selectedItems);
  }

  public onCnmActionsItemClick(e) {
    super.toggleLoadingPanel(true);
    if (e.itemData.code === 'Delete') {
      this.confirmDelete(this.currentAgencyDetail.id);
    }
    if (e.itemData.code === 'Archive') {
      this.archive([this.currentAgencyDetail.id]);
    }
    this.cnmActionsVisible = false;
  }

  private doAction(e: any, selectedItems: any[]) {
    if (e.itemData.code === 'Archive') {
      this.archive(selectedItems);
    }
  }

  private archive(selectedItems: any[]) {
    this.service.archive({
      ids: selectedItems
    }).subscribe(response => {
      this.grdAgenciesSelectedRowKeys = [];
      this.initPageData();
    });
  }
  private confirmDelete(userId: any) {
    const msg = this.messageService.getMessageByCode('DC01');
    CustomDialogHelper.confirm(msg)
      .show().done((popupResult) => {
        if (popupResult) {
          this.checkAndDelete(userId);
        }
      });
  }
  private checkAndDelete(userId) {
    const param = {
      Id: userId
    }
    this.service.check(param).subscribe(response => {
      if (response.isValid) {
        this.delete();
      } else {
        super.toggleLoadingPanel(false);
        super.notifyErrorMsg(this.messageService.getMessageByCode('ET01'));
      }
    });
  }
  private delete() {
    const param = {
      Id: this.currentAgencyDetail.id
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
  public onBtnAddAgencyClicked() {
    this.isDataProcessing = true;
    this.showAgencyDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showAgencyDetail(entity, 'edit');
  }

  private showAgencyDetail(entity, mode) {
    this.addAgencyComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, AgencyDetailComponent);
    const detailInstance = this.addAgencyComponentRef.instance;
    if (mode === 'create') {
      detailInstance.popupTitle = "Agency";
      detailInstance.addAgency();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Agency - " + entity.name;
      detailInstance.editAgency(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }

      ComponentHelper.removeComponent(this.componentContainer, this.addAgencyComponentRef);
    });
  }
  public formatPhone(rowData: any) {
    let result = '';
    if (rowData.phone != null) {
      var value = rowData.phone.replace(/\s/g, "");
      result = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
    }
    return result;
  }
}
