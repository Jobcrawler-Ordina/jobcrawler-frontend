import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { FilterQuery } from '../models/filterQuery.model';
import { Skill } from '../models/skill';
import { mockVacancies, newSkillMock } from '../tests/httpMockResponses';
import { HttpService } from './http.service';
import localeNl from '@angular/common/locales/nl';
import { registerLocaleData } from '@angular/common';
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

    it('should relink skills when doing a put request to /skillmatcher', () => {
        service.relinkSkills().subscribe((data: any) => {
            expect(data).toBeNull();
        });

        const req = httpMock.expectOne(environment.api + '/skillmatcher');
        expect(req.request.method).toBe('PUT');

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
