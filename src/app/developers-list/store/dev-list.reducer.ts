import { createReducer, on, State } from '@ngrx/store';
import cloneDeep  from 'lodash-es/cloneDeep';
import * as devListAction from './dev-list.actions';
import { Table } from 'src/app/common/table/model/table.model';

export interface DevListState {
    location: string, 
    devsLoadStarted: boolean,
    devsTable: Table,
    searchFailedMessage: string
}

const initialState: DevListState = {
    location: null,
    devsLoadStarted: false,
    devsTable: null,
    searchFailedMessage: null
};

const _devListReducer = createReducer(initialState, 
    on(devListAction.devListLocationChanged, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.location = action.location;
        
        return colnedState;
    }),
    on(devListAction.devListLoadStarted, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.devsLoadStarted = true;
        colnedState.devsTable = null;
        colnedState.searchFailedMessage = null;
        
        return colnedState;
    }),
    on(devListAction.devListLoadSuccessful, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.devsLoadStarted = false;
        colnedState.devsTable = cloneDeep(action.devsTable);
        colnedState.searchFailedMessage = null;
        
        return colnedState;
    }),
    on(devListAction.devListLoadFailed, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.devsLoadStarted = false;
        colnedState.devsTable = null;
        colnedState.searchFailedMessage = action.message;
        
        return colnedState;
    }),
    on(devListAction.devListTablePageChanged, (state, action) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.devsLoadStarted = true;
        colnedState.searchFailedMessage = null;
        
        return colnedState;
    }),
    on(devListAction.devListCleanFailedMessage, (state) => {
        
        const colnedState = cloneDeep(state);
        
        colnedState.searchFailedMessage = null;
        
        return colnedState;
    })
);

export function devListReducer(state, action) {
    return _devListReducer(state, action);
}