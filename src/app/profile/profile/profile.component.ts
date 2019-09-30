import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { Profile } from '../model/profile.model';
import { AppState } from 'src/app/store/app.reducer';
import * as profileAction from '../store/profile.actions';
import { Table, NavigationPage, SortParams } from 'src/app/common/table/model/table.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

    isLoggedInUserProfile: boolean;
    
    profile: Profile;
    profileIsLoading: boolean;
    profileErrorMessage: string;
    
    repos: Table;
    reposIsLoading: boolean;
    reposErrorMessage: string;
    
    followers: Table;
    followersIsLoading: boolean;
    followersErrorMessage: string;
    
    issues: Table;
    issuesIsLoading: boolean;
    issuesErrorMessage: string;
    
    mapMarkerIcon = faMapMarkerAlt;

    private storeSubscription: Subscription;
    
    constructor(private route: ActivatedRoute,
                private store: Store<AppState>) {
    }

    ngOnInit():void {
        
        this.route.params
            .pipe(
                withLatestFrom(this.store.select('auth')),
                map(([params, authState]) => {
                    
                    const login:string = params['login'];
                    
                    if (login) {
                        
                        this.isLoggedInUserProfile = false;
                        
                        // if login from param exists, use this
                        return login;
                    }
                    
                    this.isLoggedInUserProfile = true;
                    
                    // else use login of authenticated user
                    return authState.user.login;
                })
            )
            .subscribe(login => {
                
                this.store.dispatch(profileAction.profileLoadStarted({login}));
            });
            
        this.storeSubscription = this.store
            .select('profile')
            .subscribe(profileState => {
                
                this.profile = profileState.profile;
                this.profileIsLoading = profileState.profileLoadStarted;
                this.profileErrorMessage = profileState.profileErrorMessage;
                
                this.repos = profileState.repos;
                this.reposIsLoading = profileState.reposLoadStarted;
                this.reposErrorMessage = profileState.reposErrorMessage;
                
                this.followers = profileState.followers;
                this.followersIsLoading = profileState.followersLoadStarted;
                this.followersErrorMessage = profileState.followersErrorMessage;
                
                this.issues = profileState.issues;
                this.issuesIsLoading = profileState.issuesLoadStarted;
                this.issuesErrorMessage = profileState.issuesErrorMessage;
            });
    }

    ngOnDestroy():void {
        
        if(this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    
    // navigation
    onReposTableNavigation(navPage: NavigationPage) {
        
        this.store.dispatch(profileAction.reposPageChanged({navPage}));
    }
    
    onFollowersTableNavigation(navPage: NavigationPage) {
        
        this.store.dispatch(profileAction.followersPageChanged({navPage}));
    }
    
    onIssuesTableNavigation(navPage: NavigationPage) {
        
        this.store.dispatch(profileAction.issuesPageChanged({navPage}));
    }
    
    // failed messages
    onProfileErrorClose() {
        
        this.store.dispatch(profileAction.profileCleanFailedMessage());
    }
    
    onReposErrorClose() {
        
        this.store.dispatch(profileAction.reposCleanFailedMessage());
    }
    
    onFollowersErrorClose() {
        
        this.store.dispatch(profileAction.followersCleanFailedMessage());
    }
    
    onIssuesErrorClose() {
        
        this.store.dispatch(profileAction.issuesCleanFailedMessage());
    }
    
    // sorting
    onReposTableSort(sortParams: SortParams) {
        this.store.dispatch(profileAction.reposSortChanged(sortParams));
    }
}
