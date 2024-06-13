import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxDataGridComponent, DxContextMenuComponent } from 'devextreme-angular';
import { Action, ActionService, activeStates, ButtonOptions, ComponentHelper, CustomDialogHelper, GridListHelper, ListViewBase, UserProfileService } from 'src/app/shared';
import MessagesService from '../../messages.service';
import { RoleDetailComponent } from '../detail';
import RoleService from '../role.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html'
})
export class RolesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdRoles', { static: false }) grdRoles: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addRoleComponentRef: ComponentRef<RoleDetailComponent>;
  public dtsRoles: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public grdRolesSelectedRowKeys: any[] = [];
  public grdRoleArchivedColumnVisible: boolean = false;
  public cnmBatchActionsVisible = false;
  public currentRoleDetail: any;
  public dtsActiveStates: any[] = activeStates;
  public dtsPageTiles: any = {
    numOfActive: 0,
    numOfInactive: 0,
    numOfTotal: 0
  };
  public dtsActions = [
    new Action("Delete", "Delete")
  ]
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: RoleService,
    public actionService: ActionService,
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
    this.getRoles();
  }


  private async getRoles() {
    super.toggleLoadingPanel(true);
    const param = {
      id: this.userProfileService.id
    }
    await this.service.getByFilter(param).then(response => {
      this.dtsRoles = response;
      if (this.dtsRoles.length > 0) {
        this.initActions();
      }
    })
  }

  private initActions() {
    this.cnmActions.instance.option('dataSource', this.dtsActions);
  }

  public onBtnMoreActionsClick(entity, AnchorId) {
    this.isBatchAction = false;
    this.currentRoleDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdRolesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdRolesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdRolesToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      null,
      null);
  }

  protected onDdlArchiveInit = (e: any) => {
    this.ddlArchiveInstance = e.component;
  }


  private onBtnRefreshClick = () => {
    this.getRoles();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdRoles.instance
    }).then(() => {
      doc.save('Roles.pdf');
    })
  }

  public onCnmActionsItemClick(e) {
    super.toggleLoadingPanel(true);
    if (e.itemData.code === 'Delete') {
      this.confirmDelete(this.currentRoleDetail.id);
    }
    this.cnmActionsVisible = false;
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
      Id: this.currentRoleDetail.id
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
  public onBtnAddRoleClicked() {
    this.isDataProcessing = true;
    this.showRoleDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showRoleDetail(entity, 'edit');
  }

  private showRoleDetail(entity, mode) {
    this.addRoleComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, RoleDetailComponent);
    const detailInstance = this.addRoleComponentRef.instance;
    detailInstance.hasCreateRight = this.hasCreateRight;
    detailInstance.hasEditRight = this.hasEditRight;
    if (mode === 'create') {
      detailInstance.popupTitle = "User Type";
      detailInstance.addUserRole();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "User Type - " + entity.title;
      detailInstance.editUserRole(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addRoleComponentRef);
    });
  }
}
