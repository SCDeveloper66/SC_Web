import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeAttRealtimeComponent } from './time-att-realtime/time-att-realtime.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuardAcc } from 'src/app/helpers/route-acc.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';


const routes: Routes = [
  {
    path: 'time-att-realtime',
    canActivate: [AuthGuard, RouteGuard],
    component: TimeAttRealtimeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
