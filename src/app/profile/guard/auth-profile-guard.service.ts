import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthProfileGuard implements CanActivate {

    constructor(private router: Router,
                private store: Store<AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        
        return this.store
            .select('auth')
            .pipe(
                map(authState => {
                    
                    if (authState.user) {
                        // user is logged in, allow route to /profile
                        return true;
                    }
                    
                    // redirect to no access, when user not logged in
                    return this.router.createUrlTree(['/profile/no-access']);
                })
            );
    }
}
