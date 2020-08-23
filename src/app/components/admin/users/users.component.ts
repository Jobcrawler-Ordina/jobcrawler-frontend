import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Userlist } from 'src/app/models/userlist.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [AdminService]
})
export class UsersComponent implements OnInit {

  dataSource: Userlist[];
  displayedColumns: string[] = ['x', 'id', 'username', 'role'];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.adminService.getUsers().subscribe((data: any) => {
      data.forEach(u => {
        if (u.roles.includes("ROLE_ADMIN")) {
          u.role = "ROLE_ADMIN";
        } else {
          u.role = "ROLE_USER";
        }
      });
      this.dataSource = data;
    })
  }

}
