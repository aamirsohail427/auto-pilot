import { ListHelperBase } from '../../base-classes/list-helper.base';
import * as $ from 'jquery';
import { ButtonOptions, DropDownListOptions } from '..';

export class TreeListHelper extends ListHelperBase {

    private collapseChildren(children, treeListInstance): void {
        if (children.length === 0) {
            return;
        }
        children.forEach(c => {
            const isExpand = treeListInstance.isRowExpanded(c.key);
            if (isExpand) {
                treeListInstance.collapseRow(c.key);
            }
            this.collapseChildren(c.children, treeListInstance);
        });
    }

    private expandChildren(children, treeListInstance): void {
        if (children.length === 0) {
            return;
        }
        children.forEach(c => {
            const isExpand = treeListInstance.isRowExpanded(c.key);
            if (!isExpand) {
                treeListInstance.expandRow(c.key);
            }
            this.expandChildren(c.children, treeListInstance);
        });
    }

    public trlCollapseAll(treeListInstance): void {
        const items = treeListInstance.getRootNode();
        items.children.forEach(i => {
            const isExpand = treeListInstance.isRowExpanded(i.key);
            if (isExpand) {
                treeListInstance.collapseRow(i.key);
            }
            this.collapseChildren(i.children, treeListInstance);
        });
    }

    public trlExpandAll(treeListInstance): void {
        const items = treeListInstance.getRootNode();
        items.children.forEach(i => {
            const isExpand = treeListInstance.isRowExpanded(i.key);
            if (!isExpand) {
                treeListInstance.expandRow(i.key);
            }
            this.expandChildren(i.children, treeListInstance);
        });
    }

    public getListTrlToolbarItems(
        isModal: Boolean,
        e: any,
        btnRefreshOptions?: ButtonOptions,
        btnBatchActionsOptions?: ButtonOptions,
        ddlArchiveOptions?: DropDownListOptions,
        btnMoveUpOptions?: ButtonOptions,
        btnMoveDownOptions?: ButtonOptions): void {
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
                    elementAttr: isModal ? { 'id': 'btnModalBatchActions', 'class': 'd-round-border d-bold-boder' } : { 'id': 'btnBatchActions', 'class': 'd-round-border d-bold-boder' },
                    icon: 'fa fa-caret-down',
                    text: 'Batch actions',
                    rtlEnabled: true,
                    disabled: btnBatchActionsOptions.disabled,
                    onClick: btnBatchActionsOptions.onClickHandler
                }
            }, {
                location: 'before',
                widget: 'dxSelectBox',
                locateInMenu: 'auto',
                visible: ddlArchiveOptions == null ? false : true,
                showText: 'always',
                options: ddlArchiveOptions == null ? {} : {
                    elementAttr: { 'class': 'd-round-border' },
                    width: 120,
                    items: ddlArchiveOptions.items,
                    valueExpr: ddlArchiveOptions.valueExpr,
                    displayExpr: ddlArchiveOptions.displayExpr,
                    value: ddlArchiveOptions.value,
                    dropDownButtonTemplate: () => {
                        return $($('<div>', { class: 'd-dropdown-arrow'}).append($('<i>', {
                            class: 'fa fa-caret-down'
                        })));
                    },
                    onValueChanged: ddlArchiveOptions.valueChangedHandler,
                    onInitialized: ddlArchiveOptions.initializedHandler
                }
            }, {
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                showText: 'always',
                visible: btnMoveUpOptions == null ? false : btnMoveUpOptions.visible,
                options: btnMoveUpOptions == null ? {} : {
                    icon: 'fa fa-caret-up',
                    text: 'Move Up',
                    rtlEnabled: true,
                    disabled: true,
                    onInitialized: btnMoveUpOptions.onInitializedHandler,
                    onClick: btnMoveUpOptions.onClickHandler
                }
            }, {
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                showText: 'always',
                visible: btnMoveDownOptions == null ? false : btnMoveDownOptions.visible,
                options: btnMoveDownOptions == null ? {} : {
                    icon: 'fa fa-caret-down',
                    text: 'Move Down',
                    rtlEnabled: true,
                    disabled: true,
                    onInitialized: btnMoveDownOptions.onInitializedHandler,
                    onClick: btnMoveDownOptions.onClickHandler
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
                showText: 'inMenu',
                options: {
                    icon: 'fa fa-compress',
                    hint: 'Collapse All',
                    text: 'Collapse All',
                    focusStateEnabled: false,
                    onClick: (ev) => {
                        this.trlCollapseAll(e.component);
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
                    text: 'Expand All',
                    focusStateEnabled: false,
                    onClick: (ev) => {
                        this.trlExpandAll(e.component);
                    }
                }
            });
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
                    e.component.selectBoxValue = ev.value;
                    const extraFilter = e.component.extraFilter;
                    if (ev.value === 'All') {
                        if (extraFilter) {
                            e.component.filter(extraFilter);
                        } else {
                            e.component.filter(null);
                        }
                    } else {
                        if (extraFilter) {
                            e.component.filter([extraFilter, 'and', ['isSelected', ev.value]]);
                        } else {
                            e.component.filter(['isSelected', ev.value]);
                        }
                    }
                }
            });
    }
}
