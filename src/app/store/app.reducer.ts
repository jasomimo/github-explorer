import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from '../auth/store/auth.reducer';
import { ProfileState, profileReducer } from '../profile/store/profile.reducer';
import { DevListState, devListReducer } from '../developers-list/store/dev-list.reducer';

export interface AppState {
    auth: AuthState,
    profile: ProfileState,
    devList: DevListState
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: authReducer,
    profile: profileReducer,
    devList: devListReducer
}