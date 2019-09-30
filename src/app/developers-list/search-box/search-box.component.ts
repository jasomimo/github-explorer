import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/app.reducer';
import * as devListAction from '../store/dev-list.actions';
import { defaultCurrentPage, defaultPageSize } from 'src/app/common/table/model/table.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
    
    private storeSubscription: Subscription;
    
    searchTerm: string;
    searchInputName = 'searchInput';
    
    constructor(private store: Store<AppState>) { }
    
    ngOnInit(): void {
        this.storeSubscription = this.store
            .select('devList')
            .subscribe(devListState => {
                
                this.searchTerm = devListState.location;
            });
    }
    
    onSubmit(form: NgForm) { 
        
        const location = form.value[this.searchInputName];
        
        this.store.dispatch(devListAction.devListLocationChanged({
            location, 
            currentPage: defaultCurrentPage, 
            pageSize: defaultPageSize
        }));
    }
}
