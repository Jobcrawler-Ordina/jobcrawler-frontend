import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterQuery } from '../models/filterQuery.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PageResult } from '../models/pageresult.model';
import { Skill } from '../models/skill';
import { Sort } from '@angular/material/sort';
import { Location } from '../models/location';
import { formatDate } from '@angular/common';

@Injectable()
export class HttpService {
    /**
     * Creates an instance of filter service.
     * @param httpClient needed for http requests
     */
    constructor(private httpClient: HttpClient) {
    }

    /**
     * Gets vacancies by custom query
     * @param filterQuery Data from form
     * @param pageNum Current pagenumber to show
     * @param pageSize Amount of vacancies requested to show on page
     * @param [sort] optional, column/order
     * @returns requested vacancies
     */
    public getByQuery(filterQuery: FilterQuery, pageNum: number, pageSize: number, sort?: Sort): Observable<PageResult> {
        const dateFormat = 'yyyy-MM-dd HH:mm:ss';
        let params = new HttpParams();
        params = params.append('size', String(pageSize));
        params = params.append('page', String(pageNum));
        if (filterQuery.skills.length > 0) {
            params = params.append('skills', filterQuery.skills.join());
        }
        if (filterQuery.keyword !== '') {
            params = params.append('value', filterQuery.keyword);
        }
        if (filterQuery.location !== '') {
            params = params.append('location', filterQuery.location);
        }
        if (filterQuery.distance !== null) {
            params = params.append('distance', String(filterQuery.distance));
        }
        if (filterQuery.fromDate !== '') {
            formatDate(filterQuery.fromDate, dateFormat, 'nl-NL');
            params = params.append('fromDate', formatDate(filterQuery.fromDate, dateFormat, 'nl-NL'));
        }
        if (filterQuery.toDate !== '') {
            params = params.append('toDate', formatDate(filterQuery.toDate, dateFormat, 'nl-NL'));
        }

        if (sort !== undefined && sort.active !== '') {
            params = params.append('sort', sort.active === 'location' ? 'location.name' : sort.active);
        }
        if (sort !== undefined && sort.direction !== '') {
            params = params.append('dir', sort.direction);
        }
        return this.httpClient.get<PageResult>(environment.api + '/vacancies', {params});
    }

    /**
     * Gets vacancy by id
     * @param id of which vacancy details are requested
     * @returns Observable with vacancy details if success
     */
    public getByID(id: string): Observable<any> {
        return this.httpClient.get(environment.api + '/vacancies/' + id);
    }

    /**
     * Gets skills for vacancy
     * @param id
     * @returns skills for vacancy
     */
    public getSkillsForVacancy(id: string): Observable<any> {
        return this.httpClient.get(environment.api + '/vacancies/' + id + '/skills');
    }

    /**
     * Finds all skills
     * @returns all skills
     */
    public findAllSkills(): Observable<any> {
        return this.httpClient.get<any>(environment.api + '/skills');
    }

    /**
     * Deletes skill
     * @param skill Skill to delete
     * @returns result
     */
    public deleteSkill(url: string): Observable<any> {
        return this.httpClient.delete<any>(url);
    }

    /**
     * Saves skill in backend
     * @param skill to be saved
     * @returns result
     */
    public saveSkill(skill: Skill): Observable<any> {
        return this.httpClient.post<any>(environment.api + '/skills', {name: skill.name});
    }

    public getLocations(): string[] {
        const locations: Array<string> = [];
        this.httpClient.get<Location[]>(environment.api + '/locations').subscribe(data =>
                data.forEach(loc => locations.push(loc.name)));
        return locations;
    }

    async getDistance(coord1: number[], coord2: number[]) {
        return await this.httpClient.get(environment.api + '/locations/distance?from=' + coord1[0] +
            ',' + coord1[1] + '&to=' + coord2[0] + ',' + coord2[1])
            .toPromise();
    }

    async getCoordinates(loc: string) {
        return await this.httpClient.get(environment.api + '/locations/coordinates/' + loc)
            .toPromise();
    }

    public getLocationByCoordinates(lat: number, lon: number): Observable<any> {
        return this.httpClient.get<any>(environment.api + '/locations/coordinates?lat=' + lat + '&lon=' + lon);
    }
}
