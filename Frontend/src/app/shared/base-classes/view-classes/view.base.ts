import { createStore } from 'devextreme-aspnet-data-nojquery';
import CustomStore from 'devextreme/data/custom_store';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { FormatHelper, Action, AuthenticationHelper, SystemUtility, CustomDialogHelper, saveConfirmResults, popupGridRowDataSource, pageGridRowDataSource, PersistenceService, AppInjector, PageType } from '../../utils';
import { SystemStateService, UserProfileService } from '../..';
import { ActionService } from '../../utils/action.service';
import { Injector } from '@angular/core';

export class ViewBase {
  public formatHelper: FormatHelper;
  public ddlArchiveInstance: any = null;
  public ddlLocationTypeInstance: any = null;
  public store: CustomStore;
  public compareIgnoreFields: any[] = [];
  public emailPattern: any = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  public phonePattern: any = /^[^A-Za-z]+$/;
  public hasEditRight = false;
  public hasCreateRight = false;
  public hasDeleteRight = false;
  public hasViewRight = false;
  public isBatchAction = false;
  public persistenceOptions: any;
  public isDataProcessing = false;
  public levelType: string;
  public gridRows: any[] = [];
  public popupWidth;
  public popupHeight;
  public activeState = 'Active';
  public isShowCustomLoadPanel = false;
  public grdStoringEnabled = false;
  public grdStorageType = 'sessionStorage';
  private grdStorageKeyPrefix = 'Grid_persistence_KEY';
  private grdStorageKeys: any[] = [];
  private persistenceVersionNumber = null;

  public popupPageSize = 5;
  public listPageSize = 25;

  public dateTimeFormat = 'MM/dd/yyyy hh:mm a';
  public popupPagerSource = popupGridRowDataSource.map(d => {
    return d.value;
  });

  public listPagerSource = pageGridRowDataSource.map(d => {
    return d.value;
  });

  public dtsBatchActions: Action[] = [];
  public dtsActions: Action[] = [];
  public dtsActionCodes: any = [];
  public rawActions: any = [];

  public commonPersistenceService: PersistenceService;
  public commonSystemStateService: SystemStateService;
  public commonUserProfileService: UserProfileService;


  constructor(public commonActionService: ActionService) {
    // const appInjector = AppInjector.getInjector();
    // this.commonActionService = appInjector.get(ActionService);
  }

  protected initStore(options) {
    const defaultOptions = {
      key: 'id',
      onBeforeSend: (operation: string, ajaxSettings: JQueryAjaxSettings) => {
        return this.setAuthToken(operation, ajaxSettings);
      }
    };
    const finalOptions = _.assign(defaultOptions, options);
    this.store = createStore(finalOptions);
  }

  protected createCustomStore(options) {
    const defaultOptions = {
      key: 'id',
      onBeforeSend: (operation: string, ajaxSettings: JQueryAjaxSettings) => {
        return this.setAuthToken(operation, ajaxSettings);
      }
    };
    const finalOptions = _.assign(defaultOptions, options);
    return createStore(finalOptions);
  }

  protected setAuthToken(operation: string, ajaxSettings: JQueryAjaxSettings) {
    const token = AuthenticationHelper.getToken();
    ajaxSettings.contentType = 'application/json';
    const headers = ajaxSettings.headers ? ajaxSettings.headers : ajaxSettings.headers = {};
    headers['Authorization'] = `Bearer ${token}`;
  }

  protected getArchiveText(isArchived) {
    if (isArchived !== null) {
      return isArchived ? 'Restore' : 'Archive';
    }
    return 'Archive/Restore';
  }

  protected getPublishText(isPublished) {
    if (isPublished !== null) {
      return isPublished ? 'Draft' : 'Publish';
    }
    return 'Draft/Publish';
  }

  public customHeaderFilter(data) {
    data.dataSource.postProcess = (results) => {
      return results.filter(p => p.text !== '(Blanks)');
    };
  }



  public isEqual(objA: any, objB: any) {
    const objectA = this.pickDeep(objA, this.pickFunction);
    const objectB = this.pickDeep(objB, this.pickFunction);

    return _.isEqualWith(objectA, objectB, (leftVal, rightVal, key) => {
      return this.comparatorFunction(leftVal, rightVal, key);
    });
  }

