import { Component, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private authenticationService: AuthenticationService,
              private loaderService: LoaderService,
              private cdRef : ChangeDetectorRef) {}

  ngOnInit(): void {
    // setTimeout(() => { this.isLoading = this.loaderService.isLoading });
    // this.cdRef.detectChanges();
  }

  logout(): void {
    this.authenticationService.logout();
  }

}
