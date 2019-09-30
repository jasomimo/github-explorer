import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { Observable } from 'rxjs';
import { take, map, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    
    constructor(private store: Store<AppState>) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return this.store
            .select('auth')
            .pipe(
                take(1),
                map(authState => {
                    return authState.user;
                }),
                exhaustMap(user => {
                    
                    // add API version header
                    let clonedHeaders = req.headers.set('accept', 'application/vnd.github.v3+json')

                    if (user) {
                        // add authorization header
                        clonedHeaders = clonedHeaders.set('authorization', 'Basic ' + user.basicAuth);
                    }
                    
                    const clonedRequest = req.clone({headers: clonedHeaders});
                    
                    return next.handle(clonedRequest);
                })
            );
    } 
    
}