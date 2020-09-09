import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AdminService]
})
export class AdminComponent {

  constructor(private authenticationService: AuthenticationService,
              private adminService: AdminService) {}

  scrape(): void {
    this.adminService.scrape().subscribe();
  }

  logout(): void {
    this.authenticationService.logout();
  }

}
