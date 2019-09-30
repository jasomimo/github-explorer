import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { switchMap, catchError, map, tap, mergeAll, take, withLatestFrom } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as devListAction from './dev-list.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { AppTable, Column, Row, RowItemImage, RowItemLink, NavigationPage, defaultPageSize, defaultCurrentPage, TableData } from 'src/app/common/table/model/table.model';
import { of } from 'rxjs';
import { TableService } from 'src/app/common/table/service/table.service';
import { DevListState } from './dev-list.reducer';
import { ErrorMessageService } from 'src/app/common/table/service/error-message.service';

interface UserSearchItem {
    id: number,
    login: string,
    avatar_url: string,
    url: string
}

interface UserSearchResponse {
    total_count: number,
    incomplete_results: boolean,
    items: UserSearchItem[]
}

@Injectable()
export class DevListffects {
    
    private placeholder = {
        location: '{location}',
        currentPage: '{currentPage}',
        pageSize: '{pageSize}'
    };
    
    private searchUsersEndpoint = 
        'https://api.github.com/search/users?q=type:User+location:"' + this.placeholder.location + '"&page=' + this.placeholder.currentPage + '&per_page=' + this.placeholder.pageSize + '';
    
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<AppState>,
                private tableService: TableService,
                private errorMessageService: ErrorMessageService) {}
    
    @Effect()
    locationChanged = this.actions$
        .pipe(
            ofType(devListAction.devListLocationChanged),
            switchMap(action => {
                return of(devListAction.devListLoadStarted());
            })
        );
        
    @Effect()
    devListLoadStarted = this.actions$
        .pipe(
            ofType(devListAction.devListLoadStarted),
            withLatestFrom(this.store.select('devList')),
            switchMap(([action, devListState]) => {
                
                const searchUrl = this.searchUsersEndpoint
                    .replace(this.placeholder.location, devListState.location)
                    .replace(this.placeholder.pageSize, defaultPageSize.toString())
                    .replace(this.placeholder.currentPage, defaultCurrentPage.toString());
                
                return this.http
                    .get<UserSearchResponse>(searchUrl, {observe: 'response'})
                    .pipe(
                        map(response => {
                            
                            const tableData: TableData = {
                                currentUrl: searchUrl,
                                currentPage: defaultCurrentPage,
                                pageSize: defaultPageSize,
                                totalRecords: null,
                                sortBy: null,
                                sortAscending: null
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(devListAction.devListLoadFailed({message: 'Unable to load GitHub users. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    @Effect()
    devListTablePageChanged = this.actions$
        .pipe(
            ofType(devListAction.devListTablePageChanged),
            withLatestFrom(this.store.select('devList')),
            switchMap(([action, devListState]) => {
                
                let searchUrl: string;
                let newCurrentPage: number;
                
                switch (action.navPage) {
                    
                    case NavigationPage.First:
                        newCurrentPage = 1;
                        searchUrl = devListState.devsTable.firstUrl;
                        break;
                        
                    case NavigationPage.Previous:
                        newCurrentPage = devListState.devsTable.currentPage - 1;
                        searchUrl = devListState.devsTable.previousUrl;
                        break;
                        
                    case NavigationPage.Next:
                        newCurrentPage = devListState.devsTable.currentPage + 1;
                        searchUrl = devListState.devsTable.nextUrl;
                        break;
                        
                    case NavigationPage.Last:
                        newCurrentPage = this.tableService.getLastPage(devListState.devsTable.totalRecords, devListState.devsTable.pageSize);
                        searchUrl = devListState.devsTable.lastUrl;
                        break;
                        
                    default:
                        break;
                }
                
                return this.http
                    .get<UserSearchResponse>(searchUrl, {observe: 'response'})
                    .pipe(
                        map(response => {
                            
                            const tableData: TableData = {
                                currentUrl: searchUrl,
                                currentPage: newCurrentPage,
                                pageSize: defaultPageSize,
                                totalRecords: null,
                                sortBy: null,
                                sortAscending: null
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(devListAction.devListLoadFailed({message: 'Unable to load GitHub users. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    private handleSuccessfulResponse(response: HttpResponse<UserSearchResponse>, tableData: TableData) {
        
        const userSearchResponse = response.body;
        
        if (userSearchResponse.total_count === 0) {
            
            return devListAction.devListLoadSuccessful({devsTable: null});
        }
        
        const columnId = {
            avatar: 'avatar',
            login: 'login'
        }
        
        const columns: Column[] = [
            { id: columnId.avatar, label: 'Avatar', sortable: false },
            { id: columnId.login, label: 'Login', sortable: false }
        ];
        
        const rows: Row[] = [];
        
        for (const userItem of userSearchResponse.items) {
            
            rows.push({
                id: userItem.id,
                rowItems: [
                    new RowItemImage(columnId.avatar, userItem.avatar_url, 'Avatar image'),
                    new RowItemLink(columnId.login, userItem.login, '/profile/' + userItem.login, false)
                ]
            })
        }
        
        const navLinks = this.tableService.getNavLinksFromHeader(response.headers.get('link'));
            
        const devsTable = new AppTable(
            columns, 
            rows, 
            tableData.currentUrl,
            tableData.totalRecords || userSearchResponse.total_count,
            tableData.currentPage, 
            tableData.pageSize,
            navLinks.first,
            navLinks.previous,
            navLinks.next,
            navLinks.last,
            tableData.sortBy,
            tableData.sortAscending);
        
        return devListAction.devListLoadSuccessful({devsTable});
    }
}