import { Injectable, OnDestroy } from '@angular/core';
import { 
  Auth, authState, setPersistence, browserSessionPersistence, 
  GoogleAuthProvider, signInWithPopup, signOut, 
  updateProfile, User 
} from '@angular/fire/auth';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppUser } from './models/app-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  user$: Observable<User | null>;
  private userSubscription: Subscription;

  constructor(
    private auth: Auth,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user$ = authState(this.auth).pipe(map(user => user));

    this.userSubscription = this.user$.subscribe(user => {
      if (user) {
        this.userService.get(user.uid).subscribe(appUser => {
          if (!appUser) {
            this.userService.save(user); // call save function
          }
        });
      }
    });
  }

  get appUser$(): Observable<AppUser | null> {
    return this.user$.pipe(
      switchMap(user => user ? this.userService.get(user.uid) : of(null))
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  async login() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    try {
      const provider = new GoogleAuthProvider();
      // Set persistence before logging in                        // per t'u pare
      // await this.setSessionPersistence();
      const result = await signInWithPopup(this.auth, provider);
  
      if (result.user) {
        await this.updateUserProfile(result.user);
        this.userService.save(result.user); // Call save function
        console.log('Logged in user:', result.user.displayName); // Should be deleted
        this.redirectAfterLogin();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  
  private async updateUserProfile(user: User) {
    try {
      await updateProfile(user, {
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error; // Re-throw the error to be caught by the login method
    }
  }
  
  private async setSessionPersistence() {
    try {
      await setPersistence(this.auth, browserSessionPersistence);
    } catch (error) {
      console.error('Set persistence error:', error);
      throw error; // Re-throw the error to be caught by the login method
    }
  }
  
  private redirectAfterLogin() {
    const storedReturnUrl = localStorage.getItem('returnUrl');
    if (storedReturnUrl) {
      localStorage.removeItem('returnUrl');
      this.router.navigateByUrl(storedReturnUrl);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    signOut(this.auth).then(() => {
      console.log('Logged out from Google');
    }).catch(error => {
      console.error('Logout error:', error);
    });
  }


}

  // logout() {
  //   // Clear Firebase authentication token
  //   this.auth.signOut().then(() => {
  //     // Clear local storage
  //      localStorage.clear(); // or localStorage.removeItem('firebaseAuthToken');
  //     // Redirect to login page or perform any other necessary actions
  //   }).catch(error => {
  //     console.error('Logout error:', error);
  //   });
  // }
  

  // logout() {
  //   // Clear Firebase authentication token
  //   this.auth.signOut().then(() => {
  //     // Clear any locally stored authentication data
  //     // Redirect to login page or perform any other necessary actions
  //   }).catch(error => {
  //     console.error('Logout error:', error);
  //   });
  // }


// Explanation of Removing returnUrl from Local Storage:
// The purpose of removing returnUrl from local storage (localStorage.removeItem('returnUrl')) 
// after using it is to ensure that it's only used once. This prevents unintended redirections in 
// subsequent visits if the user reloads the page or navigates away from the application and then comes back.
// By storing returnUrl temporarily and removing it after use, the application ensures that subsequent 
// navigation is not affected by stale or outdated redirection URLs stored in local storage.

// The entire process allows the application to handle redirections after specific actions (like login or form 
// submission) seamlessly. It provides a mechanism to remember where the user intended to go before being 
// redirected to complete an action, improving user experience and navigation flow within the application.