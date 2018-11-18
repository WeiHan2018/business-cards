import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService} from './login.service';
import { DatabaseService } from '../service/database.service';

import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuardAdmin implements CanActivate {
  
  constructor(
    private authService: LoginService, 
    private router: Router,
    private dbService: DatabaseService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      // console.log('AUTH USER AUTH USER');
      // console.log(this.auth.userUid);
      // console.log('AUTH USER AUTH USER');

      // console.log('IS ADMIN IS ADMIN IS ADMIN');
      // console.log(this.auth.isAdmin());
      // console.log('IS ADMIN IS ADMIN IS ADMIN');

    /*return this.authService.user.pipe(
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        if (!loggedIn) {
          console.log('access denied');
          this.router.navigate(['']);
        } else {
          if (state['url'] === '/history') {
            this.dbService.isAdminUser(this.authService.userUid).subscribe(
              (result) => {
                if (result !== true) {
                  console.log('The current user cannot access history page because it is not an admin user!');
                  
                  //this.router.navigate({ replaceUrl: false });
                }
              },
              (error) => {
                console.log('Failed to check if the current user is an admin user!');
                console.log(error);
                
                //this.router.navigate(['/dashboard'], { replaceUrl: false });
              }
            );
          }
          //return Observable.of(false);
        }
        return false;
      }),
    );*/
    //return false;

    if (!this.authService.loggedIn) {
      console.log('access denied');
      return false;
    } else {
      if (this.authService.isAdmin) {
        return true;
      } else {
        console.log('The current user cannot access history page because it is not an admin user!');
        return false;
      }
    }
    
  }
  
}
