import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { DevExtremeModule, DxDataGridModule, DxDropDownBoxModule, DxButtonModule, DxTabsModule, DxSelectBoxModule, DxCheckBoxModule, DxContextMenuModule, DxFormModule, DxPopupModule, DxScrollViewModule, DxResponsiveBoxModule, DxNumberBoxModule, DxRadioGroupModule, DxListModule, DxTreeListModule, DxFileUploaderModule, DxTextBoxModule, DxTagBoxModule, DxTextAreaModule, DxDateBoxModule, DxTreeViewModule, DxValidatorModule, DxValidationGroupModule, DxColorBoxModule, DxSwitchModule, DxChartModule, DxToolbarModule, DxTabPanelModule, DxTemplateModule, DxLoadPanelModule, DxHtmlEditorModule } from "devextreme-angular";
import { AppRoutingModule } from "./app-routing.module";
import { EmailEditorModule } from 'angular-email-editor';
import { AppComponent } from "./app.component";
import { SideNavOuterToolbarModule, SingleCardModule } from "./layouts";
import { AppSettingsComponent, MenusListComponent, LookupsListComponent, LookupDetailComponent, UsersListComponent, UserDetailComponent, AddUserTypeComponent, AvailableMarketsListComponent, AvailableMarketDetailComponent, AgenciesListComponent, AgencyDetailComponent, AddStateComponent, BusinessLineDetailComponent, BusinessLinesListComponent, BusinessTypeDetailComponent, BusinessTypesListComponent, EmailTemplateDetailComponent, EmailTemplatesListComponent, NewBusinessListComponent, ProfileSettingsComponent, RenewalBusinessComponent, CompaniesListComponent, CompanyDetailComponent, RoleDetailComponent, RolesListComponent, NewBusinessDetailComponent, CustomersComponent, PoliciesComponent } from "./pages";
import AgencyService from "./pages/agencies/agency.service";
import StateService from "./pages/available-markets/actions/states/state.service";
import AvailableMarketService from "./pages/available-markets/available-markets.service";
import BusinessLineService from "./pages/business-lines/business-line.service";
import BusinessTypeService from "./pages/business-types/business-type.service";
import CompanyService from "./pages/companies/company.service";
import EmailTemplateService from "./pages/email-templates/email-template.service";
import { MessagingAppComponent } from "./pages/messaging";
import RoleService from "./pages/roles/role.service";
import UserTypeService from "./pages/users/user-type.service";
import UserService from "./pages/users/user.service";
import { FooterModule, LoginFormModule, SharedButtonComponent, DateFilterComponent, ScreenService, AppInfoService, UserProfileService, StorageHelper, GridListHelper, FormatHelper, SystemStateService, RequestInterceptor, AuthInitService, TreeListHelper, ActionService } from "./shared";
import { InitSystemService } from "./shared/utils/init-system.service";
import { LoginManagerService } from "./shared/utils/login-manager.service";
import { UnauthenticatedContentModule } from "./unauthenticated-content";
import MessagingService from "./pages/messaging/messaging.service";
import AppSettingService from "./pages/app-settings/app.setting.service";
import { RouterModule } from "@angular/router";
import BusinessService from "./pages/new-business/business.service";

export function initializeApp(authInitService: AuthInitService) {
  return (): Promise<any> => {
    return authInitService.InitAuth();
  };
}


@NgModule({
  imports: [
    DevExtremeModule,
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxContextMenuModule,
    DxFormModule,
    DxPopupModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxNumberBoxModule,
    DxRadioGroupModule,
    DxListModule,
    DxTabsModule,
    DxTreeListModule,
    DxFileUploaderModule,
    DxTextBoxModule,
    DxTagBoxModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxTreeViewModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxColorBoxModule,
    DxSwitchModule,
    DxChartModule,
    DxToolbarModule,
    DxFileUploaderModule,
    DxTabPanelModule,
    DxTemplateModule,
    DxLoadPanelModule,
    DxHtmlEditorModule,
    EmailEditorModule,
    BrowserModule,
    RouterModule,
    SideNavOuterToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    SharedButtonComponent,
    DateFilterComponent,
    AppSettingsComponent,
    AgenciesListComponent,
    AgencyDetailComponent,
    MenusListComponent,
    LookupsListComponent,
    LookupDetailComponent,
    UsersListComponent,
    UserDetailComponent,
    AddUserTypeComponent,
    AvailableMarketsListComponent,
    AvailableMarketDetailComponent,
    AddStateComponent,
    BusinessLinesListComponent,
    BusinessLineDetailComponent,
    BusinessTypesListComponent,
    BusinessTypeDetailComponent,
    NewBusinessListComponent,
    RenewalBusinessComponent,
    EmailTemplatesListComponent,
    EmailTemplateDetailComponent,
    ProfileSettingsComponent,
    MessagingAppComponent,
    CompaniesListComponent,
    CompanyDetailComponent,
    RolesListComponent,
    RoleDetailComponent,
    NewBusinessDetailComponent,
    CustomersComponent,
    PoliciesComponent
  ],
  providers: [
    AuthInitService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AuthInitService], multi: true },
    AppSettingService,
    EmailTemplateService,
    MessagingService,
    RoleService,
    CompanyService,
    BusinessLineService,
    BusinessTypeService,
    StateService,
    AvailableMarketService,
    UserTypeService,
    UserService,
    AgencyService,
    LoginManagerService,
    ScreenService,
    AppInfoService,
    SystemStateService,
    UserProfileService,
    InitSystemService,
    StorageHelper,
    GridListHelper,
    TreeListHelper,
    FormatHelper,
    ActionService,
    BusinessService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
