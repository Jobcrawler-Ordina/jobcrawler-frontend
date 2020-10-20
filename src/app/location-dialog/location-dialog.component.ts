import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css'],
  providers: [HttpService]
})
export class LocationDialogComponent implements OnInit {
    homeLocation: string;
    private ip: any;
  constructor(private httpService: HttpService ) {   console.log('Test');
    }

    async ngOnInit(): Promise<void> {
        this.getUserLocation();
//        navigator.geolocation.getCurrentPosition();
//        this.homeLocation = await this.httpService.getCityFromIP();
        console.log(this.homeLocation);
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        }else {
            console.log("User not allow")

        }
    }


}
