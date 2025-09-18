import { Injectable } from '@angular/core';
import { Database, get, ref, update } from '@angular/fire/database';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
// import { FirebaseUser } from './firebase.user'  // FirebaseUser interface, created manually 
import { AppUser } from './models/app-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: Database) { }

  save(user: User) {
    console.log('Saving user data');
    const userRef = ref(this.db, `users/${user.uid}`);  //'/users/' + user.uid
    update(userRef, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    })
      .then(() => console.log('User data saved successfully', user.displayName, user.email, user.uid, user.photoURL))
      .catch(error => console.error('Error saving user data:', error));
  }

  // Get user data from Firebase Realtime Database
  get(uid: string): Observable<AppUser | null> {        // Observable<FirebaseUser | null>
    const userRef = ref(this.db, `/users/${uid}`);
    return new Observable<AppUser | null>(observer => {
      get(userRef)
        .then((snapshot: { val: () => any; }) => {
          const userData = snapshot.val(); // Assuming snapshot contains user data
          if (userData) {
            observer.next(userData as AppUser); // Emit user data if exists
          } else {
            observer.next(null); // Emit null if user does not exist
          }
          observer.complete();
        })
        .catch(error => {
          observer.error(error); // Emit error if fetch fails
        });
    });
  }

}
