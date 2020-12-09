import { registerLocaleData } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import localeNl from '@angular/common/locales/nl';
import { TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilterQuery } from '../models/filterQuery.model';
import { Location } from '../models/location';
import { Skill } from '../models/skill';
import { mockLocations, mockVacancies, newSkillMock } from '../tests/httpMockResponses';
import { HttpService } from './http.service';
registerLocaleData(localeNl, 'nl');


describe('HttpService', () => {
    let service: HttpService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpService]
        });
        service = TestBed.inject(HttpService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should delete a skill when endpoint is called', () => {
        const url = environment.api + '/skills/1';
        service.deleteSkill(url).subscribe((data: any) => {
            expect(data).toBeNull();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('DELETE');

        req.flush(null);
    });

    it('should save a skill when posted', () => {
        const skill = new Skill();
        skill.name = 'skill';
        service.saveSkill(skill).subscribe((data: any) => {
            expect(data.name).toBe('skill');
        });

        const req = httpMock.expectOne(environment.api + '/skills');
        expect(req.request.method).toBe('POST');

        req.flush(newSkillMock);
    });

    it('should build a query to retrieve vacancies', () => {
        const filterQuery = new FilterQuery();
        filterQuery.location = 'Amsterdam';
        filterQuery.distance = 0;
        filterQuery.fromDate = '01-01-1970';
        filterQuery.toDate = '02-01-1970';
        filterQuery.keyword = 'test';
        filterQuery.skills = ['Skill1', 'Skill2'];

        const sort: Sort = {
            active: 'postingDate',
            direction: 'desc'
        };

        service.getByQuery(filterQuery, 1, 10, sort).subscribe((data: any) => {
            expect(data.vacancies.length).toBe(3);
        });

        const req = httpMock.expectOne(environment.api +
            '/vacancies?size=10&page=1&skills=Skill1,Skill2&value=test&location=Amsterdam&distance=0&fromDate=1970-01-01%2000:00:00&toDate=1970-02-01%2000:00:00&sort=postingDate&dir=desc');
        expect(req.request.method).toBe('GET');

        req.flush(mockVacancies);
    });

    it('should return a string array of locations when the getLocations() method is called', () => {
        const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        const httpService = new HttpService(httpClientSpy);

        const mockLocation = [new Location('Amsterdam'), new Location('Den Haag'), new Location('Rotterdam'), new Location('Utrecht')];
        httpClientSpy.get.and.returnValue(of(mockLocation));

        const returnedLocations = httpService.getLocations();
        expect(returnedLocations.length).toBe(4);
        expect(returnedLocations).toEqual(mockLocations);
    });

    it('should build a close to empty query to retrieve as much vacancies as possible', () => {
        const filterQuery = new FilterQuery();
        filterQuery.location = '';
        filterQuery.distance = null;
        filterQuery.fromDate = '';
        filterQuery.toDate = '';
        filterQuery.keyword = '';
        filterQuery.skills = [];

        const sort: Sort = {
            active: '',
            direction: ''
        };

        service.getByQuery(filterQuery, 1, 10, sort).subscribe((data: any) => {
            expect(data.vacancies.length).toBe(3);
        });

        const req = httpMock.expectOne(environment.api +
            '/vacancies?size=10&page=1');
        expect(req.request.method).toBe('GET');

        req.flush(mockVacancies);
    });

    afterEach(() => {
        httpMock.verify();
    });

});
