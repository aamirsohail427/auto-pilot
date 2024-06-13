import { Component, Input, Output, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { DxButtonComponent, DxDropDownButtonComponent } from 'devextreme-angular';


@Component({
    selector: 'shared-button',
    templateUrl: './shared-button.component.html'
})
export class SharedButtonComponent implements OnInit {

  @ViewChild('button', { static: false }) button: DxButtonComponent;
  @ViewChild('dropDownButton', { static: false }) dropDownButton: DxDropDownButtonComponent;
  @Input() customType = 'default';
  @Input() customText: string;
  @Input() isDisabled = false;
  @Input() isVisible = false;
  @Input() isDropDown = false;
  @Input() dataSource: any;
  @Input() width: number = undefined;
  @Input() items: any;
  @Input() splitButton = false;
  @Output() buttonClicked = new EventEmitter<any>();
  @Output() itemClicked = new EventEmitter<any>();
  @Output() clicked = new EventEmitter<any>();
  ngOnInit() {
  }

  public onClicked() {
    this.clicked.emit();
  }

  public onItemClick(e) {
    this.itemClicked.emit(e);
  }

  public onButtonClick(e) {
    this.buttonClicked.emit(e);
  }
}
