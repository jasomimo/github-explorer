import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as authAction from './auth.actions';
import { ProfileResponse } from 'src/app/profile/model/profile.model';
import { ErrorMessageService } from 'src/app/common/table/service/error-message.service';

interface AutoLoginAuthData {
    login: string, 
    avatarUrl: string, 
    basicAuthBase64: string, 
    expiration: Date
}

@Injectable()
export class AuthEffects {
    
    private userDataKey = 'userData';
    
    constructor(private actions$: Actions,
                private http: HttpClient,
                private router: Router,
                private errorMessageService: ErrorMessageService) {}
    
    @Effect()
    authAutoLogin = this.actions$
        .pipe(
            ofType(authAction.authAutoLogin),
            map(action => {
                
                const authData = this.loadAuthData();
                
                if (authData) {
                    
                    return authAction.authSuccess({
                        login: authData.login, 
                        avatarUrl: authData.avatarUrl,
                        basicAuth: authData.basicAuthBase64,
                        redirect: false
                    });
                }
                
                return authAction.authAutoLoginFailed();
            })
        );
    
    @Effect()
    authStarted = this.actions$
        .pipe(
            ofType(authAction.authStarted),
            switchMap(action => {
                
                const basicAuthBase64 = btoa(action.login + ':' + action.password);
                
                const httpOptions = {
                    headers: new HttpHeaders({'authorization': 'Basic ' + basicAuthBase64})
                }
                
                return this.http
                    .get<ProfileResponse>('https://api.github.com/user', httpOptions)
                    .pipe(
                        map(response => {
                            
                            return authAction.authSuccess({
                                login: response.login,
                                avatarUrl: response.avatar_url,
                                basicAuth: basicAuthBase64,
                                redirect: true
                            });
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(authAction.authFailed({message: 'Login was not successful. Error details: ' + errorMessage}));
                        })
                    )
            })
        );
        
    @Effect({dispatch: false})
    authSuccess = this.actions$
        .pipe(
            ofType(authAction.authSuccess),
            tap(action => {
                
                this.saveAuthData(action.login, action.avatarUrl, action.basicAuth);
                
                if (action.redirect) {
                    
                    this.router.navigate(['/profile']);
                }
            })
        );
        
    @Effect({dispatch: false})
    authLogout = this.actions$
        .pipe(
            ofType(authAction.authLogout),
            tap(action => {
                
                localStorage.removeItem(this.userDataKey);
                
                this.router.navigate(['/']);
            })
        );
        
    private saveAuthData(login: string, avatarUrl: string, basicAuthBase64: string){
        
        const expiresIn20Minutes = 20 * 60 * 1000;
        const expiration = new Date(new Date().getTime() + expiresIn20Minutes);
        
        const authData: AutoLoginAuthData = {
            login,
            avatarUrl,
            basicAuthBase64,
            expiration
        };
        
        localStorage.setItem(this.userDataKey, JSON.stringify(authData));
    }
    
    private loadAuthData(): AutoLoginAuthData {
        
        const authDataJson = localStorage.getItem(this.userDataKey);
        
        if (!authDataJson) {
            return null;
        }
        
        const authData: AutoLoginAuthData = JSON.parse(authDataJson);
        authData.expiration = new Date(authData.expiration);
        
        const now = new Date();
        
        if (authData.expiration < now) {
            
            localStorage.removeItem(this.userDataKey);
            return null;
        }
        
        return authData;
    }
}