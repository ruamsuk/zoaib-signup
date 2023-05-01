import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  user$ = this.authService.currentUser$;

  constructor(
    public userService: UsersService,
    private authService: AuthenticationService,
    private dialogRef: MatDialogRef<UserDetailComponent>
  ) {
  }

  onClose() {
    this.dialogRef.close();
  }
}
