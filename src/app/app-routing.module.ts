import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DevelopersListComponent } from './developers-list/developers-list/developers-list.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: DevelopersListComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) }, 
	{ path: '**', redirectTo: '/' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
