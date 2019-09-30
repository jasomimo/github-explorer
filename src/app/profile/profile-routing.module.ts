import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthProfileGuard } from './guard/auth-profile-guard.service';
import { NoAccessComponent } from './no-access/no-access.component';
import { NoAccessGuard } from './guard/no-access-guard.service';
import { ProfileGuard } from './guard/profile-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProfileComponent, canActivate: [AuthProfileGuard] },
  { path: 'no-access', component: NoAccessComponent, canActivate: [NoAccessGuard] },
  { path: ':login', component: ProfileComponent, canActivate: [ProfileGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ProfileRoutingModule { }
