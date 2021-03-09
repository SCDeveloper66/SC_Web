import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { NodeComponent } from './node/node.component';
import { HolidayComponent } from './holiday/holiday.component';
import { EmpCheckinPermanentComponent } from './emp-checkin-permanent/emp-checkin-permanent.component';
import { EmpCheckinTemporaryComponent } from './emp-checkin-temporary/emp-checkin-temporary.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';
import { NewsComponent } from './news/news.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ImageSlideComponent } from './image-slide/image-slide.component';
import { CalendarHolidayComponent } from './calendar-holiday/calendar-holiday.component';
import { ImportDataComponent } from './import-data/import-data.component';
import { ImportUserRoleComponent } from './import-user-role/import-user-role.component';
import { ImportActivityScoreComponent } from './import-activity-score/import-activity-score.component';
import { ImportActivityPointComponent } from './import-activity-point/import-activity-point.component';
import { ActivityOutdoorComponent } from './activity-outdoor/activity-outdoor.component';
import { ActivityComponent } from './activity/activity.component';


const routes: Routes = [
  {
    path: 'news',
    canActivate: [AuthGuard, RouteGuard],
    component: NewsComponent
  },
  {
    path: 'image-slide',
    canActivate: [AuthGuard, RouteGuard],
    component: ImageSlideComponent
  },
  {
    path: 'benefits',
    canActivate: [AuthGuard, RouteGuard],
    component: BenefitsComponent
  },
  {
    path: 'node',
    canActivate: [AuthGuard, RouteGuard],
    component: NodeComponent
  },
  {
    path: 'department',
    canActivate: [AuthGuard, RouteGuard],
    component: DepartmentComponent
  },
  {
    path: 'holiday',
    canActivate: [AuthGuard, RouteGuard],
    component: HolidayComponent
  },
  {
    path: 'emp-checkin-permanent',
    canActivate: [AuthGuard, RouteGuard],
    component: EmpCheckinPermanentComponent
  },
  {
    path: 'emp-checkin-temporary',
    canActivate: [AuthGuard, RouteGuard],
    component: EmpCheckinTemporaryComponent
  },
  {
    path: 'calendar-holiday',
    // canActivate: [AuthGuard, RouteGuard],
    component: CalendarHolidayComponent
  },
  {
    path: 'import-data',
    canActivate: [AuthGuard, RouteGuard],
    component: ImportDataComponent
  },
  {
    path: 'import-user-role',
    canActivate: [AuthGuard, RouteGuard],
    component: ImportUserRoleComponent
  },
  {
    path: 'import-activity-score',
    canActivate: [AuthGuard, RouteGuard],
    component: ImportActivityScoreComponent
  },
  {
    path: 'import-activity-point',
    canActivate: [AuthGuard, RouteGuard],
    component: ImportActivityPointComponent
  },
  {
    path: 'activity-outdoor',
    canActivate: [AuthGuard, RouteGuard],
    component: ActivityOutdoorComponent
  },
  {
    path: 'activity',
    canActivate: [AuthGuard, RouteGuard],
    component: ActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaindataRoutingModule { }
