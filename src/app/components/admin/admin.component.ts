import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private authenticationService: AuthenticationService,
              private loaderService: LoaderService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authenticationService.logout();
  }

}
