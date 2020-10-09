import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { loginMockResponse, signupMockResponse } from '../tests/authenticationServiceMockResponses';
import { AuthenticationService } from './authentication.service';


describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let httpMock: HttpTestingController;
    let routerSpy;

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthenticationService,
                { provide: Router, useValue: routerSpy }
            ]
        });
        service = TestBed.inject(AuthenticationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login user and set values in localStorage', () => {
        spyOn(localStorage, 'setItem');

        service.login('admin', 'password').pipe(first()).subscribe((data: any) => {
            expect(data).toBe('admin');
            expect(localStorage.setItem).toHaveBeenCalledTimes(1);
            expect(service.currentUserValue).toBe(loginMockResponse);
        });

        const req = httpMock.expectOne(environment.api + '/auth/signin');
        expect(req.request.method).toBe('POST');

        req.flush(loginMockResponse);
    });

    it('should let a user signup', () => {
        service.signup('user', 'password').subscribe((data: any) => {
            expect(data.success).toBe(true);
            expect(data.message).toEqual('User registered successfully!');
        });

        const req = httpMock.expectOne(environment.api + '/auth/signup');
        expect(req.request.method).toBe('POST');

        req.flush(signupMockResponse);
    });

    it('refresh token when needed', () => {
        spyOn(localStorage, 'setItem');

        service.refresh().subscribe((data: User) => {
            expect(data.expiresAt).toBeDefined();
            expect(localStorage.setItem).toHaveBeenCalledTimes(1);
            expect(service.currentUserValue).toBe(data);
        });

        const req = httpMock.expectOne(environment.api + '/auth/refresh');
        expect(req.request.method).toBe('GET');

        req.flush(loginMockResponse);
    });

    it('should logout user, remove localStorage item and return user to index', () => {
        spyOn(localStorage, 'removeItem');

        service.logout();

        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
        expect(service.currentUserValue).toBeNull();
    });

    afterEach(() => {
        httpMock.verify();
    });

});
