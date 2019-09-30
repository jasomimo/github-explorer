import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { AppState } from '../store/app.reducer';
import * as authAction from '../auth/store/auth.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    private combineSubscription: Subscription;
    
    showLogin: boolean;
    loggedIn: boolean;
    
    currentUserLogin: string = null;
    currentUserAvatarUrl: string = null;

    constructor(private router: Router,
                private store: Store<AppState>) { }

    ngOnInit(): void {
        
        const currentUrl$ = this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map((event:NavigationEnd) => event.url)
            );
        
        const userIsLoggedIn$ = this.store
            .select('auth')
            .pipe(
                tap(authState => {
                    
                    if (authState.user) {
                        this.currentUserLogin = authState.user.login;
                        this.currentUserAvatarUrl = authState.user.avatarUrl;
                    }
                }),
                map(authState => {
                    return !!authState.user;
                })
            );
            
        this.combineSubscription = combineLatest(currentUrl$, userIsLoggedIn$)
            .subscribe(([currentUrl, userIsLoggedIn]) => {
                
                this.loggedIn = userIsLoggedIn;
                
                if (userIsLoggedIn) {
                    
                    // do not show login button, when already logged in
                    this.showLogin = false;
                    
                } else {
                    
                    // do not show login button, when already on login page
                    this.showLogin = currentUrl !== '/login'
                }
            })
    }
    
    onLogout():void {
        this.store.dispatch(authAction.authLogout());
    }
    
    ngOnDestroy(): void {
        
        if (this.combineSubscription) {
            this.combineSubscription.unsubscribe();
        }
    }
}
