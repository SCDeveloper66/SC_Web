import { ProjectCourseListComponent } from './project-course/project-course-list/project-course-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpertComponent } from './expert/expert.component';
import { ExpenseComponent } from './expense/expense.component';
import { TraindestinationComponent } from './traindestination/traindestination.component';
import { ProjectReportConfigComponent } from './project-report-config/project-report-config.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectCourseDetailComponent } from './project-course/project-course-detail/project-course-detail.component';
import { ProjectFormulaListComponent } from './project-formula/project-formula-list/project-formula-list.component';
import { ProjectFormulaDetailComponent } from './project-formula/project-formula-detail/project-formula-detail.component';
import { TrainingScheduleListComponent } from './training-schedule/training-schedule-list/training-schedule-list.component';
import { TrainingScheduleDetailComponent } from './training-schedule/training-schedule-detail/training-schedule-detail.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectListComponent
  },
  {
    path: 'project',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectListComponent
  },
  {
    path: 'project-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectDetailComponent
  },
  {
    path: 'project-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectDetailComponent
  },
  {
    path: 'project-course',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectCourseListComponent
  },
  {
    path: 'project-course-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectCourseDetailComponent
  },
  {
    path: 'project-course-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectCourseDetailComponent
  },
  {
    path: 'project-training-schedule',
    canActivate: [AuthGuard, RouteGuard],
    component: TrainingScheduleListComponent
  },
  {
    path: 'project-training-schedule-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: TrainingScheduleDetailComponent
  },
  {
    path: 'project-training-schedule-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: TrainingScheduleDetailComponent
  },
  {
    path: 'project-formula',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectFormulaListComponent
  },
  {
    path: 'project-formula-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectFormulaDetailComponent
  },
  {
    path: 'project-formula-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectFormulaDetailComponent
  },
  {
    path: 'expert',
    canActivate: [AuthGuard, RouteGuard],
    component: ExpertComponent
  },
  {
    path: 'expense',
    canActivate: [AuthGuard, RouteGuard],
    component: ExpenseComponent
  },
  {
    path: 'traindestination',
    canActivate: [AuthGuard, RouteGuard],
    component: TraindestinationComponent
  },
  {
    path: 'project-report-config',
    canActivate: [AuthGuard, RouteGuard],
    component: ProjectReportConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectplanRoutingModule { }
