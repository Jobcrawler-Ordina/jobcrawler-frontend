import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient,
                private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: string, pass: string): Observable<any> {
        return this.http.post<any>(environment.api + '/auth/signin', {
            username: user,
            password: pass
        })
        .pipe(map((userLogin: User) => {
            userLogin.expiresAt = moment().add(userLogin.expiresIn, 'second');
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(userLogin);
            return user;
        }));
    }

    signup(user: string, pass: string): Observable<any> {
        return this.http.post(environment.api + '/auth/signup', {
            username: user,
            password: pass
        });
    }

    allowRegistration(): Observable<any> {
        return this.http.get(environment.api + '/auth/allow');
    }

    refresh(): Observable<any> {
        return this.http.get(environment.api + '/auth/refresh')
            .pipe(map((userLogin: User) => {
            userLogin.expiresAt = moment().add(userLogin.expiresIn, 'second');
            localStorage.setItem('currentUser', JSON.stringify(userLogin));
            this.currentUserSubject.next(userLogin);
            return userLogin;
        }));
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }
}
