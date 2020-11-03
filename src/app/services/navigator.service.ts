import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService {

    getLocation(): Promise<any> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            });
        });
    }

}
