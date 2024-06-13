import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from '../../../shared/base-classes';
import { Action, ActionService, activeStates, ButtonOptions, ComponentHelper, CustomDialogHelper, DropDownListOptions, GridListHelper } from '../../../shared/utils';
import { UserDetailComponent } from '../detail';
import UserService from '../user.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import MessagesService from '../../messages.service';
import { UserProfileService } from 'src/app/shared';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdUsers', { static: false }) grdUsers: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addUserComponentRef: ComponentRef<UserDetailComponent>;
  public dtsUsers: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public currentUserDetail: any;
  public grdUserArchivedColumnVisible: boolean = false;
  public grdUsersSelectedRowKeys: any[] = [];
  public dtsActiveStates: any[] = activeStates;
  public btnAddUserVisible = false;
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
    private service: UserService,
    private route: ActivatedRoute,
    public actionService: ActionService,
    private userProfileService: UserProfileService,
    private messageService: MessagesService) {
    super(actionService);
  }

  ngOnInit(): void {
    this.initPageData();
  }
  private initPageData = () => {
    this.initData(() => {
      this.initActions();
    });

  }

  private initData(callBackFn: any = null) {
    super.toggleLoadingPanel(true);
    this.getTiles();
    this.getUsers();
    if (callBackFn) {
      callBackFn();
    }
  }

  private async getTiles() {
    await this.service.getTiles(this.userProfileService.id).then(result => {
      this.dtsPageTiles = result;
    });
  }

  private async getUsers() {
    super.toggleLoadingPanel(true);
    const param = {
      id: this.userProfileService.id,
      activeState: this.activeState
    }
    await this.service.getByFilter(param).then(response => {
      this.dtsUsers = response;
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
      this.btnAddUserVisible = this.hasCreateRight;
      this.cnmActions.instance.option('dataSource', this.dtsActions);
      this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    })
  }

  public getMainActionText() {
    return this.hasEditRight ? 'Edit' : 'View';
  }

  private getArchiveActionText = (): string => {
    if (this.isBatchAction) {
      const archiveItems = this.grdUsers.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdUsers.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdUsersSelectedRowKeys.length) {
        return super.getArchiveText(true);
      }
      if (restoreItems.length === this.grdUsersSelectedRowKeys.length) {
        return super.getArchiveText(false);
      }
      return super.getArchiveText(null);
    } else {
      return super.getArchiveText(this.currentUserDetail.isArchived);
    }
  }

  private getDeleteActionVisibleStatus = (): boolean => {
    if (this.currentUserDetail.isArchived && this.hasDeleteRight) {
      return true;
    } else {
      return false;
    }
  }

  private getArchiveActionVisibleStatus = (): boolean => {
    if (this.isBatchAction) {
      const archiveItems = this.grdUsers.instance.getSelectedRowsData()
        .filter(p => p.isArchived);
      const restoreItems = this.grdUsers.instance.getSelectedRowsData()
        .filter(p => !p.isArchived);
      if (archiveItems.length === this.grdUsersSelectedRowKeys.length && this.hasEditRight) {
        return true;
      }
      if (restoreItems.length === this.grdUsersSelectedRowKeys.length && this.hasEditRight) {
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
    this.currentUserDetail = entity;
    this.cnmActionsTarget = '#' + AnchorId;
    super.setActionsStatus(this.dtsActions);
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdUsersContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdUsersRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdUsersToolbarPreparing(e: any) {
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
    this.activeState = args.value;
    this.getUsers();
    if (args.value === 'All') {
      this.grdUserArchivedColumnVisible = true;
    } else {
      this.grdUserArchivedColumnVisible = false;
    }
  }

  public onBtnBatchActionClick = () => {
    this.isBatchAction = true;
    if (this.grdUsersSelectedRowKeys.length === 0) {
      super.disableAllActions(this.dtsBatchActions);
    } else {
      super.setActionsStatus(this.dtsBatchActions);
    }
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmBatchActionsVisible = true;
  }

  private onBtnRefreshClick = () => {
    this.getUsers();
  }

  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdUsers.instance
    }).then(() => {
      doc.save('Users.pdf');
    })
  }

  public onBtnAddUserClicked() {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showUserDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showUserDetail(entity, 'edit');
  }

  public showUserDetail(entity, mode) {
    this.addUserComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, UserDetailComponent);
    const detailInstance = this.addUserComponentRef.instance;
    detailInstance.hasCreateRight = this.hasCreateRight;
    detailInstance.hasEditRight = this.hasEditRight;
    if (mode === 'create') {
      detailInstance.popupTitle = "User";
      detailInstance.addUser();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "User - " + entity.firstName + ' ' + entity.lastName;
      detailInstance.editUser(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addUserComponentRef);
    });
  }

  public onCnmBatchActionsItemClick(e: any) {
    super.toggleLoadingPanel(true);
    const selectedItems = this.grdUsersSelectedRowKeys;
    this.doAction(e, selectedItems);
  }

  public onCnmActionsItemClick(e) {
    if (e.itemData.code === 'Delete') {
      this.confirmDelete(this.currentUserDetail.id);
    }
    if (e.itemData.code === 'Archive') {
      this.archive([this.currentUserDetail.id]);
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
      this.grdUsersSelectedRowKeys = [];
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

  private checkAndDelete(userId: any) {
    const param = {
      Id: userId
    }
    this.service.check(param).subscribe(response => {
      if (response.isValid) {
        super.notifyErrorMsg(this.messageService.getMessageByCode('ET01'));
      } else {
        this.delete();
      }
    });
  }

  private delete() {
    super.toggleLoadingPanel(true);
    const param = {
      Id: this.currentUserDetail.id
    }
    this.service.delete(param)
      .subscribe((response) => {
        super.notifySuccessMsg("Item deleted successfully.");
        this.initPageData();
      }, err => {
        super.toggleLoadingPanel(false);
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