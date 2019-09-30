import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NoAccessGuard implements CanActivate {

    constructor(private router: Router,
                private store: Store<AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        
        return this.store
            .select('auth')
            .pipe(
                map(authState => {
                    
                    if (authState.user) {
                        // user is logged in, redirect to home
                        return this.router.createUrlTree(['/']);
                    }
                    
                    return true;
                })
            );
    }
}
