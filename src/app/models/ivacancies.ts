import { Location } from 'src/app/models/location';

export interface IVacancies {
    title: string;
    broker: string;
    location: Location;
    postingDate: string;
    id: string;
    vacancyUrl: string;
}
