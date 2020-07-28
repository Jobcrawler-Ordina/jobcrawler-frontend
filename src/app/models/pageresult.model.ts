import { Vacancy } from './vacancy';

export class PageResult {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    vacancies: Vacancy[];
}