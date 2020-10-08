import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { loginMockResponse, usernameReturnMock } from '../tests/authenticationServiceMockResponses';
import { AuthenticationService } from './authentication.service';


describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [AuthenticationService]
        });
        service = TestBed.inject(AuthenticationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login user and set values in localStorage', () => {
        const loginSpy = jasmine.createSpyObj('AuthenticationService', ['login']);
        loginSpy.login.and.returnValue(usernameReturnMock);
        spyOn(localStorage, 'setItem');

        service.login('admin', 'password').pipe(first()).subscribe((data: any) => {
            expect(data).toBe('admin');
            expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        });

        const req = httpMock.expectOne(environment.api + '/auth/signin');
        expect(req.request.method).toBe('POST');

        req.flush(loginMockResponse);
    });

    afterEach(() => {
        httpMock.verify();
    });

});
