import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401 && this.authenticationService.currentUserValue !== null) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }

            const error = err.error.message || err;
            return throwError(error);
        }));
    }
}
