import { Component, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AdminService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private authenticationService: AuthenticationService,
              private loaderService: LoaderService,
              private adminService: AdminService,
              private cdRef : ChangeDetectorRef) {}

  ngOnInit(): void {
    // setTimeout(() => { this.isLoading = this.loaderService.isLoading });
    // this.cdRef.detectChanges();
  }

  scrape(): void {
    this.adminService.scrape().subscribe(() => {});
  }

  logout(): void {
    this.authenticationService.logout();
  }

}
