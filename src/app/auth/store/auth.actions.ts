import { createAction, props } from '@ngrx/store';

export const authAutoLogin = createAction('[Login Component] Auto Login');

export const authAutoLoginFailed = createAction('[Login Component] Auto Login Failed');

export const authStarted = createAction('[Login Component] Authentication started', props<{login: string, password: string}>());

export const authSuccess = createAction('[Login Component] Authentication successful', props<{login: string, basicAuth: string, avatarUrl: string, redirect: boolean}>());

export const authFailed = createAction('[Login Component] Authentication failed', props<{message: string}>());

export const authCleanFailedMessage = createAction('[Login Component] Clean authentication failed message');

export const authLogout = createAction('[Login Component] Authentication logout');
