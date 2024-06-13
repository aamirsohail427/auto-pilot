import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { LoginManagerService } from "../utils/login-manager.service";
const defaultPath = '/';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: LoginManagerService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const isLoggedIn = this.authService.loggedIn;
        const isAuthForm = [
            'login'
        ].includes(route.routeConfig.path);

        if (isLoggedIn && isAuthForm) {
            this.authService.lastAuthenticatedPath = defaultPath;
            this.router.navigate([defaultPath]);
            return false;
        }

        if (!isLoggedIn && !isAuthForm) {
            this.router.navigate(['/login']);
        }

        if (isLoggedIn) {
            this.authService.lastAuthenticatedPath = route.routeConfig.path;
        }

        return isLoggedIn || isAuthForm;
    }
}


// export class AuthGuardService implements CanActivate {
//     constructor(private router: Router, private userProfileService: UserProfileService) {

//     }
//     canActivate(
//         childRoute: ActivatedRouteSnapshot,
//     ): Observable<boolean> | Promise<boolean> | boolean {
//         if (this.userProfileService.isSignedInUserChanged() || this.userProfileService.isUserSignedOut()) {
//             if (JSON.stringify(childRoute.data) === '{}') {
//                 const errorMsg = this.userProfileService.isSignedInUserChanged() ? sessionErrorMsg.signedInUserChanged : sessionErrorMsg.signedOut;
//                 CustomDialogHelper.alertInfoMsg(errorMsg).done((popupResult) => {
//                     sessionStorage.clear();
//                     this.router.navigate(['/login']);
//                 });
//             } else {
//                 const errorMsg = this.userProfileService.isSignedInUserChanged() ? sessionErrorMsg.signedInUserChanged : sessionErrorMsg.signedOut;
//                 CustomDialogHelper.alertInfoMsg(errorMsg).done((popupResult) => {
//                     sessionStorage.clear();
//                     this.router.navigate(['/login']);
//                 });
//             }
//             return false;
//         } else {
//             if (childRoute.children && childRoute.children.length <= 0) {
//                 if (JSON.stringify(childRoute.data) !== '{}') {
//                     return new Promise(resolve => {
//                         CustomDialogHelper.alertInfoMsg(sessionErrorMsg.noPermission).done((popupResult) => {
//                             sessionStorage.clear();
//                             this.router.navigate(['/login']);
//                         });
//                         resolve(false);
//                     });
//                 }
//             }
//         }

//         return true;
//     }
// }