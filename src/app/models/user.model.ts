import { Moment } from 'moment';

export class User {
    username: string;
    token: string;
    expiresIn: number;
    expiresAt: Moment;
    tokenType: string;
    roles: string[];
}