import { Component, AfterContentInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterContentInit {

  isLoading: Subject<boolean>;

  constructor(private authenticationService: AuthenticationService,
              private loaderService: LoaderService) { }

  ngAfterContentInit(): void {
    setTimeout(() => this.isLoading = this.loaderService.isLoading);
  }

  logout(): void {
    this.authenticationService.logout();
  }

}
