import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectplanRoutingModule } from './projectplan-routing.module';
import { ExpertComponent } from './expert/expert.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExpenseComponent } from './expense/expense.component';
import { TraindestinationComponent } from './traindestination/traindestination.component';
import { ProjectReportConfigComponent } from './project-report-config/project-report-config.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectCourseListComponent } from './project-course/project-course-list/project-course-list.component';
import { ProjectCourseDetailComponent } from './project-course/project-course-detail/project-course-detail.component';
import { ProjectFormulaDetailComponent } from './project-formula/project-formula-detail/project-formula-detail.component';
import { ProjectFormulaListComponent } from './project-formula/project-formula-list/project-formula-list.component';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TrainingScheduleListComponent } from './training-schedule/training-schedule-list/training-schedule-list.component';
import { TrainingScheduleDetailComponent } from './training-schedule/training-schedule-detail/training-schedule-detail.component';

@NgModule({
  declarations: [
    ExpertComponent,
    ExpenseComponent,
    TraindestinationComponent,
    ProjectReportConfigComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectCourseListComponent,
    ProjectCourseDetailComponent,
    ProjectFormulaDetailComponent,
    ProjectFormulaListComponent,
    TrainingScheduleListComponent,
    TrainingScheduleDetailComponent
  ],
  imports: [
    CommonModule,
    ProjectplanRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    ListboxModule,
    InputTextareaModule,
    RadioButtonModule
  ]
})
export class ProjectplanModule { }
