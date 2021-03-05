import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './components/shared/pagenotfound/pagenotfound.component';
import { AuthGuard } from './helpers/auth.guard';
import { RouteGuard } from './helpers/route.guard';
import { CalendarHolidayComponent } from './components/shared/layout/calendar-holiday/calendar-holiday.component';


const routes: Routes = [
  {
    path: 'calendarHoliday',
    component: CalendarHolidayComponent
  },
  {
    path: '',
    canActivate: [AuthGuard, RouteGuard],
    component: HomeComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuard, RouteGuard],
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login/:id',
    component: LoginComponent
  },
  {
    path: 'employee',
    loadChildren: () => import('./components/employee/employee.module').then(m => m.EmployeeModule)
  },
  {
    path: 'meetingroom',
    loadChildren: () => import('./components/meetingroom/meetingroom.module').then(m => m.MeetingroomModule)
  },
  {
    path: 'bookingcar',
    loadChildren: () => import('./components/bookingcar/bookingcar.module').then(m => m.BookingcarModule)
  },
  {
    path: 'projectplan',
    loadChildren: () => import('./components/projectplan/projectplan.module').then(m => m.ProjectplanModule)
  },
  {
    path: 'maindata',
    loadChildren: () => import('./components/maindata/maindata.module').then(m => m.MaindataModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./components/report/report.module').then(m => m.ReportModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./components/setting/setting.module').then(m => m.SettingModule)
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
