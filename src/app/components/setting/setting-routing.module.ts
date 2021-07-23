import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuardAcc } from 'src/app/helpers/route-acc.guard';
import { LanguageComponent } from './language/language.component';
import { UserRoleComponent } from './user-role/user-role.component';


const routes: Routes = [
  {
    path: 'user-role',
    canActivate: [AuthGuard],
    component: UserRoleComponent
  },
  {
    path: 'language',
    canActivate: [AuthGuard],
    component: LanguageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
