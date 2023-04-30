import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile, user,
  UserInfo
} from '@angular/fire/auth';
import { concatMap, from, Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private afAuth: AngularFireAuth
  ) {
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
  }

  sendEmail() {
    return this.afAuth.currentUser.then((user) => {
      return user.sendEmailVerification();
    });
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap(user => {
        if (!user) throw new Error('Not Authenticated');

        return updateProfile(user, profileData);
      })
    );
  }


  logout() {
    return from(this.auth.signOut());
  }
}
