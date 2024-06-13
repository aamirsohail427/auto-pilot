import { ViewBase } from './view.base';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { ActionService } from '../../utils';

export class ListViewBase extends ViewBase {
  public tileNumbers: any = {};
  public columnVisibleIndex = -1;

  constructor(protected actionService: ActionService) {
    super(actionService);
    this.grdStoringEnabled = false;
  }

  protected initStore(options, callback?: Function) {
    const defaultOptions = {
      onBeforeSend: (operation: string, ajaxSettings: JQueryAjaxSettings) => {
        const data: any = ajaxSettings.data;
        super.toggleLoadingPanel(true);
        // }
        if (operation === 'insert' || operation === 'update' || operation === 'delete') {
          ajaxSettings.contentType = 'application/json; charset=utf-8';
          ajaxSettings.dataType = 'json';
          ajaxSettings.data = JSON.stringify(ajaxSettings.data);
          ajaxSettings.xhrFields = { responseType: 'json' };
          ajaxSettings.processData = true;
        }
        return super.setAuthToken(operation, ajaxSettings);
      },
      onLoaded: (response) => {
        if (callback) {
          callback();
        }
        super.toggleLoadingPanel(false);
      }
    };
    const finalOptions = _.assign(defaultOptions, options);
    super.initStore(finalOptions);
  }

  protected onDdlArchiveInit = (e: any) => {
    this.ddlArchiveInstance = e.component;
  }

  public onTileClick = (tile) => {
    if (this.ddlArchiveInstance && this.activeState !== tile) {
      if (this.ddlArchiveInstance.option('items').find(x => x.value === tile)) {
        this.ddlArchiveInstance.option('value', tile);
      }
    }
  }

  public setTrlColumnWidthFromColumnChooser(e) {
    if (e.name === 'columns' && e.fullName.indexOf('visibleIndex') !== -1 && typeof (e.value) === typeof (1)) {
      this.columnVisibleIndex = e.value;
      e.component.getVisibleColumns();
    }
    if (e.name === 'columns' && e.fullName.indexOf('visible') !== -1 && typeof (e.value) === typeof (true) && this.columnVisibleIndex !== -1) {
      if (e.value) {
        const dataField = e.component.getVisibleColumns().filter(d => d.visibleIndex === this.columnVisibleIndex)[0].dataField;
        const columns = e.component.option('columns').forEach(d => {
          if (d.dataField === dataField) {
            e.component.columnOption(dataField, 'width', 100);
          }
        });
      }
    }
  }

  public setGrdColumnWidthFromColumnChooser(e) {
    if (e.name === 'columns' && e.fullName.indexOf('visibleIndex') !== -1 && typeof (e.value) === typeof (1)) {
      this.columnVisibleIndex = e.value;
    }
    if (e.name === 'columns' && e.fullName.indexOf('visible') !== -1 && typeof (e.value) === typeof (true)) {
      if (e.value) {
        const columns = e.component.option('columns').map(d => {
          if (d.visibleIndex === this.columnVisibleIndex) {
            d.width = 100;
          }
          return d;
        });
        e.component.option('columns', columns);
      }
    }
  }
  protected getActions(profileService: any, route: ActivatedRoute, callbackFn: any = null) {
    super.getActions(profileService, route.snapshot.url[route.snapshot.url.length - 1].path, callbackFn);
  }
}
