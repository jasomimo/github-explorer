import { createAction, props } from '@ngrx/store';
import { Table, NavigationPage } from 'src/app/common/table/model/table.model';

export const devListLocationChanged = createAction('[Developer List Component] Location changed', props<{location: string, currentPage: number, pageSize: number}>());

export const devListTablePageChanged = createAction('[Developer List Component] Table page changed', props<{navPage: NavigationPage}>());

export const devListLoadStarted = createAction('[Developer List Component] Load started');

export const devListLoadSuccessful = createAction('[Developer List Component] Load successful', props<{devsTable: Table}>());

export const devListLoadFailed = createAction('[Developer List Component] Load failed', props<{message: string}>());

export const devListCleanFailedMessage = createAction('[Developer List Component] Clean failed message');
