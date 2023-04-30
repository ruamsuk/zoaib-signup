import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
  user$ = this.authService.currentUser$;

  constructor(
    private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.user$
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res.emailVerified) this.router.navigate(['']).catch()
      });
  }

  resendEmail() {
    this.authService
      .sendEmail()
      .then(() =>
      this.toast.observe({
        loading: 'loading...',
        success: 'We Resend email verify check your email again',
        error: ({message}) => `${message}`
      }));
  }
}
