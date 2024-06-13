import { Component, enableProdMode, HostBinding } from '@angular/core';
import dxDataGrid from 'devextreme/ui/data_grid';
import dxForm from 'devextreme/ui/form';
import dxPopup from 'devextreme/ui/popup';
import dxTreeList from 'devextreme/ui/tree_list';
import * as $ from "jquery";
import { ScreenService, AppInfoService } from './shared/services';
import { LoginManagerService } from './shared/utils/login-manager.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  constructor(private authService: LoginManagerService, private screen: ScreenService, public appInfo: AppInfoService) {

    dxDataGrid.defaultOptions({
      options: {
        loadPanel: null,
        wordWrapEnabled: false,
        showRowLines: true,
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showColumnLines: true,
        columnHidingEnabled: true,
        showBorders: false,
        columnAutoWidth: true,
        width: '100%',
        keyExpr: 'id'
      }
    });

    dxTreeList.defaultOptions({
      options: {
        loadPanel: null,
        showRowLines: true,
        hoverStateEnabled: true,
        allowColumnResizing: true,
        showColumnLines: true,
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        scrolling: {
          mode: 'standard'
        },
        paging: {
          enabled: false
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [25, 50, 75, 100]
        }
      }
    });
    dxForm.defaultOptions({
      options: {
        showColonAfterLabel: false,
        labelLocation: 'top'
      }
    });
    dxPopup.defaultOptions({
      options: {
        onShowing: () => {
          $('body').css({ 'overflow': 'hidden' });
        },
        onHiding: () => {
          const hasShownPopup = $('body div').hasClass('d-con-popup');
          if (!hasShownPopup) {
            $('body').css({ 'overflow': 'auto' });
          }
        }
      }
    });
  }

  isAuthenticated() {
    return this.authService.loggedIn;
  }
}
