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

    public updateUser(user: any): Observable<any> {
        return this.httpClient.put(environment.api + '/user', user,
        {
            responseType: 'text'
        });
    }

    public deleteUser(id: number): Observable<any> {
        return this.httpClient.delete(environment.api + '/user/' + id,
        {
            responseType: 'text'
        });
    }
    
    public allowRegistration(): Observable<any> {
        return this.httpClient.get(environment.api + '/auth/allow');
    }

    public updateRegistration(val: boolean): Observable<any> {
        return this.httpClient.put(environment.api + '/auth/allow?newVal=' + val, {});
    }

    public scrape(): Observable<any> {
        return this.httpClient.put(environment.api + '/scraper', {});
    }

    
}