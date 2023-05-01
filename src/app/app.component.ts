import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user$ = this.userService.currentUserProfile$;
  photo$ = this.authService.currentUser$;
  userImg: string | null;

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.photo$
      .pipe(untilDestroyed(this))
      .subscribe(pic => {
        this.userImg = pic?.photoURL;
      });

  }

  logout() {
    this.authService.logout()
      .subscribe(() => this.router.navigate(['']));
  }
}
