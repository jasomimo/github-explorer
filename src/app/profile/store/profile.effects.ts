import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';

import * as profileAction from './profile.actions';
import { AppState } from 'src/app/store/app.reducer';
import { ProfileResponse, Profile } from '../model/profile.model';
import { RepositoryResponse, RepositoryColumn } from '../model/repository.model';
import { FollowerResponse } from '../model/follower.model';
import { Column, Row, RowItemLink, RowItemDate, RowItemNumber, AppTable, TableData, defaultPageSize, defaultCurrentPage, NavigationPage, RowItemImage, RowItemBoolean } from 'src/app/common/table/model/table.model';
import { TableService } from 'src/app/common/table/service/table.service';
import { IssueResponse } from '../model/issue.model';
import { ErrorMessageService } from 'src/app/common/table/service/error-message.service';

@Injectable()
export class ProfileEffects {
    
    constructor(private actions$: Actions,
                private http: HttpClient,
                private tableService: TableService,
                private store: Store<AppState>,
                private locationService: Location,
                private errorMessageService: ErrorMessageService) {}
    
    // Profile
    @Effect()
    profileLoadStarted = this.actions$
        .pipe(
            ofType(profileAction.profileLoadStarted),
            switchMap(action => {
                
                return this.http
                    .get<ProfileResponse>('https://api.github.com/users/' + action.login)
                    .pipe(
                        map(response => {
                
                            const profile: Profile = {
                                id: response.id,
                                login: response.login,
                                name: response.name,
                                avatarUrl: response.avatar_url,
                                location: response.location,
                                registrationDate: new Date(response.created_at),
                                repositoriesCount: response.public_repos,
                                repositoriesUrl: response.repos_url,
                                followersCount: response.followers,
                                followersUrl: response.followers_url
                            }
                            
                            return profileAction.profileLoaded({profile});
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.profileLoadFailed({message: 'Unable to load user profile. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    @Effect()
    profileLoaded = this.actions$
        .pipe(
            ofType(profileAction.profileLoaded),
            switchMap(action => {
                
                const actionsArray = [];
                if (action.profile.repositoriesCount > 0) {
                    
                    actionsArray.push(
                        profileAction.reposLoadStarted({reposUrl: action.profile.repositoriesUrl})
                    );
                }
                
                if (action.profile.followersCount > 0) {
                    
                    actionsArray.push(
                        profileAction.followersLoadStarted({followersUrl: action.profile.followersUrl})
                    );
                }
                
                if (this.locationService.path() === '/profile') {
                    // logged in user is on their own profile
                    actionsArray.push(
                        profileAction.issuesLoadStarted()
                    );
                }
                
                return actionsArray;
            })
        );
    
    
        
    // Repos
    @Effect()
    reposLoadStarted = this.actions$
        .pipe(
            ofType(profileAction.reposLoadStarted),
            switchMap(action => {
                
                const pagingUrl = action.reposUrl + '?' + this.getPagingParams(defaultCurrentPage, defaultPageSize);
                
                const sortAscending = false
                const sortBy = RepositoryColumn.updated;
                
                const searchUrl = pagingUrl + '&' + this.getSortingParams(sortBy, sortAscending);
                
                return this.http
                    .get<RepositoryResponse[]>(searchUrl, {observe: 'response'})
                    .pipe(
                        withLatestFrom(this.store.select('profile')),
                        map(([response, profileState]) => {
                            
                            const tableData: TableData = {
                                currentUrl: pagingUrl,
                                currentPage: defaultCurrentPage,
                                pageSize: defaultPageSize,
                                totalRecords: profileState.profile.repositoriesCount,
                                sortBy: sortBy,
                                sortAscending: sortAscending
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulReposResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.reposLoadFailed({message: 'Unable to load repositories. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
    
    @Effect()
    reposTablePageChanged = this.actions$
        .pipe(
            ofType(profileAction.reposPageChanged),
            withLatestFrom(this.store.select('profile')),
            switchMap(([action, profileState]) => {
                
                let navigationUrl: string;
                let newCurrentPage: number;
                
                const reposTable = profileState.repos;
                
                switch (action.navPage) {
                    
                    case NavigationPage.First:
                        newCurrentPage = 1;
                        navigationUrl = reposTable.firstUrl;
                        break;
                        
                    case NavigationPage.Previous:
                        newCurrentPage = reposTable.currentPage - 1;
                        navigationUrl = reposTable.previousUrl;
                        break;
                        
                    case NavigationPage.Next:
                        newCurrentPage = reposTable.currentPage + 1;
                        navigationUrl = reposTable.nextUrl;
                        break;
                        
                    case NavigationPage.Last:
                        newCurrentPage = this.tableService.getLastPage(reposTable.totalRecords, reposTable.pageSize);
                        navigationUrl = reposTable.lastUrl;
                        break;
                        
                    default:
                        break;
                }
                
                const searchUrl = navigationUrl + '&' + this.getSortingParams(reposTable.sortBy, reposTable.sortAscending);
                
                return this.http
                    .get<RepositoryResponse[]>(searchUrl, {observe: 'response'})
                    .pipe(
                        withLatestFrom(this.store.select('profile')),
                        map(([response, profileState]) => {
                            
                            const tableData: TableData = {
                                currentUrl: navigationUrl,
                                currentPage: newCurrentPage,
                                pageSize: defaultPageSize,
                                totalRecords: profileState.profile.repositoriesCount,
                                sortBy: reposTable.sortBy,
                                sortAscending: reposTable.sortAscending
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulReposResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.reposLoadFailed({message: 'Unable to load repositories. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    @Effect()
    reposSortChanged = this.actions$
        .pipe(
            ofType(profileAction.reposSortChanged),
            withLatestFrom(this.store.select('profile')),
            switchMap(([action, profileState]) => {
                
                const reposTable = profileState.repos;
                const searchUrl = reposTable.currentUrl + '&' + this.getSortingParams(action.sortBy, action.sortAscending);
                
                return this.http
                    .get<RepositoryResponse[]>(searchUrl, {observe: 'response'})
                    .pipe(
                        withLatestFrom(this.store.select('profile')),
                        map(([response, profileState]) => {
                            
                            const tableData: TableData = {
                                currentUrl: reposTable.currentUrl,
                                currentPage: reposTable.currentPage,
                                pageSize: defaultPageSize,
                                totalRecords: profileState.profile.repositoriesCount,
                                sortBy: action.sortBy,
                                sortAscending: action.sortAscending
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulReposResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.reposLoadFailed({message: 'Unable to load repositories. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    private handleSuccessfulReposResponse(response: HttpResponse<RepositoryResponse[]>, tableData: TableData) {
        
        const responeRepositories = response.body;
            
        if (responeRepositories.length === 0) {
            return profileAction.reposLoaded({repos: null});
        }
        
        const columns: Column[] = [
            { id: RepositoryColumn.full_name, label: 'Name', sortable: false },
            { id: RepositoryColumn.created, label: 'Created', sortable: true }, 
            { id: RepositoryColumn.updated, label: 'Updated', sortable: true }, 
            { id: RepositoryColumn.forks_count, label: 'Forks', sortable: false }, 
            { id: RepositoryColumn.stargazers_count, label: 'Stars', sortable: false }, 
            { id: RepositoryColumn.watchers_count, label: 'Watchers', sortable: false }
        ];
        
        const rows: Row[] = [];
        
        for (const responseRepository of responeRepositories) {
    
            rows.push({
                id: responseRepository.id,
                rowItems: [
                    new RowItemLink(RepositoryColumn.full_name,  responseRepository.name, responseRepository.html_url, true),
                    new RowItemDate(RepositoryColumn.created, new Date(responseRepository.created_at)),
                    new RowItemDate(RepositoryColumn.updated, new Date(responseRepository.updated_at)),
                    new RowItemNumber(RepositoryColumn.forks_count, responseRepository.forks_count),
                    new RowItemNumber(RepositoryColumn.stargazers_count, responseRepository.stargazers_count),
                    new RowItemNumber(RepositoryColumn.watchers_count, responseRepository.watchers_count)
                ]
            })
        }
        
        const navLinks = this.tableService.getNavLinksFromHeader(response.headers.get('link'));
        
        const reposTable = new AppTable(
            columns, 
            rows, 
            tableData.currentUrl,
            tableData.totalRecords,
            tableData.currentPage,
            defaultPageSize,
            navLinks.first,
            navLinks.previous,
            navLinks.next, 
            navLinks.last,
            tableData.sortBy,
            tableData.sortAscending);
                        
        return profileAction.reposLoaded({repos: reposTable});
    }
    
    // Followers
    @Effect()
    followersLoadStarted = this.actions$
        .pipe(
            ofType(profileAction.followersLoadStarted),
            switchMap(action => {
                
                const searchUrl = action.followersUrl + '?' + this.getPagingParams(defaultCurrentPage, defaultPageSize);
                
                return this.http
                    .get<FollowerResponse[]>(searchUrl, {observe: 'response'})
                    .pipe(
                        withLatestFrom(this.store.select('profile')),
                        map(([response, profileState]) => {
                            
                            const tableData: TableData = {
                                currentUrl: searchUrl,
                                currentPage: defaultCurrentPage,
                                pageSize: defaultPageSize,
                                totalRecords: profileState.profile.followersCount,
                                sortBy: null,
                                sortAscending: null
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulFollowersResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.followersLoadFailed({message: 'Unable to load followers. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    @Effect()
    followersTablePageChanged = this.actions$
        .pipe(
            ofType(profileAction.followersPageChanged),
            withLatestFrom(this.store.select('profile')),
            switchMap(([action, profileState]) => {
                
                let searchUrl: string;
                let newCurrentPage: number;
                
                switch (action.navPage) {
                    
                    case NavigationPage.First:
                        newCurrentPage = 1;
                        searchUrl = profileState.followers.firstUrl;
                        break;
                        
                    case NavigationPage.Previous:
                        newCurrentPage = profileState.followers.currentPage - 1;
                        searchUrl = profileState.followers.previousUrl;
                        break;
                        
                    case NavigationPage.Next:
                        newCurrentPage = profileState.followers.currentPage + 1;
                        searchUrl = profileState.followers.nextUrl;
                        break;
                        
                    case NavigationPage.Last:
                        newCurrentPage = this.tableService.getLastPage(profileState.followers.totalRecords, profileState.followers.pageSize);
                        searchUrl = profileState.followers.lastUrl;
                        break;
                        
                    default:
                        break;
                }
                
                return this.http
                    .get<FollowerResponse[]>(searchUrl, {observe: 'response'})
                    .pipe(
                        withLatestFrom(this.store.select('profile')),
                        map(([response, profileState]) => {
                            
                            const tableData: TableData = {
                                currentUrl: searchUrl,
                                currentPage: newCurrentPage,
                                pageSize: defaultPageSize,
                                totalRecords: profileState.profile.followersCount,
                                sortBy: null,
                                sortAscending: null
                            };
                            
                            return {
                                response: response,
                                tableData: tableData
                            };
                        }),
                        map(data => {
                            return this.handleSuccessfulFollowersResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                            
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.followersLoadFailed({message: 'Unable to load followers. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    private handleSuccessfulFollowersResponse(response: HttpResponse<FollowerResponse[]>, tableData: TableData) {
    
        const responeFollowers = response.body;
            
        if (responeFollowers.length === 0) {
            profileAction.followersLoaded({followers: null});
        }
        
        const columnId = {
            avatar: 'avatar',
            login: 'login'
        };
        
        const columns: Column[] = [
            { id: columnId.avatar, label: 'Avatar', sortable: false },
            { id: columnId.login, label: 'Login', sortable: false }
        ];
        
        const rows: Row[] = [];
        
        for (const responseFollower of responeFollowers) {
    
            rows.push({
                id: responseFollower.id,
                rowItems: [
                    new RowItemImage(columnId.avatar, responseFollower.avatar_url, 'Avatar image'),
                    new RowItemLink(columnId.login, responseFollower.login, '/profile/' + responseFollower.login, false)
                ]
            });
        }
        
        const navLinks = this.tableService.getNavLinksFromHeader(response.headers.get('link'));
        
        const followersTable = new AppTable(
            columns, 
            rows, 
            tableData.currentUrl,
            tableData.totalRecords,
            tableData.currentPage,
            tableData.pageSize,
            navLinks.first,
            navLinks.previous,
            navLinks.next, 
            navLinks.last,
            tableData.sortBy,
            tableData.sortAscending);
                        
        return profileAction.followersLoaded({followers: followersTable});
    }
    
    // Issues
    @Effect()
    issuesLoadStarted = this.actions$
        .pipe(
            ofType(profileAction.issuesLoadStarted),
            switchMap(action => {
                
                const searchUrl = 'https://api.github.com/issues?filter=all' + '&' + this.getPagingParams(defaultCurrentPage, defaultPageSize);
                
                return this.http
                    .get<IssueResponse[]>(searchUrl, {observe: 'response'})
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
                            return this.handleSuccessfulIssuesResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.issuesLoadFailed({message: 'Unable to load issues. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    @Effect()
    issuesTablePageChanged = this.actions$
        .pipe(
            ofType(profileAction.issuesPageChanged),
            withLatestFrom(this.store.select('profile')),
            switchMap(([action, profileState]) => {
                
                let searchUrl: string;
                let newCurrentPage: number;
                
                switch (action.navPage) {
                    
                    case NavigationPage.First:
                        newCurrentPage = 1;
                        searchUrl = profileState.issues.firstUrl;
                        break;
                        
                    case NavigationPage.Previous:
                        newCurrentPage = profileState.issues.currentPage - 1;
                        searchUrl = profileState.issues.previousUrl;
                        break;
                        
                    case NavigationPage.Next:
                        newCurrentPage = profileState.issues.currentPage + 1;
                        searchUrl = profileState.issues.nextUrl;
                        break;
                        
                    case NavigationPage.Last:
                        newCurrentPage = this.tableService.getLastPage(profileState.issues.totalRecords, profileState.issues.pageSize);
                        searchUrl = profileState.issues.lastUrl;
                        break;
                        
                    default:
                        break;
                }
                
                return this.http
                    .get<IssueResponse[]>(searchUrl, {observe: 'response'})
                    .pipe(
                        map (response => {
                            
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
                            return this.handleSuccessfulIssuesResponse(data.response, data.tableData);
                        }),
                        catchError(error => {
                
                            const errorMessage = this.errorMessageService.tryParseErrorMessage(error);
                            return of(profileAction.issuesLoadFailed({message: 'Unable to load issues. Error details: ' + errorMessage}));
                        })
                    );
            })
        );
        
    private handleSuccessfulIssuesResponse(response: HttpResponse<IssueResponse[]>, tableData: TableData) {

        const responeIssues = response.body;
            
        if (responeIssues.length === 0) {
            return profileAction.issuesLoaded({issues: null});
        }
        
        const columnId = {
            title: 'title',
            comments: 'comments',
            created: 'created',
            updated: 'updated',
            closed: 'closed'
        };
        
        const columns: Column[] = [
            { id: columnId.title, label: 'Title', sortable: false },
            { id: columnId.comments, label: 'Comments', sortable: false },
            { id: columnId.created, label: 'Created', sortable: false },
            { id: columnId.updated, label: 'Updated', sortable: false },
            { id: columnId.closed, label: 'Closed', sortable: false }
        ];
        
        const rows: Row[] = [];
        
        for (const responseIssue of responeIssues) {
            
            rows.push({
                id: responseIssue.id,
                rowItems: [
                    new RowItemLink(columnId.title, responseIssue.title, responseIssue.html_url, true),
                    new RowItemNumber(columnId.comments, responseIssue.comments),
                    new RowItemDate(columnId.created, new Date(responseIssue.created_at)),
                    new RowItemDate(columnId.updated, new Date(responseIssue.updated_at)),
                    new RowItemBoolean(columnId.closed, !!responseIssue.closed_at),
                ]
            });
        }
        
        const navLinks = this.tableService.getNavLinksFromHeader(response.headers.get('link'));
        
        const issuesTable = new AppTable(
            columns, 
            rows, 
            tableData.currentUrl,
            tableData.totalRecords || responeIssues.length,
            tableData.currentPage,
            tableData.pageSize,
            navLinks.first,
            navLinks.previous,
            navLinks.next, 
            navLinks.last,
            tableData.sortBy,
            tableData.sortAscending);
        
        return profileAction.issuesLoaded({issues: issuesTable});
    }
    
    private getPagingParams(currentPage: number, pageSize: number): string {
        return 'page=' + currentPage + '&per_page=' + pageSize;
    }
    
    private getSortingParams(sortBy:string, sortAscending: boolean): string {
        return 'sort=' + sortBy + '&direction=' + (sortAscending ? 'asc' : 'desc');
    }
}