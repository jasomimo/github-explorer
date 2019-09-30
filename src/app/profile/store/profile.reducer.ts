import { createReducer, on } from '@ngrx/store';
import cloneDeep  from 'lodash-es/cloneDeep';
import * as profileAction from './profile.actions';
import { Profile } from '../model/profile.model';
import { Table } from 'src/app/common/table/model/table.model';

export interface ProfileState {
    profile: Profile
    profileLoadStarted: boolean, 
    profileErrorMessage: string,
    
    repos: Table,
    reposLoadStarted: boolean,
    reposErrorMessage: string,
    
    followers: Table,
    followersLoadStarted: boolean,
    followersErrorMessage: string,
    
    issues: Table,
    issuesLoadStarted: boolean,
    issuesErrorMessage: string,
}

const initialState: ProfileState = {
    profile: null,
    profileLoadStarted: false,
    profileErrorMessage: null,
    
    repos: null,
    reposLoadStarted: false,
    reposErrorMessage: null,
    
    followers: null,
    followersLoadStarted: false,
    followersErrorMessage: null,
    
    issues: null,
    issuesLoadStarted: false,
    issuesErrorMessage: null
};

const _profileReducer = createReducer(initialState, 
    
    // profile
    on(profileAction.profileLoadStarted, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.profileLoadStarted = true;
        colnedState.profile = null;
        colnedState.profileErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.profileLoaded, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.profileLoadStarted = false;
        colnedState.profile = cloneDeep(action.profile);
        colnedState.profileErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.profileLoadFailed, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.profileLoadStarted = false;
        colnedState.profile = null;
        colnedState.profileErrorMessage = action.message;
        
        return colnedState;
    }),
    on(profileAction.profileCleanFailedMessage, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.profileErrorMessage = null;
        
        return colnedState;
    }),
    
    // repos
    on(profileAction.reposLoadStarted, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.reposLoadStarted = true;
        colnedState.repos = null;
        colnedState.reposErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.reposPageChanged, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.reposLoadStarted = true;
        colnedState.reposErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.reposLoaded, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.reposLoadStarted = false;
        colnedState.repos = cloneDeep(action.repos);
        colnedState.reposErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.reposLoadFailed, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.reposLoadStarted = false;
        colnedState.repos = null;
        colnedState.reposErrorMessage = action.message;
        
        return colnedState;
    }),
    on(profileAction.reposCleanFailedMessage, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.reposErrorMessage = null;
        
        return colnedState;
    }),
    
    // followers
    on(profileAction.followersLoadStarted, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.followersLoadStarted = true;
        colnedState.followers = null;
        colnedState.followersErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.followersPageChanged, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.followersLoadStarted = true;
        colnedState.followersErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.followersLoaded, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.followersLoadStarted = false;
        colnedState.followers = cloneDeep(action.followers);
        colnedState.followersErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.followersLoadFailed, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.followersLoadStarted = false;
        colnedState.followers = null;
        colnedState.followersErrorMessage = action.message;
        
        return colnedState;
    }),
    on(profileAction.followersCleanFailedMessage, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.followersErrorMessage = null;
        
        return colnedState;
    }),
    
    // issues
    on(profileAction.issuesLoadStarted, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.issuesLoadStarted = true;
        colnedState.issues = null;
        colnedState.issuesErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.issuesPageChanged, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.issuesLoadStarted = true;
        colnedState.issuesErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.issuesLoaded, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.issuesLoadStarted = false;
        colnedState.issues = cloneDeep(action.issues);
        colnedState.issuesErrorMessage = null;
        
        return colnedState;
    }),
    on(profileAction.issuesLoadFailed, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.issuesLoadStarted = false;
        colnedState.issues = null;
        colnedState.issuesErrorMessage = action.message;
        
        return colnedState;
    }),
    on(profileAction.issuesCleanFailedMessage, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.issuesErrorMessage = null;
        
        return colnedState;
    })
);

export function profileReducer(state, action) {
    return _profileReducer(state, action);
}