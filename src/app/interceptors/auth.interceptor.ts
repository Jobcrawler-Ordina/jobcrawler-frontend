import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
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
            }

            return next.handle(req);
        }
        
}