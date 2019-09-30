import { createReducer, on } from '@ngrx/store';
import cloneDeep  from 'lodash-es/cloneDeep';
import * as authAction from './auth.actions';

interface User {
    login: string,
    basicAuth: string,
    avatarUrl: string
}

export interface AuthState {
    authStarted: boolean, 
    user: User
    authFailedMessage: string
}

const initialState: AuthState = {
    authStarted: false,
    user: null,
    authFailedMessage: null
};

const _authReducer = createReducer(initialState, 
    on(authAction.authStarted, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.authStarted = true;
        colnedState.authFailedMessage = null;
        
        return colnedState;
    }),
    on(authAction.authSuccess, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.authStarted = false;
        colnedState.user =  {
            login: action.login,
            basicAuth: action.basicAuth,
            avatarUrl: action.avatarUrl  
        };
        colnedState.authFailedMessage = null;
        
        return colnedState;
    }),
    on(authAction.authFailed, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.authStarted = false;
        colnedState.authFailedMessage = action.message;
        
        return colnedState;
    }),
    on(authAction.authCleanFailedMessage, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.authFailedMessage = null;
        
        return colnedState;
    }),
    on(authAction.authLogout, (state) => {
        
        const colnedState = cloneDeep(state);
        colnedState.user = null;
        
        return colnedState;
    })
);

export function authReducer(state, action) {
    return _authReducer(state, action);
}