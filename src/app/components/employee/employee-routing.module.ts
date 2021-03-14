import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';
import { EmployeeLeaveListComponent } from './employee-leave-list/employee-leave-list.component';
import { EmployeeLeaveDetailComponent } from './employee-leave-detail/employee-leave-detail.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeListComponent
  },
  {
    path: 'employee',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeListComponent
  },
  {
    path: 'employee',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeListComponent
  },
  {
    path: 'employee-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeDetailComponent
  },
  {
    path: 'employee-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeDetailComponent
  },
  {
    path: 'employee-leave',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeLeaveListComponent
  },
  {
    path: 'employee-leave-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeLeaveDetailComponent
  },
  {
    path: 'employee-leave-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeLeaveDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
