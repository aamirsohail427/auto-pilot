import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../shared';
import { ListViewBase } from '../../shared/base-classes';
import { ActionService, ButtonOptions, FormatHelper, GridListHelper } from '../../shared/utils'
import NewBusinessService from '../new-business/business.service';
@Component({
  selector: 'app-renewal-business',
  templateUrl: './renewal-business.component.html',
  styleUrls: ['./renewal-business.component.scss']
})
export class RenewalBusinessComponent extends ListViewBase implements OnInit {

  public dtsCSR: any;
  public dtsAgents: any;
  public dtsBusinessLines: any;
  public dtsRenewalBusiness: any;
  public dtsRenewalBusinessAll: any;
  public dtsRenewalBusinessLineFilter: any;
  public dtsRenewalBusinessAgentFilter: any;
  public agentFilter: boolean;
  public lineFilter: any;
  public numOfRenewal = 0;
  constructor(private gridListHelper: GridListHelper, public service: NewBusinessService,
    private dateFormatHelper: FormatHelper,
    public actionService: ActionService, private userProfileService: UserProfileService) {
    super(actionService);
  }

  ngOnInit(): void {
    this.getPolicies();
  }

  private getPolicies() {
    var start_date = new Date();
    var end_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate() - 30 + 1, 0, 0, 0, 0);
    var current_date = start_date.getDate() - end_date.getDate();
    super.toggleLoadingPanel(true);
    const param = {
      startDate: this.dateFormatHelper.formatShortDateTime(start_date),
      endDate: this.dateFormatHelper.formatShortDateTime(end_date),
      agencyId: this.userProfileService.agencyId
    }
    this.service.getPolicies(param).subscribe(response => {
      this.dtsRenewalBusiness = response.policies;
      this.numOfRenewal = response.policies.length;
      super.toggleLoadingPanel(false);
    })
  }
  public onGrdRenewalBusinessToolbarPreparing(e: any) {

    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      null);
  }
  private onBtnRefreshClick = () => {
    this.getPolicies();
  }
  private onBtnExportToPDFClick = () => {

  }
  public onBtnMainActionClick(entity) {
    window.open("https://app.qqcatalyst.com/Policies/Policy/Details/" + entity.policyID + "", "_blank");
  }
}
