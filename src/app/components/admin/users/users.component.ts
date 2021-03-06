import { Component, OnInit, ViewChild  } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Userlist } from 'src/app/models/userlist.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Role } from 'src/app/models/role.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [AdminService]
})
export class UsersComponent implements OnInit {

  dataSource: Userlist[];
  displayedColumns: string[] = ['x', 'id', 'username', 'role'];
  currentUser: any;
  allowSignups = new FormControl();

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private adminService: AdminService,
              private authenticationService: AuthenticationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    this.getUsers();
    this.getAllowSignups();
  }

  public updateUser(user: any): void {
    const userData = { ...user }; // Clone object so it can be adjusted
    let update: number;
    delete userData.role; // Remove role from object
    if (userData.roles.includes(Role.ADMIN)) {
      userData.roles = [Role.USER];
      user.roles = [Role.USER];
      update = 0;
    } else {
      userData.roles = [Role.ADMIN];
      user.roles = [Role.ADMIN];
      update = 1;
    }

    this.adminService.updateUser(userData).subscribe(() => {
      if (update === 0) {
        user.role = Role.USER;
      } else {
        user.role = Role.ADMIN;
      }
    });
  }

  public removeUser(user: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: `Do you confirm the deletion of user ${user.username}?`
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.adminService.deleteUser(user.id).subscribe((data: any) => {
          const index: number = this.dataSource.indexOf(user);
          this.dataSource.splice(index, 1);
          this.table.renderRows();
        });
      }
    });

  }

  public toggleSignup(): void {
    this.adminService.updateRegistration(this.allowSignups.value).subscribe(() => {});
  }

  private getUsers(): void {
    this.adminService.getUsers().subscribe((data: any) => {
      data.forEach((u: any) => {
        if (u.roles.includes(Role.ADMIN)) {
          u.role = Role.ADMIN;
        } else {
          u.role = Role.USER;
        }
      });
      this.dataSource = data;
    });
  }

  private getAllowSignups(): void {
    this.adminService.allowRegistration().subscribe((data: any) => {
      this.allowSignups.setValue(data.allow);
    });
  }

}
