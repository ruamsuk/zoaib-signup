import { Component, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap, Subscription, take } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {
  user$ = this.authService.currentUser$;
  subscribe: Subscription;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private imageService: ImageUploadService,
    private toast: HotToastService
  ) {
     this.userService.currentUserProfile$.pipe(
       untilDestroyed(this)
     )
      .subscribe((user) => {
        this.profileForm.patchValue({...user});
      });
  }

  uploadImage(event: any, user: User) {
    this.imageService.uploadImage(
      event.target.files[0], `images/profile/${user.uid}`
    )
      .pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Upload Image Success.',
          error: ({message}) => `${message}`
        }),
        concatMap((photoURL) =>
          this.authService.updateProfileData({uid: user.uid, photoURL}))
      ).subscribe();
  }

  saveProfile() {
    const profileData = this.profileForm.value;

    this.userService
      // @ts-ignore
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'loading...',
          success: 'Updated user successfully',
          error: ({message}) => `${message}`
        })
      ).subscribe()
  }

  ngOnDestroy() {
    if (this.subscribe) this.subscribe.unsubscribe();
  }
}
