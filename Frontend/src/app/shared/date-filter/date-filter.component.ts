import { Component, ViewChild, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DxFormComponent, DxDropDownBoxComponent, DxListComponent } from 'devextreme-angular';
import { TimeZoneService } from '../utils/time-zone.service';
import { FormatHelper } from '../utils';
import * as _ from 'lodash';
@Component({
  selector: 'shared-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
  encapsulation: ViewEncapsulation.None
})
/** date-filter component*/
export class DateFilterComponent implements OnInit {

  @ViewChild('frmDateRange', { static: false }) frmDateRange: DxFormComponent;
  @ViewChild('ddbDateType', { static: false }) ddbDateType: DxDropDownBoxComponent;
  @ViewChild('trvDateType', { static: false }) trvDateType: DxListComponent;

  public isShow = false;
  @Output() onFilterChanged: EventEmitter<any> = new EventEmitter();
  public dtsDateTypes = [
    { text: 'Today', value: 'Today' },
    { text: 'Last 30 Days', value: 'Last30Days' },
    { text: 'Week to Date', value: 'WeekToDate' },
    { text: 'Month to Date', value: 'MonthToDate' },
    { text: 'Quarter to Date', value: 'QuarterToDate' },
    { text: 'Year to Date', value: 'YearToDate' },
    { text: 'Previous Week', value: 'PreviousWeek' },
    { text: 'Previous Month', value: 'PreviousMonth' },
    { text: 'Previous Quarter', value: 'PreviousQuarter' },
    { text: 'Previous Year', value: 'PreviousYear' },
    { text: 'Last 3 Months', value: 'Last3Months' },
    { text: 'Last 6 Months', value: 'Last6Months' },
    { text: 'Last 12 Months', value: 'Last12Months' },
    { text: 'Custom', value: 'Custom' },
    { text: 'All Dates', value: 'AllDates' }
  ];
  public formItems = {};
  public dateType = 'AllDates';
  public dateFrom = null;
  public dateTo = null;

  public today: Date;
  private readonly persistenceKeyPrefix = 'DRF_';
  /** date-filter ctor */
  constructor(
    private timeZoneService: TimeZoneService,
    private formatHelper: FormatHelper
  ) {
    this.formItems = [
      {
        itemType: 'group',
        items: [
          {
            dataField: 'ddlDateForm',
            template: 'dateTypesTemplate',
            cssClass: 'd-date-filter-datatype',
            label: {
              text: 'Date Range',
            }
          },
          {
            dataField: 'dateFrom',
            isRequired: true,
            label: {
              text: 'From'
            },
            editorType: 'dxDateBox',
            cssClass: 'd-con-padding-noright-only',
            visible: this.isCustomerDate,
            editorOptions: {
              showClearButton: true,
              displayFormat: 'MM/dd/yyyy',
              useMaskBehavior: true,
              calendarOptions: {
                onOptionChanged: (e) => {
                  $('.dx-datebox-wrapper-calendar').find('.dx-calendar-today').removeClass('dx-calendar-today');
                  $('.dx-datebox-wrapper-calendar').find(`td[data-value="` + this.formatHelper.formatDate(this.today, 'yyyy/MM/dd') + `"]`).addClass('dx-calendar-today');
                }
              },
              onValueChanged: (e) => {
                this.dateFrom = e.value ? new Date(e.value) : null;
                this.updateFromToDateRange();
              },
              onOpened: (e) => {
                $('.dx-datebox-wrapper-calendar').find('.dx-calendar-today').removeClass('dx-calendar-today');
                $('.dx-datebox-wrapper-calendar').find(`td[data-value="` + this.formatHelper.formatDate(this.today, 'yyyy/MM/dd') + `"]`).addClass('dx-calendar-today');
              }
            },
          },
          {
            dataField: 'dateTo',
            isRequired: true,
            label: {
              text: 'To'
            },
            editorType: 'dxDateBox',
            cssClass: 'd-con-padding-noright-only',
            visible: this.isCustomerDate,
            editorOptions: {
              showClearButton: true,
              displayFormat: 'MM/dd/yyyy',
              useMaskBehavior: true,
              calendarOptions: {
                onOptionChanged: (e) => {
                  $('.dx-datebox-wrapper-calendar').find('.dx-calendar-today').removeClass('dx-calendar-today');
                  $('.dx-datebox-wrapper-calendar').find(`td[data-value="` + this.formatHelper.formatDate(this.today, 'yyyy/MM/dd') + `"]`).addClass('dx-calendar-today');
                }
              },

              onValueChanged: (e) => {
                this.dateTo = e.value ? new Date(e.value) : null;
                this.updateFromToDateRange();
              },
              onOpened: (e) => {
                $('.dx-datebox-wrapper-calendar').find('.dx-calendar-today').removeClass('dx-calendar-today');
                $('.dx-datebox-wrapper-calendar').find(`td[data-value="` + this.formatHelper.formatDate(this.today, 'yyyy/MM/dd') + `"]`).addClass('dx-calendar-today');
              }
            },
          },
          {
            dataField: 'filterTemplate',
            template: 'filterTemplate',
            label: {
              visible: false
            },
            visible: this.isCustomerDate
          }
        ]
      }
    ];
  }

