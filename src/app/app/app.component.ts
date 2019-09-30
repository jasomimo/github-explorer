import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as authAction from '../auth/store/auth.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    constructor (private store: Store<AppState>) {}
    
    ngOnInit(): void {
        this.store.dispatch(authAction.authAutoLogin());
    }
    
}
