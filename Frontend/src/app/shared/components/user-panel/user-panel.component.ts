import { Component, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxListModule ,DxContextMenuModule} from 'devextreme-angular';
import { UserProfileService } from '../../system-state';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  @Input()
  user: { email: string };

  constructor(public service: UserProfileService) { }
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule
  ],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent]
})
export class UserPanelModule { }
