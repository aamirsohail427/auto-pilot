import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { Action, ActionService, ButtonOptions, ComponentHelper, CustomDialogHelper, GridListHelper, ListViewBase, userRoles } from '../../../shared';
import { activeStates, DropDownListOptions } from '../../../shared';
import { UserProfileService } from '../../../shared/system-state';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import MessagesService from '../../messages.service';
import { BusinessTypeDetailComponent } from '../detail';
import BusinessTypeService from '../business-type.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-business-types-list',
  templateUrl: './business-types-list.component.html'
})
export class BusinessTypesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdBusinessTypes', { static: false }) grdBusinessTypes: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addTypeComponentRef: ComponentRef<BusinessTypeDetailComponent>;
  public dtsBusinessTypes: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public grdBusinessTypesSelectedRowKeys: any[] = [];
  public grdTypeArchivedColumnVisible: boolean = false;
  public cnmBatchActionsVisible = false;
  public currentTypeDetail: any;
  public btnAddTypeVisible = false;
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
    private service: BusinessTypeService,
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
    this.getBusinessTypes(() => {
      this.initActions();
    });
  }

  private async getTiles() {
    const param = {
      id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
    }
    await this.service.getTiles(param).then(result => {
      this.dtsPageTiles = result;
    })
  }

  private async getBusinessTypes(callbackFn: any = null) {
    super.toggleLoadingPanel(true);
    const param = {
      id: this.userProfileService.roleId === userRoles.agency ? this.userProfileService.id : this.userProfileService.agencyId,
      activeState: this.activeState
    }
    await this.service.getByFilter(param).then(response => {
      this.dtsBusinessTypes = response;
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
      this.btnAddTypeVisible = this.hasCreateRight;
      this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
      this.cnmActions.instance.option('dataSource', this.dtsActions);
    })
  }
  public getTriangleVisibility = () => {
    if (this.hasDeleteRight || this.hasEditRight) {
      return true;
    }
    return false;
  }
  private getArchiveActionText = (): string => {
    if (this.isBatchAction) {
      const archiveItems = this.grdBusinessTypes.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdBusinessTypes.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdBusinessTypesSelectedRowKeys.length) {
        return super.getArchiveText(true);
      }
      if (restoreItems.length === this.grdBusinessTypesSelectedRowKeys.length) {
        return super.getArchiveText(false);
      }
      return super.getArchiveText(null);
    } else {
      return super.getArchiveText(this.currentTypeDetail.isArchived);
    }
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
      const archiveItems = this.grdBusinessTypes.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdBusinessTypes.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdBusinessTypesSelectedRowKeys.length && this.hasEditRight) {
        return true;
      }
      if (restoreItems.length === this.grdBusinessTypesSelectedRowKeys.length && this.hasEditRight) {
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
  public getMainActionText() {
    return this.hasEditRight ? 'Edit' : 'View';
  }
  public onBtnMoreActionsClick(entity, AnchorId) {
    this.isBatchAction = false;
    this.currentTypeDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdBusinessTypesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdBusinessTypesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdBusinessTypesToolbarPreparing(e: any) {
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
    this.getBusinessTypes();
    if (args.value === 'All') {
      this.grdTypeArchivedColumnVisible = true;
    } else {
      this.grdTypeArchivedColumnVisible = false;
    }
  }
  private onBtnRefreshClick = () => {
    this.getBusinessTypes();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdBusinessTypes.instance
    }).then(() => {
      doc.save('BusinessTypes.pdf');
    })
  }
  private onBtnBatchActionClick = () => {
    this.isBatchAction = true;
    if (this.grdBusinessTypesSelectedRowKeys.length === 0) {
      super.disableAllActions(this.dtsBatchActions);
    } else {
      super.setActionsStatus(this.dtsBatchActions);
    }
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmBatchActionsVisible = true;
  }
  public onCnmBatchActionsItemClick(e: any) {
    super.toggleLoadingPanel(true);
    const selectedItems = this.grdBusinessTypesSelectedRowKeys;
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
      this.grdBusinessTypesSelectedRowKeys = [];
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
  public onBtnBusinessTypeClicked() {
    this.isDataProcessing = true;
    this.showTypeDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showTypeDetail(entity, 'edit');
  }

  private showTypeDetail(entity, mode) {
    this.addTypeComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, BusinessTypeDetailComponent);
    const detailInstance = this.addTypeComponentRef.instance;
    detailInstance.hasCreateRight = this.hasCreateRight;
    detailInstance.hasEditRight = this.hasEditRight;
    if (mode === 'create') {
      detailInstance.popupTitle = "Business Type";
      detailInstance.addBusinessType();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Business Type - " + entity.name;
      detailInstance.editBusinessType(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }

      ComponentHelper.removeComponent(this.componentContainer, this.addTypeComponentRef);
    });
  }

}
