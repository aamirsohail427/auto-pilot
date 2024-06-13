import { Component, OnInit } from '@angular/core';
import { ViewBase } from 'src/app/shared';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends ViewBase implements OnInit {
  public dtsLocations: any;
  constructor() {
    super(null);
  }

  ngOnInit(): void {
  }

}
