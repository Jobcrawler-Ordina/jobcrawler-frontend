import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { Location } from '../../models/location';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css'],
  providers: [HttpService]
})
export class LocationDialogComponent implements OnInit {
    homeLocation: Location;
    private ip: any;

  constructor(private httpService: HttpService, private dialog: MatDialogRef<LocationDialogComponent>) {
    }

    async ngOnInit(): Promise<void> {
        await this.getGeoLocation().then(result => {this.homeLocation = result; });
        console.log(this.homeLocation);
        console.log(this.homeLocation.name);
    }

    private getGeoLocation(): Promise<any> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {console.log(position);
                    this.httpService.getLocationByCoordinates(position.coords.latitude, position.coords.longitude)
                        .subscribe(
                            (data: any) => { console.log(data);
                                resolve(new Location(data.location, position.coords.longitude, position.coords.latitude))},
                            () => resolve(''));
                },
                () => {
                    resolve('');
                });
        });
    }

    public onClickYes() {
        this.dialog.close(this.homeLocation);
    }

}
