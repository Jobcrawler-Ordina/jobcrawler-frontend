import * as moment from 'moment';

export class User {
    username: string;
    token: string;
    expiresIn: number;
    expiresAt?: moment.Moment;
    tokenType: string;
    roles: string[];
}
