import * as $ from 'jquery';
export class ListHelperBase {
    public lastClickedRowId: any;

    public onDoubleClick(e: any, AnchorId: string = '', callbackFn: any = null): void {
        const component = e.component;
        if (!component.clickCount) {
            component.clickCount = 1;
        } else {
            component.clickCount = component.clickCount + 1;
        }
        if (!component.lastRowClickedId) {
            component.lastRowClickedId = e.rowIndex;
        }
        if (component.clickCount === 1) {
            component.lastClickTime = new Date();
            setTimeout(() => {
                component.lastClickTime = 0;
                component.clickCount = 0;
                component.lastRowClickedId = undefined;
            }, 200);
        } else if (component.clickCount === 2 && e.rowIndex === component.lastRowClickedId) {
            const now: any = new Date();
            if ((now - component.lastClickTime) < 200) {
                if (AnchorId !== '') {
                    $('#' + AnchorId + '-' + e.data.id).click();
                } else {
                    $('#btnMainAction-' + e.data.id).click();
                }
                if (callbackFn) {
                    callbackFn();
                }
            }
            component.clickCount = 0;
            component.lastClickTime = 0;
            component.lastRowClickedId = undefined;
        }
    }

    public onAdaptiveDetailRowPreparing(e: any) {
        e.component.updateDimensions();
    }

    public onSelectionChanged(e: any) {
        const component = e.component;
        const filter = component.filter();
        if (!filter) {
            component.filter(null);
        } else {
            component.filter((data) => {
                return filter(data);
            });
        }
    }

    public onCustomSelectionChanged(instance: any) {
        const filter = instance.extraFilter;
        if (filter) {
            const selectBoxValue = instance.selectBoxValue;
            if (selectBoxValue === false || selectBoxValue === true ) {
                instance.filter([filter, ['isSelected', selectBoxValue]]);
            } else {
                instance.filter(filter);
            }
        } else {
            instance.filter(null);
        }
    }

    public wrapCellContent(e) {
        if (e.rowType === 'data') {
            if (e.column.dataField !== undefined && e.column.dataField !== 'id' && e.cellElement) {
                const innerHTML = `<div class='d-grid-data-row-wrap-td'>${e.text}</div>`;
                if (e.cellElement.length > 0 ) {
                    e.cellElement[0].innerHTML = innerHTML;
                } else {
                    e.cellElement.innerHTML = innerHTML;
                }
            }
        }
    }
}
