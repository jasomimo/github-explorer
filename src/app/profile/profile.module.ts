import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppCommonModule } from '../common/app-common.module';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from './profile/profile.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { ProfileEffects } from './store/profile.effects';
import { AuthInterceptorService } from '../auth/service/auth-interceptor.service';

@NgModule({
    declarations: [ProfileComponent, NoAccessComponent],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        EffectsModule.forFeature([ProfileEffects]),
        FontAwesomeModule,
        AppCommonModule,
        ProfileRoutingModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ],
    exports: [ProfileComponent]
})
export class ProfileModule { }
