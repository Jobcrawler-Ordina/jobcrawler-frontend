import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AdminService {


    /**
     * Creates an instance of filter service.
     * @param httpClient needed for http requests
     */
    constructor(private httpClient: HttpClient) {
    }

    public getUsers(): Observable<any> {
        return this.httpClient.get<any>(environment.api + '/user');
    }

    
}