  private comparatorFunction(leftVal, rightVal, key) {
    return undefined;
  }

  private pickFunction = (val, key) => {
    if (typeof (val) === 'undefined' || val === null || val === '' || this.compareIgnoreFields.includes(key)) {
      return false;
    }
    return true;
  }

  public pickDeep = (collection, predicate) => {
    predicate = _.iteratee(predicate);

    return _.transform(collection, (memo: any[], val, key) => {
      let include = predicate(val, key);
      if (include && _.isObject(val) && !_.isDate(val)) {
        val = this.pickDeep(val, predicate);
        include = !_.isEmpty(val);
      }
      if (include) {
        _.isArray(collection) ? memo.push(val) : memo[key] = val;
      }
    });
  }

  protected setActionsStatus(actions: Action[], entity?: any) {
    actions.forEach(item => {
      if (item.text !== 'No action') {
        item.disabled = false;
        item.visible = item.getVisibleStatus(entity);
        if (item.getText) {
          item.text = item.getText(entity);
        }
      }
    });
    this.settingNoAction(actions);
  }

  protected disableAllActions(actions: Action[]) {
    actions.forEach(item => {
      item.visible = true;
      item.disabled = true;
      if (item.code === 'Archive') {
        item.text = 'Archive/Restore';
      }
      if (item.code === 'Publish') {
        item.text = 'Draft/Publish';
      }
    });
    this.settingNoAction(actions);
  }

  private settingNoAction(actions: Action[]) {
    if (this.isBatchAction) {
      const index = actions.findIndex(p => p.text === 'No action');
      if (actions.filter(p => p.visible).length === 0
        ||
        (actions.filter(p => p.visible).length === 1
          && actions.filter(p => p.visible && p.text === 'No action').length === 1)) {
        if (index < 0) {
          actions.push(new Action(null, 'No action', true, null, true, () => true, true));
        }
      } else {
        if (index >= 0) {
          actions.splice(index, 1);
        }
      }
    }
  }

  public trimEditorValue(e) {
    SystemUtility.trimEditorValue(e);
  }

  protected hasShownLoadingPanel(): boolean {
    return SystemUtility.hasShownLoadingPanel();
  }

  protected toggleLoadingPanel(isShown: boolean, target: any = 'body'): void {
    this.isShowCustomLoadPanel = isShown;
    SystemUtility.toggleLoadingPanel(isShown, target);
  }

  protected togglePopupLoadingPanel(isShown: boolean): void {
    this.isShowCustomLoadPanel = isShown;
    SystemUtility.toggleLoadingPanel(isShown, '.d-con-popup > div:has(.d-con-popup-content)');
  }

  protected notifySuccessMsg(message: string) {
    CustomDialogHelper.notifySuccessMsg(message);
  }

  protected notifyErrorMsg(message: string) {
    CustomDialogHelper.alertErrorMsg(message);
  }

  protected confirmUnsavedChanges(saveCallbackFn: any = null, unsavedCallbackFn: any = null, cancelCallbackFn: any = null) {
    CustomDialogHelper.unsavedChangesConfirm()
      .show().done((popupResult) => {
        const unsavedConfirmResult = sessionStorage.getItem('unsavedConfirmResult');
        if (unsavedConfirmResult && popupResult && unsavedConfirmResult === 'Save') {
          sessionStorage.removeItem('unsavedConfirmResult');
          saveCallbackFn();
        } else if (!unsavedConfirmResult && popupResult) {
          unsavedCallbackFn();
        } else if (!popupResult) {
          if (cancelCallbackFn !== null) {
            cancelCallbackFn();
          }
        }
      });
  }

  protected confirmUnsavedChangesAsync() {
    return new Promise(resovle => {
      CustomDialogHelper.unsavedChangesConfirm()
        .show().done((popupResult) => {
          const unsavedConfirmResult = sessionStorage.getItem('unsavedConfirmResult');
          if (unsavedConfirmResult && popupResult && unsavedConfirmResult === 'Save') {
            sessionStorage.removeItem('unsavedConfirmResult');
            resovle(saveConfirmResults.save);
          } else if (!unsavedConfirmResult && popupResult) {
            resovle(saveConfirmResults.discard);
          } else if (!popupResult) {
            resovle(saveConfirmResults.cancel);
          }
        });
    });
  }


