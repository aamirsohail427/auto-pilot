import { ListHelperBase } from '../../base-classes/list-helper.base';
import * as $ from 'jquery';
import * as _ from 'lodash';
import 'devextreme/integration/jquery';
import { ButtonOptions, DropDownListOptions } from '..';

export class GridListHelper extends ListHelperBase {

  public onEditorPreparing(e, grdKey: string = '') {
    if (e.parentType === 'filterRow') {
        const testId = 'grdFilterRow_' +  (grdKey.length > 0 ? grdKey + '_' + e.dataField : e.dataField);
      e.editorOptions.inputAttr = { 'data-testid': testId};
    }
  }
    public onCellPrepared(e: any, isDisabledSelect: boolean = false, filterCallBack: any = [], selectCommandFilterSetting: any = null) {
        if (e.column.command === 'select') {
            if (e.rowType === 'filter') {
                selectCommandFilterSetting = selectCommandFilterSetting || this.getInitSelectCommandFilterSetting(e.component);
                e.cellElement.addClass('dx-editor-cell').empty();
                $('<div></div>').appendTo
                    ($('<div class=\'dx-editor-container\'></div>')
                        .appendTo($('<div class=\'d-selection-filter\'></div>').appendTo(e.cellElement)))
                    .dxSelectBox({
                        value: selectCommandFilterSetting.filterValue,
                        dataSource: [
                            { text: '(All)', value: 'All' },
                            { text: 'Checked', value: true },
                            { text: 'Unchecked', value: false }
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        onValueChanged: (ev) => this.onSelectCommandValueChanged(ev, selectCommandFilterSetting, filterCallBack)
                    });
            }
            if (isDisabledSelect) {
                this.disableSelectionColumn(e);
            }
        }
        if (e.rowType === 'filter' && e.column.dataField === 'application') {
            e.cellElement.addClass('dx-editor-cell').empty();
            $('<div></div>').appendTo
                ($('<div class=\'dx-editor-container\'></div>')
                    .appendTo($('<div class=\'d-selection-filter\'></div>').appendTo(e.cellElement)))
                .dxSelectBox({
                    value: 'All',
                    dataSource: [
                        {
                            text: 'All',
                            value: 'All'
                        },
                        {
                            text: 'Google',
                            value: 'Google'
                        },
                        {
                            text: 'CCC1',
                            value: 'CCC1'
                        },
                        {
                            text: 'Napa Tracs',
                            value: 'Napa Tracs'
                        },
                        {
                            text: 'Quick Books',
                            value: 'QuickBooks'
                        },
                        {
                            text: 'QuickBooks Online',
                            value: 'QuickBooks Online'
                        },
                        {
                            text: 'Full Throttle',
                            value: 'Full Throttle'
                        },
                    ],
                    valueExpr: 'value',
                    displayExpr: 'text',
                    onValueChanged: (ev) => {
                        filterCallBack(ev.value);
                    }
                });
        }
    }

    private onSelectCommandValueChanged (e: any, selectCommandFilterSetting, filterCallBack) {
        const grid = selectCommandFilterSetting.grid;
        if (Array.isArray(filterCallBack)) { // grid Datasource comes from service data rather than a store.
            if (e.value === true) {
                grid.filter(function (data) {
                    return grid.isRowSelected(grid.keyOf(data));
                });
            } else if (e.value === false) {
                grid.filter(function (data) {
                    return !grid.isRowSelected(grid.keyOf(data));
                });
            } else {
                grid.filter(null);
            }
            return;
        }

        if (!selectCommandFilterSetting.selectedRowKeys) {
            selectCommandFilterSetting.selectedRowKeys = [];
        }
        const allKeysInPage = [];
        selectCommandFilterSetting.grid.getDataSource().items().forEach(x => {
            allKeysInPage.push(x.id);
        });
        const selectedKeysInPage = selectCommandFilterSetting.grid.getSelectedRowKeys();
        const unSelectedKeysInPage = allKeysInPage.filter(x => !selectedKeysInPage.includes(x));
        const remainedKeys = selectedKeysInPage.concat(selectCommandFilterSetting.selectedRowKeys).filter(x => !unSelectedKeysInPage.includes(x));
        selectCommandFilterSetting.selectedRowKeys.length = 0;
        selectCommandFilterSetting.selectedRowKeys.push(... new Set(remainedKeys));

        const filterValue = e.value;
        selectCommandFilterSetting.filterValue = filterValue;
        if (selectCommandFilterSetting.filterValue === 'All') { // All
            selectCommandFilterSetting.filterOption = null;
        } else {
            const filterExpr = [];
            const filterOp = filterValue ? '=' : '<>';
            if (selectCommandFilterSetting.selectedRowKeys && selectCommandFilterSetting.selectedRowKeys.length > 0) {
                const filterLogic = filterValue ? 'or' : 'and';
                selectCommandFilterSetting.selectedRowKeys.forEach(key => {
                    if (filterExpr.length >= 1) {
                        filterExpr.push(filterLogic);
                    }
                    filterExpr.push(['id', filterOp , key ]);
                });
            } else {
                filterExpr.push(['id', filterOp , null]);
            }
            selectCommandFilterSetting.filterOption = filterExpr;
        }

        if (filterCallBack) {
            filterCallBack();
        }
    }

    public getInitSelectCommandFilterSetting(grid = null) {
        return {
            grid: grid || null,
            filterValue: 'All',
            filterOption: null,
            selectedRowKeys: [],
        };
    }

    public addCustomCheckFilter(e: any) {
        e.cellElement.addClass('dx-editor-cell').empty();
        $('<div></div>').appendTo
            ($('<div class=\'dx-editor-container\'></div>')
                .appendTo($('<div class=\'d-selection-filter\'></div>').appendTo(e.cellElement)))
            .dxSelectBox({
                value: 'All',
                dataSource: [
                    { text: '(All)', value: 'All' },
                    { text: 'Checked', value: true },
                    { text: 'Unchecked', value: false }
                ],
                valueExpr: 'value',
                displayExpr: 'text',
                onValueChanged: (ev) => {
                    if (ev.value === true) {
                        e.component.filter((data) => {
                            return data.active;
                        });
                    } else if (ev.value === false) {
                        e.component.filter((data) => {
                            return !data.active;
                        });
                    } else {
                        e.component.filter(null);
                    }
                }
            });
    }

    public disableSelectionColumn(e: any) {
        if (e.rowType === 'data' && e.column.command === 'select') {
            e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance').option('readOnly', true);
            e.cellElement.off();
        }
        if (e.rowType === 'header' && e.column.command === 'select') {
            e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance').option('readOnly', true);
        }
    }

    public moveGridRow(moveRow: any, datasource: any[], moveUp: boolean) {
        const moveRowOrderNum = _.cloneDeep(moveRow.orderNum);
        const moveFrom = _.findIndex(datasource, moveRow);
        if ((moveUp && moveFrom > 0) || (!moveUp && moveFrom < datasource.length - 1)) {
            const moveTo = moveUp ? moveFrom - 1 : moveFrom + 1;
            const tempRow = _.cloneDeep(datasource[moveTo]);
            moveRow.orderNum = tempRow.orderNum;
            tempRow.orderNum = moveRowOrderNum;
            datasource[moveTo] = moveRow;
            datasource[moveFrom] = tempRow;
        }
    }

    public getListMdtlToolbarItems(
        isModal: Boolean,
        e: any,
        btnRefreshOptions?: ButtonOptions,
        btnBatchActionsOptions?: ButtonOptions): void {
        e.toolbarOptions.items.unshift({
            location: 'before',
            visible: btnBatchActionsOptions == null ? false : true,
            template: () => {
                return '<span class="fas fa-level-down-alt d-batch-guide"></span>';
            }
        }, {
            location: 'before',
            widget: 'dxButton',
            visible: btnBatchActionsOptions == null ? false : true,
            options: btnBatchActionsOptions == null ? {} : {
                elementAttr: isModal ? { 'id': 'btnModalBatchActions', 'class': 'd-round-border' } : { 'id': 'btnBatchActions', 'class': 'd-round-border' },
                icon: 'fa fa-caret-down',
                text: 'Batch actions',
                rtlEnabled: true,
                disabled: btnBatchActionsOptions.disabled,
                onClick: btnBatchActionsOptions.onClickHandler
            }
        }, {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            showText: 'inMenu',
            visible: btnRefreshOptions == null ? false : btnRefreshOptions.visible,
            options: btnRefreshOptions == null ? {} : {
                icon: 'refresh',
                hint: 'Refresh',
                focusStateEnabled: false,
                text: 'Refresh',
                onClick: btnRefreshOptions.onClickHandler
            }
        }, {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            options: {
                icon: 'fa fa-compress',
                hint: 'Collapse All',
                focusStateEnabled: false,
                onClick: (ev) => {
                    e.component.collapseAll(-1);
                    e.component.updateDimensions();

                }
            }
        }, {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            showText: 'inMenu',
            options: {
                icon: 'fa fa-expand',
                hint: 'Expand All',
                focusStateEnabled: false,
                onClick: (ev) => {
                    e.component.expandAll(-1);
                    e.component.updateDimensions();
                }
            }
        });
    }

    private getBatchActionsElementAttr(isModal: boolean, customsTarget?: string) {
        if (customsTarget) {
            return { 'id': customsTarget, 'class': 'd-round-border d-bold-boder' };
        } else {
            if (isModal) {
                return { 'id': 'btnModalBatchActions', 'class': 'd-round-border d-bold-boder ' };
            } else {
                return { 'id': 'btnBatchActions', 'class': 'd-round-border d-bold-boder' };
            }
        }
    }

    public getListGrdToolbarItems(
        isModal: boolean,
        e: any,
        btnRefreshOptions?: ButtonOptions,
        btnExportPDFOptions?: ButtonOptions,
        btnBatchActionsOptions?: ButtonOptions,
        ddlArchiveOptions?: DropDownListOptions,
        customsTarget?: string) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            visible: btnBatchActionsOptions == null ? false : btnBatchActionsOptions.visible,
            template: () => {
                return '<span class="fas fa-level-down-alt d-batch-guide"></span>';
            }
        }, {
            location: 'before',
            widget: 'dxButton',
            locateInMenu: 'auto',
            visible: btnBatchActionsOptions == null ? false : btnBatchActionsOptions.visible,
            options: btnBatchActionsOptions == null ? {} : {
                elementAttr: this.getBatchActionsElementAttr(isModal, customsTarget),
                icon: 'fa fa-caret-down',
                text: 'Batch actions',
                rtlEnabled: true,
                onClick: btnBatchActionsOptions.onClickHandler
            }
        }, {
            location: 'before',
            widget: 'dxSelectBox',
            locateInMenu: 'auto',
            visible: ddlArchiveOptions == null ? false : ddlArchiveOptions.visible,
            showText: 'always',
            options: ddlArchiveOptions == null ? {} : {
                elementAttr: { 'class': 'd-round-border' },
                width: ddlArchiveOptions.width,
                items: ddlArchiveOptions.items,
                valueExpr: ddlArchiveOptions.valueExpr,
                displayExpr: ddlArchiveOptions.displayExpr,
                dropDownButtonTemplate: () => {
                    return $($('<div>', { class: 'd-dropdown-arrow' }).append($('<i>', {
                        class: 'fa fa-caret-down'
                    })));
                },
                value: ddlArchiveOptions.value,
                onValueChanged: ddlArchiveOptions.valueChangedHandler,
                onInitialized: ddlArchiveOptions.initializedHandler
            }
        }, {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            showText: 'inMenu',
            visible: btnRefreshOptions == null ? false : true,
            options: btnRefreshOptions == null ? {} : {
                icon: 'refresh',
                hint: 'Refresh',
                text: 'Refresh',
                focusStateEnabled: false,
                onClick: btnRefreshOptions.onClickHandler
            }
        },
        {
            location: 'after',
            widget: 'dxButton',
            locateInMenu: 'auto',
            showText: 'inMenu',
            visible: btnExportPDFOptions == null ? false : true,
            options: btnExportPDFOptions == null ? {} : {
                icon: 'exportpdf',
                hint: 'Export to PDF',
                text: 'Export to PDF',
                focusStateEnabled: false,
                onClick: btnExportPDFOptions.onClickHandler
            }
        }
        );
    }

    public initDragging(e, dtsData, callBackFn: any) {
        const visibleRows = e.component.getVisibleRows();
        const targetOrderNum = visibleRows[e.toIndex].data.orderNum;
        const draggingOrderNum = e.itemData.orderNum;
        dtsData.forEach(data => {
            if ((data.orderNum <= draggingOrderNum && data.orderNum >= targetOrderNum) || (
                data.orderNum <= targetOrderNum && data.orderNum >= draggingOrderNum)) {
                if (data.orderNum === draggingOrderNum) {
                    data.orderNum = targetOrderNum;
                } else {
                    if (targetOrderNum < draggingOrderNum) {
                        data.orderNum = data.orderNum + 1;
                    } else {
                        data.orderNum = data.orderNum - 1;
                    }
                }
            }
        });
        if (callBackFn) {
            callBackFn();
        }
    }

}
