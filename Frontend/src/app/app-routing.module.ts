import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './shared/components';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { AuthGuardService } from './shared';
import { AdminDashboardComponent, AgenciesListComponent, AppSettingsComponent, AvailableMarketsListComponent, BusinessLinesListComponent, BusinessTypesListComponent, CompaniesListComponent, CustomersComponent, EmailTemplatesListComponent, NewBusinessListComponent, ProfileSettingsComponent, RenewalBusinessComponent, RolesListComponent, UsersListComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'agencies',
    component: AgenciesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'available-markets',
    component: AvailableMarketsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'renewal-business',
    component: RenewalBusinessComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'new-business',
    component: NewBusinessListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'email-templates',
    component: EmailTemplatesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'business-types',
    component: BusinessTypesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'business-lines',
    component: BusinessLinesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'companies',
    component: CompaniesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-types',
    component: RolesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'general-settings',
    component: AppSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'policies',
    component: CustomersComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }), DxDataGridModule, DxFormModule],
  providers: [AuthGuardService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
