import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './common/app-common.module';
import { AppComponent } from './app/app.component';
import { HeaderComponent } from './header/header.component';
import { SearchBoxComponent } from './developers-list/search-box/search-box.component';
import { DevelopersListComponent } from './developers-list/developers-list/developers-list.component';
import { LoginComponent } from './auth/login/login.component';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { DevListffects } from './developers-list/store/dev-list.effects';
import { AuthInterceptorService } from './auth/service/auth-interceptor.service';
import { environment } from '../environments/environment';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SearchBoxComponent,
        DevelopersListComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        StoreModule.forRoot(appReducer),
        EffectsModule.forRoot([AuthEffects, DevListffects]),
        FontAwesomeModule,
        StoreDevtoolsModule.instrument({logOnly: environment.production}),
        AppRoutingModule,
        AppCommonModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
