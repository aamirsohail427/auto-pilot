import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { Action, ActionService, ButtonOptions, ComponentHelper, CustomDialogHelper, GridListHelper, ListViewBase, userRoles } from '../../../shared';
import { activeStates, DropDownListOptions } from '../../../shared';
import { UserProfileService } from '../../../shared/system-state';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import MessagesService from '../../messages.service';
import CompanyService from '../company.service';
import { CompanyDetailComponent } from '../detail';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html'
})
export class CompaniesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdCompanies', { static: false }) grdCompanies: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addCompanyComponentRef: ComponentRef<CompanyDetailComponent>;
  public dtsCompanies: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public grdCompaniesSelectedRowKeys: any[] = [];
  public grdCompanyArchivedColumnVisible: boolean = false;
  public cnmBatchActionsVisible = false;
  public currentTypeDetail: any;
  public btnAddCompanyVisible = false;
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
    private service: CompanyService,
    public actionService: ActionService,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private messageService: MessagesService) {
    super(actionService);
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
    this.getCompanies(() => {
      this.initActions();
    });
  }

  private async getTiles() {
    const param = {
      id: this.userProfileService.agencyId
    }
    await this.service.getTiles(param).then(result => {
      this.dtsPageTiles = result;
    })
  }

  private async getCompanies(callbackFn: any = null) {
    debugger;
    super.toggleLoadingPanel(true);
    const param = {
      id: this.userProfileService.agencyId,
      activeState: this.activeState
    }
    await this.service.getByFilter(param).then(response => {
      this.dtsCompanies = response;
      if (callbackFn != null) {
        callbackFn();
      }
    })
  }

  private initActions() {
    super.getActions(this.userProfileService, this.route, () => {
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
      this.btnAddCompanyVisible = this.hasCreateRight;
      this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
      this.cnmActions.instance.option('dataSource', this.dtsActions);
    })

  }

  private getArchiveActionText = (): string => {
    if (this.isBatchAction) {
      const archiveItems = this.grdCompanies.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdCompanies.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdCompaniesSelectedRowKeys.length) {
        return super.getArchiveText(true);
      }
      if (restoreItems.length === this.grdCompaniesSelectedRowKeys.length) {
        return super.getArchiveText(false);
      }
      return super.getArchiveText(null);
    } else {
      return super.getArchiveText(this.currentTypeDetail.isArchived);
    }
  }
  public getMainActionText() {
    return this.hasEditRight ? 'Edit' : 'View';
  }
  private getDeleteActionVisibleStatus = (): boolean => {
    if (this.currentTypeDetail.isArchived && this.hasDeleteRight) {
      return true;
    } else {
      return false;
    }
  }

  private getArchiveActionVisibleStatus = (): boolean => {
    if (this.isBatchAction) {
      const archiveItems = this.grdCompanies.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdCompanies.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdCompaniesSelectedRowKeys.length && this.hasEditRight) {
        return true;
      }
      if (restoreItems.length === this.grdCompaniesSelectedRowKeys.length && this.hasEditRight) {
        return true;
      }
      return false;
    }
    else {
      if (this.hasEditRight) {
        return true;
      } else {
        return false;
      }
    }
  }
  public getTriangleVisibility = () => {
    if (this.hasDeleteRight || this.hasEditRight) {
      return true;
    }
    return false;
  }
  public onBtnMoreActionsClick(entity, AnchorId) {
    this.isBatchAction = false;
    this.currentTypeDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdCompaniesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdCompaniesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdCompaniesToolbarPreparing(e: any) {
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
    this.getCompanies();
    if (args.value === 'All') {
      this.grdCompanyArchivedColumnVisible = true;
    } else {
      this.grdCompanyArchivedColumnVisible = false;
    }
  }
  private onBtnRefreshClick = () => {
    this.getCompanies();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdCompanies.instance
    }).then(() => {
      doc.save('Companies.pdf');
    })
  }
  private onBtnBatchActionClick = () => {
    this.isBatchAction = true;
    if (this.grdCompaniesSelectedRowKeys.length === 0) {
      super.disableAllActions(this.dtsBatchActions);
    } else {
      super.setActionsStatus(this.dtsBatchActions);
    }
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmBatchActionsVisible = true;
  }
  public onCnmBatchActionsItemClick(e: any) {
    super.toggleLoadingPanel(true);
    const selectedItems = this.grdCompaniesSelectedRowKeys;
    this.doAction(e, selectedItems);
  }

  public onCnmActionsItemClick(e) {
    super.toggleLoadingPanel(true);
    if (e.itemData.code === 'Delete') {
      this.confirmDelete(this.currentTypeDetail.id);
    }
    if (e.itemData.code === 'Archive') {
      this.archive([this.currentTypeDetail.id]);
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
      this.grdCompaniesSelectedRowKeys = [];
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
      Id: this.currentTypeDetail.id
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
  public onBtnCompanyClicked() {
    this.isDataProcessing = true;
    this.showCompanyDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showCompanyDetail(entity, 'edit');
  }

  private showCompanyDetail(entity, mode) {
    this.addCompanyComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, CompanyDetailComponent);
    const detailInstance = this.addCompanyComponentRef.instance;
    detailInstance.hasCreateRight = this.hasCreateRight;
    detailInstance.hasEditRight = this.hasEditRight;
    if (mode === 'create') {
      detailInstance.popupTitle = "Company";
      detailInstance.addCompany();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Company - " + entity.name;
      detailInstance.editCompany(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }

      ComponentHelper.removeComponent(this.componentContainer, this.addCompanyComponentRef);
    });
  }

}
