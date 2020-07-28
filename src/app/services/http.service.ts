import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterQuery } from '../models/filterQuery.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PageResult } from '../models/pageresult.model';
import { Skill } from '../models/skill';
import { ErrorCode } from './errorCode';

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
     * @returns requested vacancies
     */
    public getByQuery(filterQuery: FilterQuery, pageNum: number, pageSize: number): Observable<PageResult> {
        let params = new HttpParams();
        params = params.append('size', String(pageSize));
        params = params.append('page', String(pageNum));
        params = params.append('skills', filterQuery.skills.join());
        params = params.append('value', filterQuery.keyword);

        return this.httpClient.get<PageResult>(environment.api + '/vacancies', {params: params});
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
     * @param url 
     * @returns skills for vacancy 
     */
    public getSkillsForVacancy(url: string): Observable<any> {
        return this.httpClient.get(url);
    }


    /**
     * Finds all skills
     * @returns all skills 
     */
    public findAllSkills(): Observable<any> {
        return this.httpClient.get<any>(environment.api + '/skills/search/findByOrderByNameAsc');
    }


    /**
     * Deletes skill
     * @param skill Skill to delete
     * @returns result 
     */
    public deleteSkill(url: string): Observable<ErrorCode> {
        return this.httpClient.delete<ErrorCode>(url);
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
}