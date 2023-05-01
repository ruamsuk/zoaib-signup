import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileUser } from '../../models/user-profile.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id', 'displayName', 'firstName', 'lastName',
    'email', 'action'
  ];
  dataSource!: MatTableDataSource<ProfileUser>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey!: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private toast: HotToastService,
    private dialog: MatDialog
  ) {
    this.getUsers();
    this.dataSource = new MatTableDataSource<ProfileUser>();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers() {
    this.userService.loadUsers()
      .pipe(
        this.toast.observe({
          success: 'Successfully',
          loading: 'loading...',
          error: ({message}) => `${message}`
        }),
        untilDestroyed(this)
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<ProfileUser>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchKey = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchClear() {
    this.searchKey = '';
    this.dataSource.filter = this.searchKey;
  }

  onDetail(user: ProfileUser) {
    this.userService.populateForm(user);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus =false;
    this.dialog.open(UserDetailComponent, dialogConfig);
  }
}
