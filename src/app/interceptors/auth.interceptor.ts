import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { User } from '../models/user.model';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    refreshing: boolean = false;

    constructor(private authenticationService: AuthenticationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            const currentUser = this.authenticationService.currentUserValue;
            const isLoggedIn = currentUser && currentUser.token;
            const isApiUrl = req.url.startsWith(environment.api);

            if (isLoggedIn && isApiUrl) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                let expiresInSec: number = moment(currentUser.expiresAt).diff(moment(), 'seconds');
                if (expiresInSec < 240 && this.refreshing == false) { // Refresh JWT as user is still active
                    this.refreshing = true;
                    this.authenticationService.refresh()
                    .pipe(first())
                    .subscribe(
                      () => {
                          this.refreshing = false;
                      }
                    );
                }
            }



            return next.handle(req);
        }
        
}