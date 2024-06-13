import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Action, ButtonOptions, GridListHelper, ListViewBase } from 'src/app/shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-menus-list',
  templateUrl: './menus-list.component.html',
  styleUrls: ['./menus-list.component.scss']
})
export class MenusListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdMenus', { static: false }) grdMenus: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public dtsMenus: any[];
  public dtsParents: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public dtsActions: Action[] = [
    new Action('Delete', 'Delete'),
    new Action('Cancel', 'Cancel')
  ];
  constructor(public gridListHelper: GridListHelper,) {
    super(null);
  }

  ngOnInit(): void {
  }
  public initData() {

  }

  public onGrdMenusContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdMenusRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }
  public onBtnAddMenuClicked() {
    this.grdMenus.instance.addRow();
  }
  public onGrdMenusToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      null,
      null);
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdMenus.instance
    }).then(() => {
      doc.save('Menus.pdf');
    })
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }
  public onCnmActionsItemClick(e: any) {

  }

}
