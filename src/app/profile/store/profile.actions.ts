import { createAction, props } from '@ngrx/store';
import { Profile } from '../model/profile.model';
import { Table, NavigationPage, SortParams } from 'src/app/common/table/model/table.model';

// profile
export const profileLoadStarted = createAction('[Profile Component] Profile load started', props<{login: string}>());

export const profileLoaded = createAction('[Profile Component] Profile loaded', props<{profile: Profile}>());

export const profileLoadFailed = createAction('[Profile Component] Profile load failed', props<{message: string}>());

export const profileCleanFailedMessage = createAction('[Profile Component] Clean profile failed message');


// repos
export const reposLoadStarted = createAction('[Profile Component] Repos load started', props<{reposUrl: string}>());

export const reposPageChanged = createAction('[Profile Component] Repos page changed', props<{navPage: NavigationPage}>());

export const reposSortChanged = createAction('[Profile Component] Repos sort changed', props<SortParams>());

export const reposLoaded = createAction('[Profile Component] Repos loaded', props<{repos: Table}>());

export const reposLoadFailed = createAction('[Profile Component] Repos load failed', props<{message: string}>());

export const reposCleanFailedMessage = createAction('[Profile Component] Clean repos failed message');


// followers
export const followersLoadStarted = createAction('[Profile Component] Followers load started', props<{followersUrl: string}>());

export const followersPageChanged = createAction('[Profile Component] Followers page changed', props<{navPage: NavigationPage}>());

export const followersLoaded = createAction('[Profile Component] Followers loaded', props<{followers: Table}>());

export const followersLoadFailed = createAction('[Profile Component] Followers load failed', props<{message: string}>());

export const followersCleanFailedMessage = createAction('[Profile Component] Clean followers failed message');


// issues
export const issuesLoadStarted = createAction('[Profile Component] Issues load started');

export const issuesPageChanged = createAction('[Profile Component] Issues page changed', props<{navPage: NavigationPage}>());

export const issuesLoaded = createAction('[Profile Component] Issues loaded', props<{issues: Table}>());

export const issuesLoadFailed = createAction('[Profile Component] Issues load failed', props<{message: string}>());

export const issuesCleanFailedMessage = createAction('[Profile Component] Clean issues failed message');