import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UsersService } from '../../services/users.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {passwordsDontMatch: true};
    }
    return null;

  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, {validators: passwordMatchValidator()});

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private toast: HotToastService,
    private router: Router
  ) {
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  submit() {
    if (this.signUpForm.invalid) return;

    const {name, email, password} = this.signUpForm.value;
    this.authService.signUp(email, password)
      .pipe(
        switchMap(({user: {uid}}) =>
          this.userService.addUser({uid, email, displayName: name})),
        this.toast.observe({
          loading: 'loading...',
          success: 'Congrats! You are all signed up',
          error: ({message}) => `${message}`
        })
      ).subscribe(() => {
        this.authService.sendEmail().then(() =>
          this.router
            .navigateByUrl('', {skipLocationChange: true})
            .then(() => this.router.navigate(['/verify-email'])))
    });
  }
}
