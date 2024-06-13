import { Injectable } from '@angular/core';
import { SystemUtility } from '../utils';
import { ServiceBase } from '../base-classes';
import { SystemStateService, UserProfileService } from '../system-state';
import { role, userRoles } from './enums';

@Injectable()
export class InitSystemService extends ServiceBase {

    constructor(
        private userProfileService: UserProfileService, private systemStateService: SystemStateService) {
        super();
    }
    public storeUserData(user: any) {
        this.storeUserProfile(user);
    }

    private storeUserProfile(user: any) {
        debugger;
        this.userProfileService.rememberMeToken = user.rememberMeToken;
        this.userProfileService.userName = SystemUtility.displayFullName(user);
        if (user.roleId === role.admin)
            this.userProfileService.roleId = userRoles.admin
        else if (user.roleId === role.agency)
            this.userProfileService.roleId = userRoles.agency
        else if (user.roleId === role.user)
            this.userProfileService.roleId = userRoles.user
        this.userProfileService.loginId = user.loginId;
        this.userProfileService.image = './app/shared/assets/images/userPhoto.png';
        this.userProfileService.id = user.id;
        if (user.logoUrl !== null) {
            this.userProfileService.logoUrl = user.logoUrl;
        }
        else{
            if (user.logoUrl === null && user.logoText !== null) {
                this.userProfileService.logoText = user.logoText;
            }
            else {
                this.userProfileService.logoText = "AUTO PILOT CSR";
            }
        }
       
        if (user.roleId === role.user)
            this.userProfileService.agencyId = user.createdById;
        if (user.roleId === role.agency || user.roleId === role.admin)
            this.userProfileService.agencyId = user.id;

        this.storeUserState(user.roleId, user.menus);
    }

    private storeUserState(roleId: any, menus = []) {
        this.systemStateService.loggedIn = true;
        this.systemStateService.isSessionExpired = false;
        if (roleId === role.admin)
            this.systemStateService.role = userRoles.admin
        else if (roleId === role.agency)
            this.systemStateService.role = userRoles.agency
        else if (roleId === role.user)
            this.systemStateService.role = userRoles.user

        this.systemStateService.menus = menus;
    }
}