  protected getDefaultDataObservable(defaultData: any = {}): Observable<any> {
    return of({ data: defaultData });
  }

  protected isEmail(email: string, isAllowEmpty = false) {
    if (email && email.trim()) {
      return this.emailPattern.test(email.trim());
    }
    return isAllowEmpty;
  }

  //#region persistence
  protected initPersistenceOptions(pageName: string, screenName: string) {
    this.getPersistenceOptionsData(Number(this.commonUserProfileService.id), pageName, screenName);
  }

  protected getPersistenceOptionsData(userId: Number, pageName: string, screenName: string) {
    this.persistenceOptions = {
      userId: userId,
      pageName: pageName,
      screenName: screenName,
      items: []
    };
    const param = this.getParamData();
    this.persistenceOptions.persistenceVersionNumber = this.persistenceVersionNumber;
  }

  public getGrdPersistenceKey(id: string = '') {
    let key = this.grdStorageKeyPrefix + '_'
      + this.persistenceOptions.userId + '_'
      + this.persistenceOptions.pageName + '_'
      + this.persistenceOptions.screenName;
    if (id) {
      key = key + '_' + id;
    }
    key = key.replace(/\s+/g, '');
    if (this.grdStorageKeys.indexOf(key) < 0) {
      this.grdStorageKeys.push(key);
    }
    return key;
  }

  protected getParamData(activeState: string = 'Active'): any {
    const param: any = {
      activeState: activeState
    };
    return param;
  }

  protected isDriveView(): boolean {
    return this.levelType === 'Drive';
  }

  protected getPersistence(type: string = PageType[PageType.List], callbackFn: any = null) {
    this.commonPersistenceService.getByFilter(this.persistenceOptions).subscribe(result => {
      this.initPersistenceData(type, result);
      if (callbackFn !== null) {
        callbackFn();
      }
    });
  }

  protected async getPersistenceAsync(type: string = PageType[PageType.List]): Promise<any> {
    const persistenceData = await this.commonPersistenceService.getByFilter(this.persistenceOptions).toPromise();
    this.initPersistenceData(type, persistenceData);
    return persistenceData.data.items;
  }

  protected updatePersistence(type: string = PageType[PageType.List], callbackFn = null) {
    this.populatePersistenceData(type);
    this.commonPersistenceService.update(this.persistenceOptions).subscribe(results => {
      this.toggleLoadingPanel(false);
      if (callbackFn !== null) {
        callbackFn();
      }
    });

    if (this.grdStoringEnabled === true && this.grdStorageKeys.length > 0) {
      this.grdStorageKeys.forEach(grdKey => {
        sessionStorage.removeItem(grdKey);
      });
    }
  }

  private populatePersistenceData(type: string) {
    if (type === PageType[PageType.Modal]) {
      const optionItems: any = [
        { name: 'PopupWidth', value: this.popupWidth },
        { name: 'PopupHeight', value: this.popupHeight }
      ];

      if (typeof (this.persistenceOptions.items) !== 'undefined' && this.persistenceOptions.items.length > 0) {
        optionItems.forEach(o => {
          this.persistenceOptions.items.push(o);
        });
      } else {
        this.persistenceOptions.items = optionItems;
      }
    }

    if (type === PageType[PageType.List]) {
      const optionItems: any = [
        { name: 'ActiveState', value: this.activeState }
      ];
      if (typeof (this.persistenceOptions.items) !== 'undefined' && this.persistenceOptions.items.length > 0) {
        optionItems.forEach(o => {
          this.persistenceOptions.items.push(o);
        });
      } else {
        this.persistenceOptions.items = optionItems;
      }
    }

    if (this.grdStoringEnabled === true && this.grdStorageKeys.length > 0) {
      this.grdStorageKeys.forEach(grdKey => {
        const storageVal = sessionStorage.getItem(grdKey);
        if (storageVal) {
          const storageObj = {
            name: grdKey,
            value: storageVal
          };
          this.persistenceOptions.items.push(storageObj);
        }
      });
    }

    if (this.persistenceVersionNumber) {
      this.persistenceOptions.items.push({ name: 'PersistenceVersionNumber', value: this.persistenceVersionNumber });
    }
    this.applyPagePersistence(this.persistenceOptions);
  }

