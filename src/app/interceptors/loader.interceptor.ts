import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    
    /**
     * Creates an instance of loader interceptor.
     * @param loaderService loaderService is either true or false.
     */
    constructor(public loaderService: LoaderService){}


    /**
     * Intercepts any http request
     * @param req Request that's being intercepted
     * @param next HttpHandler
     * @returns setting loaderService to false to hide the loader
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        )
    }
    
}