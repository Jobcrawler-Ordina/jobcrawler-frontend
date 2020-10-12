import { Location } from 'src/app/models/location';

export class Vacancy {
    id: string;
    vacancyURL: string;
    title: string;
    broker: string;
    vacancyNumber: string;
    hours: number;
    location: Location;
    salaray: string;
    postingDate: string;
    about: string;
    skills: any[];
}