  protected getPageSize(name: string = 'GridRows', defaultPageSize?: number): number {
    let pageSize = defaultPageSize || this.gridRows.find(p => p.name === 'GridRows').pageSize;

    if (typeof (this.gridRows.find(p => p.name === name)) !== 'undefined') {
      pageSize = this.gridRows.find(p => p.name === name).pageSize;
    }
    return pageSize;
  }

  private initPersistenceData(type: string, persistenceData: any) {
    this.gridRows = [];
    if (type === PageType[PageType.Modal]) {
      const popupWidth = persistenceData.find(p => p.name === 'PopupWidth');
      if (typeof (popupWidth) !== 'undefined') {
        this.popupWidth = popupWidth.value;
      }
      if (this.popupWidth > $(document.body).width()) {
        this.popupWidth = $(document.body).width();
      }
      const popupHeight = persistenceData.find(p => p.name === 'PopupHeight');
      if (typeof (popupHeight) !== 'undefined') {
        this.popupHeight = popupHeight.value;
      }
      if (this.popupHeight > $(document.body).height()) {
        this.popupHeight = $(document.body).height();
      }
    }
    if (type === PageType[PageType.List]) {
      const activeState = persistenceData.data.items.find(p => p.name === 'ActiveState');
      if (typeof (activeState) !== 'undefined') {
        this.activeState = activeState.value;
        if (this.ddlArchiveInstance && this.ddlArchiveInstance.option('value') !== this.activeState) {
          this.ddlArchiveInstance.option('value', this.activeState);
        }
      }
    }

    const gridRows = persistenceData.filter(p => p.name.indexOf('GridRows') > -1);
    if (gridRows.length > 0) {
      const pageSize = Number(gridRows[0].value);
      if (pageSize) {
        if (type === PageType[PageType.List]) {
          this.listPageSize = pageSize;
        } else if (type === PageType[PageType.Modal]) {
          this.popupPageSize = pageSize;
        }
      }
      gridRows.forEach(gridRow => {
        this.gridRows.push({
          'name': gridRow.name,
          'pageSize': Number(gridRow.value)
        });
      });
    }

    if (this.grdStorageKeys.length > 0) {
      const grdStorages = persistenceData.filter(p => p.name.indexOf(this.grdStorageKeyPrefix) > -1);
      if (grdStorages.length > 0) {
        grdStorages.forEach(grdStorage => {
          sessionStorage.setItem(grdStorage.name, grdStorage.value);
        });
      }
    }
    this.getPagePersistence(persistenceData);
  }

  public formatDate = (d, format = null) => {
    return this.formatHelper.formatDate(d, format ? format : 'MM/dd/yyyy');
  }

  public formatDateTime = (d) => {
    return this.formatHelper.formatDateTime(d);
  }
  public formatShortDateTime = (d) => {
    return this.formatHelper.formatShortDateTime(d);
  }
  protected applyPagePersistence(orgPersistence): void {
  }
  protected getPagePersistence(result): void {
  }
  //#endregion



  protected getActions(userProfileService: any, routeName: any, callbackFn: any = null) {
    const actionFilter = {
      userId: userProfileService.id,
      routeName: routeName
    };
    this.commonActionService.getByFilter(actionFilter).subscribe(result => {
      this.initActionData(result);
      if (callbackFn !== null) {
        callbackFn(result);
      }
    });
  }
  protected initActionData(actionData: any) {
    if (actionData.hasAddRight) {
      this.hasCreateRight = true;
    }
    if (actionData.hasEditRight) {
      this.hasEditRight = true;
    }
    if (actionData.hasEditRight) {
      this.hasDeleteRight = true;
    }
    if (actionData.hasViewRight) {
      this.hasViewRight = true;
    }
  }
}
