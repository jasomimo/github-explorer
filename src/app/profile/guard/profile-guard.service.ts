import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

    constructor(private router: Router,
                private store: Store<AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        
        return this.store
            .select('auth')
            .pipe(
                map(authState => {
                    
                    if (!authState.user) {
                        // user not logged in proceed to any /profile/<login>
                        return true;
                    }
                    
                    const profileLogin = route.params['login'];

                    if (authState.user.login === profileLogin) {
                        
                        // user is logged in, and accessing their profile, redirect to /profile
                        return this.router.createUrlTree(['/profile']);
                    }
                    
                    // user is logged in, and accessing someone's esle profile, proceed to any /profile/<login>
                    return true;
                })
            );
    }
}