  ngOnInit(): void {
    const value = this.dateType ? this.dateType : 'AllDates';
    if (!this.today) {
      this.today = new Date();
      this.setFilterValues(value);
    }
  }
  public setFilterValues(value: string) {
    if (!this.today) {
      return;
    }
    const today = new Date(_.cloneDeep(this.today));
    today.setHours(23, 59, 59);
    switch (value) {
      case 'Last30Days': {
        this.dateTo = today;
        this.dateFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30 + 1, 0, 0, 0, 0);
        break;
      }
      case 'Today': {
        this.dateTo = new Date(today);
        this.dateFrom = new Date(today);
        this.dateFrom.setHours(0, 0, 0);
        break;
      }
      case 'WeekToDate': {
        today.setDate(today.getDate() - (today.getDay() + 6) % 7);
        // Monday of previous week
        today.setDate(today.getDate());
        const dateTo = new Date(_.cloneDeep(this.today));
        dateTo.setHours(23, 59, 29);
        this.dateTo = dateTo;
        this.dateFrom = today.setHours(0, 0, 0);
        break;
      }
      case 'MonthToDate': {
        this.dateTo = new Date(today);
        this.dateFrom = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        break;
      }
      case 'QuarterToDate': {
        const quarter = Math.floor((today.getMonth() / 3));
        this.dateFrom = new Date(today.getFullYear(), quarter * 3, 1).setHours(0, 0, 0);
        this.dateTo = new Date(today);
        break;
      }
      case 'YearToDate': {
        this.dateTo = new Date(today);
        this.dateFrom = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;
      }
      case 'PreviousWeek': {
        // Monday of current week
        today.setDate(today.getDate() - (today.getDay() + 6) % 7);
        // Monday of previous week
        today.setDate(today.getDate() - 7);
        this.dateFrom = today.setHours(0, 0, 0);
        this.dateTo = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 23, 59, 59, 0);
        break;
      }
      case 'PreviousMonth': {
        this.dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
        this.dateTo = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 0);
        break;
      }
      case 'PreviousQuarter': {
        const quarter = Math.floor((today.getMonth() / 3));
        this.dateFrom = new Date(today.getFullYear(), quarter * 3 - 3, 1, 0, 0, 0, 0);
        this.dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth() + 3, 0, 23, 59, 59, 0);
        break;
      }
      case 'PreviousYear': {
        this.dateFrom = new Date(today.getFullYear() - 1, 0, 1).setHours(0, 0, 0);
        this.dateTo = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 0);
        break;
      }
      case 'Last3Months': {
        this.dateFrom = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate() + 1).setHours(0, 0, 0);
        this.dateTo = new Date(today).setHours(23, 59, 59);
        break;
      }
      case 'Last6Months': {
        this.dateFrom = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate() + 1).setHours(0, 0, 0);
        this.dateTo = new Date(today).setHours(23, 59, 59);
        break;
      }
      case 'Last12Months': {
        this.dateFrom = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate() + 1).setHours(0, 0, 0);
        this.dateTo = new Date(today).setHours(23, 59, 59);
        break;
      }
      case 'AllDates': {
        this.dateFrom = null;
        this.dateTo = null;
        break;
      }
      case 'Custom': {
        if (!this.dateFrom) {
          this.dateFrom = new Date(today);
        }
        if (!this.dateTo) {
          this.dateTo = new Date(today);
        }
        if (typeof (this.dateFrom) === typeof ('')) {
          this.dateFrom = new Date(this.dateFrom);
        }
        if (typeof (this.dateTo) === typeof ('')) {
          this.dateTo = new Date(this.dateTo);
        }
        this.dateFrom = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate(), 0, 0, 0, 0);
        this.dateTo = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), this.dateTo.getDate(), 23, 59, 59, 0);
        if (this.frmDateRange && this.frmDateRange.instance) {
          if (this.frmDateRange.instance.getEditor('dateFrom')) {
            this.frmDateRange.instance.getEditor('dateFrom').option('value', this.dateFrom);
          }
          if (this.frmDateRange.instance.getEditor('dateTo')) {
            this.frmDateRange.instance.getEditor('dateTo').option('value', this.dateTo);
          }
        }
        break;
      }
    }
  }

  private updateFromToDateRange() {
    if (this.frmDateRange) {
      const editorFrom = this.frmDateRange.instance.getEditor('dateFrom');
      const editorTo = this.frmDateRange.instance.getEditor('dateTo');
      editorFrom.option('max', (this.dateTo ? this.dateTo : null));
      editorTo.option('min', (this.dateFrom ? this.dateFrom : null));
    }
  }

  public onDateTypeItemClicked = (e) => {
    this.dateFrom = null;
    this.dateTo = null;
    const newValue = e.itemData.value;
    this.dateType = newValue;
    this.updateCustomDateVisibleStatus();
    if (this.isCustomerDate) {
      this.setFilterValues(newValue);
    } else {
      this.setFilterValues(newValue);
      this.onFilterChanged.emit(this.dateType);
    }
    this.ddbDateType.instance.close();
  }

  public onTrvStatusContentReady(e) {
    e.component.unselectAll();
    if (this.dateType) {
      const item = this.dtsDateTypes.find(p => p.value === this.dateType);
      e.component.selectItem(item);
    }
  }

  public updateTrvDateTypeSelectedItem() {
    this.trvDateType?.instance.reload();
  }

  public updateCustomDateVisibleStatus() {
    if (this.frmDateRange) {
      const isCustomerDate = this.isCustomerDate;
      this.frmDateRange.instance.itemOption('dateFrom', 'visible', isCustomerDate);
      this.frmDateRange.instance.itemOption('dateTo', 'visible', isCustomerDate);
      this.frmDateRange.instance.itemOption('filterTemplate', 'visible', isCustomerDate);
      if (!isCustomerDate) {
        this.frmDateRange.instance.itemOption('filterTemplate', 'width', '50%');
      }
    }
  }

  public onBtnFilterClick(e) {

    const result: any = this.frmDateRange.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    }
    this.onFilterChanged.emit(this.dateType);
  }

  public onFrmDateRangeContentReady(e) {
    setTimeout(() => {
      this.updateCustomDateVisibleStatus();
      if (this.isCustomerDate) {
        this.frmDateRange.instance.getEditor('dateFrom').option('value', this.dateFrom);
        this.frmDateRange.instance.getEditor('dateTo').option('value', this.dateTo);
      }
    }, 0);
  }

  public applyPersistenceItems(persistenceItems: any[]): void {
    const selectedDateType = persistenceItems.find(p => p.name === `${this.persistenceKeyPrefix}SelectedDateType`);
    if (typeof (selectedDateType) !== 'undefined') {
      this.dateType = selectedDateType.value;
    }
    const selectedFromDate = persistenceItems.find(p => p.name === `${this.persistenceKeyPrefix}SelectedFromDate`);
    if (typeof (selectedFromDate) !== 'undefined') {
      this.dateFrom = selectedFromDate.value;
    }
    const selectedToDate = persistenceItems.find(p => p.name === `${this.persistenceKeyPrefix}SelectedToDate`);
    if (typeof (selectedToDate) !== 'undefined') {
      this.dateTo = selectedToDate.value;
    }
    this.updateCustomDateVisibleStatus();
    this.setFilterValues(this.dateType);
    this.isShow = true;
  }

  public collectPersistenceItems(): any[] {
    const persistenceItems = [];
    if (this.dateType) {
      persistenceItems.push({ name: `${this.persistenceKeyPrefix}SelectedDateType`, value: this.dateType });
    }
    if (this.dateType === 'Custom') {
      if (this.dateFrom) {
        persistenceItems.push({ name: `${this.persistenceKeyPrefix}SelectedFromDate`, value: this.formatHelper.formatDateTime(this.dateFrom) });
      }
      if (this.dateTo) {
        persistenceItems.push({ name: `${this.persistenceKeyPrefix}SelectedToDate`, value: this.formatHelper.formatDateTime(this.dateTo) });
      }
    }
    return persistenceItems;
  }
  get isCustomerDate() {
    return this.dateType === 'Custom';
  }
}
