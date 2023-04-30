import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user$ = this.userService.currentUserProfile$

  constructor(
    private userService: UsersService
  ) {
  }

}
