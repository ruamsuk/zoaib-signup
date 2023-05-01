import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore, getDoc,
  orderBy,
  query,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user-profile.model';
import { AuthenticationService } from './authentication.service';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userForm = new FormGroup({
    id: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),

  });
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    )
  }

  constructor(
    private firestore: Firestore,
    private authService: AuthenticationService
  ) { }

  addUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, { ...user }));
  }

  loadUsers() {
    const dbInstance = collection(this.firestore, 'users');
    const userQuery = query(dbInstance, orderBy('firstName', 'desc'));
    return collectionData(userQuery, {idField: 'id'});
  }

  populateForm(user: ProfileUser) {
    this.userForm.patchValue({...user});
  }

}
