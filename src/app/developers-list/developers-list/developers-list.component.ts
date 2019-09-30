import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../../store/app.reducer';
import { Table, NavigationPage } from '../../common/table/model/table.model';
import * as devListAction from '../store/dev-list.actions';

@Component({
    selector: 'app-developers-list',
    templateUrl: './developers-list.component.html',
    styleUrls: ['./developers-list.component.css']
})
export class DevelopersListComponent implements OnInit, OnDestroy {

    searchLocation = 'Bratislava';
    
    devsTable: Table;
    devsIsLoading: boolean;
    
    loadFailedMessage: string;

    private storeSubscription: Subscription;

    constructor(private store: Store<AppState>) { }

    ngOnInit() {
        
        this.storeSubscription = this.store
            .select('devList')
            .subscribe(devListState => {
                
                this.searchLocation = devListState.location;
                this.devsTable = devListState.devsTable;
                this.devsIsLoading = devListState.devsLoadStarted;
                this.loadFailedMessage = devListState.searchFailedMessage;
            });
    }

    ngOnDestroy() {

        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    
    onTableNavigation(navPage: NavigationPage) {
        
        this.store.dispatch(devListAction.devListTablePageChanged({navPage}));
    }
    
    onClose() {
        this.store.dispatch(devListAction.devListCleanFailedMessage());
    }

}
