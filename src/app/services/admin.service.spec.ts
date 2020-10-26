import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role.enum';
import { allowRegistrationMock, deleteUserMock, getUsersMock,
    scrapeMock, updateRegistrationMock, updateUserMock } from '../tests/adminServiceMockResponses';

import { AdminService } from './admin.service';

describe('AdminService', () => {
    let service: AdminService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AdminService]
        });
        service = TestBed.inject(AdminService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all users', () => {
        service.getUsers().subscribe((data: any) => {
            expect(data.length).toBe(2);
            expect(data[0].roles.length).toBe(2);
            expect(data[0].roles).toContain(Role.ADMIN);
            expect(data[1].username).toBe('user');
        });

        const req = httpMock.expectOne(environment.api + '/user');
        expect(req.request.method).toBe('GET');

        req.flush(getUsersMock);
    });

    it('should update user', () => {
        const user = {
            id: 2,
            username: 'user2',
            roles: [Role.ADMIN]
        };

        service.updateUser(user).subscribe((data: any) => {
            expect(data.success).toBe(true);
        });

        const req = httpMock.expectOne(environment.api + '/user');
        expect(req.request.method).toBe('PUT');

        req.flush(updateUserMock);
    });

    it('should delete user', () => {
        service.deleteUser(1).subscribe((data: any) => {
            expect(data.message).toBe('User removed');
            expect(data.success).toBe(true);
        });

        const req = httpMock.expectOne(environment.api + '/user/1');
        expect(req.request.method).toBe('DELETE');

        req.flush(deleteUserMock);
    });

    it('should return if registration is allowed', () => {
        service.allowRegistration().subscribe((data: any) => {
            expect(data.allow).toBe(true);
        });

        const req = httpMock.expectOne(environment.api + '/auth/allow');
        expect(req.request.method).toBe('GET');

        req.flush(allowRegistrationMock);
    });

    it('should update registration allowance', () => {
        service.updateRegistration(false).subscribe((data: any) => {
            expect(data.allow).toBe(false);
            expect(data.success).toBe(true);
        });

        const req = httpMock.expectOne(environment.api + '/auth/allow?newVal=false');
        expect(req.request.method).toBe('PUT');

        req.flush(updateRegistrationMock);
    });

    it('should send scrape http request', () => {
        service.scrape().subscribe((data: any) => {
            expect(data).toEqual({});
        });

        const req = httpMock.expectOne(environment.api + '/scraper');
        expect(req.request.method).toBe('PUT');

        req.flush(scrapeMock);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
