import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(environment.api + '/auth/signin', {
            username: username,
            password: password
        })
        .pipe(map(user => {
            user.expiresAt = moment().add(user.expiresIn,'second');
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    signup(username: string, password: string) {
        return this.http.post(environment.api + '/auth/signup', {
            username: username,
            password: password
        }, {
            responseType: 'text'
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}