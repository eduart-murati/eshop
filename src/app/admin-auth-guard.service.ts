import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> => {
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.userService.get(user.uid).pipe(
            map(appUser => {
              if (appUser && appUser.isAdmin) {
                return true;
              } else {
                this.router.navigate(['/']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        }
      })
    );
  }
}
