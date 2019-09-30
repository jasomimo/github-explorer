import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { Subscription } from 'rxjs';
import { AuthState } from '../store/auth.reducer';
import { Router } from '@angular/router';
import * as authAction from '../store/auth.actions';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    
    private storeSubscription: Subscription;
    
    readonly loginInputName = 'loginInput';
    readonly passwordInputName = 'passwordInput';
    
    authStarted: boolean;
    authFailedMessage: string = 'Invalid login or password.';
    
    constructor(private store: Store<AppState>,
                private router: Router) {}

    ngOnInit() {
        this.storeSubscription = this.store
            .select('auth')
            .subscribe((authState: AuthState) => {
                
                if (authState.user) {
                    
                    // when already logged in, redirect to profile
                    this.router.navigate(['/profile']);
                }
                
                this.authStarted = authState.authStarted;
                this.authFailedMessage = authState.authFailedMessage;
            });
    }
    
    ngOnDestroy(): void {
        
        this.store.dispatch(authAction.authCleanFailedMessage());
        
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    
    onSubmit(form: NgForm) {
        
        const login = form.value[this.loginInputName];
        const password = form.value[this.passwordInputName];
        
        this.store.dispatch(authAction.authStarted({login, password}))
    }
    
    onAlertClose(): void {
        
        this.store.dispatch(authAction.authCleanFailedMessage())
    }

}
