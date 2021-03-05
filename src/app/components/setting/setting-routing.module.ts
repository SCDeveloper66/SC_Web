import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuardAcc } from 'src/app/helpers/route-acc.guard';
import { UserRoleComponent } from './user-role/user-role.component';


const routes: Routes = [
  {
    path: 'user-role',
    canActivate: [AuthGuard],
    component: UserRoleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
