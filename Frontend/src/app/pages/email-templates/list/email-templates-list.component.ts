import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { Action, ActionService, ButtonOptions, ComponentHelper, CustomDialogHelper, GridListHelper, ListViewBase } from '../../../shared';
import { activeStates, DropDownListOptions } from '../../../shared';
import { UserProfileService } from '../../../shared/system-state';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import MessagesService from '../../messages.service';
import { EmailTemplateDetailComponent } from '../detail';
import EmailTemplateService from '../email-template.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-templates-list',
  templateUrl: './email-templates-list.component.html',
  styleUrls: ['./email-templates-list.component.scss']
})
export class EmailTemplatesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdTemplates', { static: false }) grdTemplates: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addTemplateComponentRef: ComponentRef<EmailTemplateDetailComponent>;
  public dtsTemplates: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public grdTemplatesSelectedRowKeys: any[] = [];
  public grdTemplateArchivedColumnVisible: boolean = false;
  public cnmBatchActionsVisible = false;
  public currentTemplateDetail: any;
  public btnAddTemplateVisible = false;
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
    private service: EmailTemplateService,
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
    this.getTemplates(() => {
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

  private async getTemplates(callbackFn: any = null) {
    super.toggleLoadingPanel(true);
    const param = {
      id: this.userProfileService.agencyId,
      activeState: this.activeState
    }
    await this.service.getByFilter(param).then(response => {
      this.dtsTemplates = response;
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
      this.btnAddTemplateVisible = this.hasCreateRight;
      this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
      this.cnmActions.instance.option('dataSource', this.dtsActions);
    });

  }
  public getMainActionText() {
    return this.hasEditRight ? 'Edit' : 'View';
  }
  private getArchiveActionText = (): string => {
    if (this.isBatchAction) {
      const archiveItems = this.grdTemplates.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdTemplates.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdTemplatesSelectedRowKeys.length) {
        return super.getArchiveText(true);
      }
      if (restoreItems.length === this.grdTemplatesSelectedRowKeys.length) {
        return super.getArchiveText(false);
      }
      return super.getArchiveText(null);
    } else {
      return super.getArchiveText(this.currentTemplateDetail.isArchived);
    }
  }

  private getDeleteActionVisibleStatus = (): boolean => {
    if (this.currentTemplateDetail.isArchived && this.hasDeleteRight) {
      return true;
    } else {
      return false;
    }
  }

  private getArchiveActionVisibleStatus = (): boolean => {
    if (this.isBatchAction) {
      const archiveItems = this.grdTemplates.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdTemplates.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdTemplatesSelectedRowKeys.length && this.hasEditRight) {
        return true;
      }
      if (restoreItems.length === this.grdTemplatesSelectedRowKeys.length && this.hasEditRight) {
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

  public onBtnMoreActionsClick(entity, AnchorId) {
    this.isBatchAction = false;
    this.currentTemplateDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdTemplatesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdTemplatesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }
  public onGrdRolesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdTemplatesToolbarPreparing(e: any) {
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
    this.getTemplates();
    if (args.value === 'All') {
      this.grdTemplateArchivedColumnVisible = true;
    } else {
      this.grdTemplateArchivedColumnVisible = false;
    }
  }
  private onBtnRefreshClick = () => {
    this.getTemplates();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdTemplates.instance
    }).then(() => {
      doc.save('Templates.pdf');
    })
  }
  private onBtnBatchActionClick = () => {
    this.isBatchAction = true;
    if (this.grdTemplatesSelectedRowKeys.length === 0) {
      super.disableAllActions(this.dtsBatchActions);
    } else {
      super.setActionsStatus(this.dtsBatchActions);
    }
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmBatchActionsVisible = true;
  }
  public onCnmBatchActionsItemClick(e: any) {
    super.toggleLoadingPanel(true);
    const selectedItems = this.grdTemplatesSelectedRowKeys;
    this.doAction(e, selectedItems);
  }

  public onCnmActionsItemClick(e) {
    super.toggleLoadingPanel(true);
    if (e.itemData.code === 'Delete') {
      this.confirmDelete(this.currentTemplateDetail.id);
    }
    if (e.itemData.code === 'Archive') {
      this.archive([this.currentTemplateDetail.id]);
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
      this.grdTemplatesSelectedRowKeys = [];
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
      Id: this.currentTemplateDetail.id
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
  public onBtnAddTemplateClicked() {
    this.isDataProcessing = true;
    this.showTemplateDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showTemplateDetail(entity, 'edit');
  }

  private showTemplateDetail(entity, mode) {
    this.addTemplateComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, EmailTemplateDetailComponent);
    const detailInstance = this.addTemplateComponentRef.instance;
    detailInstance.hasCreateRight = this.hasCreateRight;
    detailInstance.hasEditRight = this.hasEditRight;
    if (mode === 'create') {
      detailInstance.popupTitle = "Template";
      detailInstance.addTemplate();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Template - " + entity.templateTitle;
      detailInstance.editTemplate(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      super.toggleLoadingPanel(false);
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addTemplateComponentRef);
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
