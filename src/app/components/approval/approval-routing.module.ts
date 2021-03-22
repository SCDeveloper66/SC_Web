import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';
import { EmployeeLeaveDetailComponent } from './leave/employee-leave-detail/employee-leave-detail.component';
import { EmployeeLeaveListComponent } from './leave/employee-leave-list/employee-leave-list.component';
import { EmployeeMachineDetailComponent } from './machine/employee-machine-detail/employee-machine-detail.component';
import { EmployeeMachineListComponent } from './machine/employee-machine-list/employee-machine-list.component';
import { EmployeeOtDetailComponent } from './ot/employee-ot-detail/employee-ot-detail.component';
import { EmployeeOtListComponent } from './ot/employee-ot-list/employee-ot-list.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeLeaveListComponent
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
  {
    path: 'employee-ot',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeOtListComponent
  },
  {
    path: 'employee-ot-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeOtDetailComponent
  },
  {
    path: 'employee-ot-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeOtDetailComponent
  },
  {
    path: 'employee-machine',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeMachineListComponent
  },
  {
    path: 'employee-machine-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeMachineDetailComponent
  },
  {
    path: 'employee-machine-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: EmployeeMachineDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
