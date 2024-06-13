import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper, ListViewBase } from '../../../shared';
import { LookupDetailComponent } from '../detail';
import LookupService from '../lookup.service';

@Component({
  selector: 'app-lookups-list',
  templateUrl: './lookups-list.component.html',
  styleUrls: ['./lookups-list.component.scss']
})
export class LookupsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdLookups', { static: false }) grdLookups: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addLookupComponentRef: ComponentRef<LookupDetailComponent>;
  public dtsLookups: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: LookupService) {
    super(null);
  }

  ngOnInit(): void {
    this.initData();
  }
  public initData() {
  }

  public onGrdLookupsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdRolesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdLookupsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', false, null),
      null);
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }

  public onBtnAddLookupClicked() {
    this.isDataProcessing = true;
    this.showLookupDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showLookupDetail(null, 'edit');
  }

  public showLookupDetail(entity, mode) {
    this.addLookupComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, LookupDetailComponent);
    const detailInstance = this.addLookupComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Lookup";
      detailInstance.addLookup();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Lookup - " + entity.title;
      detailInstance.editLookup(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addLookupComponentRef);
    });
  }
  public onCnmActionsItemClick(e) {

  }

}
