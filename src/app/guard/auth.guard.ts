import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private authenticationService: AuthenticationService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.roles.includes(route.data.role) && moment().isBefore(currentUser.expiresAt)) {
            return true;
        }

        this.authenticationService.logout();
        this.router.navigate(['/']);
        return false;
    }
}
