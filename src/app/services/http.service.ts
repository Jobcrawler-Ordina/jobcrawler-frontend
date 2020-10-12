import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterQuery } from '../models/filterQuery.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PageResult } from '../models/pageresult.model';
import { Skill } from '../models/skill';
import { Sort } from '@angular/material/sort';
import { Location } from '../models/location';

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
        let params = new HttpParams();
        params = params.append('size', String(pageSize));
        params = params.append('page', String(pageNum));
        if (filterQuery.skills.length > 0)
            params = params.append('skills', filterQuery.skills.join());
        if (filterQuery.keyword !== '')
            params = params.append('value', filterQuery.keyword);
        if (filterQuery.location !== '')
            params = params.append('location', filterQuery.location);
        if (sort !== undefined && sort.active !== '')
            params = params.append('sort', sort.active);
        if (sort !== undefined && sort.direction !== '')
            params = params.append('dir', sort.direction);
        console.log(params);
        let temp;
        temp = this.httpClient.get<PageResult>(environment.api + '/vacancies', {params: params});
        console.log(temp.get);
        return temp;

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
     * Relinks skills to vacancies in backend
     * @returns result
     */
    public relinkSkills(): Observable<any> {
        return this.httpClient.put(environment.api + '/skillmatcher', {});
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
        let locations: Array<string> = [];
        this.httpClient.get<Location[]>(environment.api + '/locations').subscribe(data => {
                data.forEach(loc => {locations.push(loc.name); }); });
        return locations;
    }
}
