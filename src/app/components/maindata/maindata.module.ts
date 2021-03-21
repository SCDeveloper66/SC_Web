import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaindataRoutingModule } from './maindata-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DepartmentComponent } from './department/department.component';
import { NodeComponent } from './node/node.component';
import { HolidayComponent } from './holiday/holiday.component';
import { EmpCheckinPermanentComponent } from './emp-checkin-permanent/emp-checkin-permanent.component';
import { EmpCheckinTemporaryComponent } from './emp-checkin-temporary/emp-checkin-temporary.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { NewsComponent } from './news/news.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ImageSlideComponent } from './image-slide/image-slide.component';
import { CalendarHolidayComponent } from './calendar-holiday/calendar-holiday.component';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { ImportDataComponent } from './import-data/import-data.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ImportUserRoleComponent } from './import-user-role/import-user-role.component';
import { ImportActivityScoreComponent } from './import-activity-score/import-activity-score.component';
import { ImportActivityPointComponent } from './import-activity-point/import-activity-point.component';
import { ActivityOutdoorComponent } from './activity-outdoor/activity-outdoor.component';
import { ActivityComponent } from './activity/activity.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [
    DepartmentComponent,
    NodeComponent,
    HolidayComponent,
    EmpCheckinPermanentComponent,
    EmpCheckinTemporaryComponent,
    NewsComponent,
    BenefitsComponent,
    ImageSlideComponent,
    CalendarHolidayComponent,
    ImportDataComponent,
    ImportUserRoleComponent,
    ImportActivityScoreComponent,
    ImportActivityPointComponent,
    ActivityOutdoorComponent,
    ActivityComponent
  ],
  imports: [
    CommonModule,
    MaindataRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    ListboxModule,
    FullCalendarModule,
    FileUploadModule,
    InputSwitchModule
  ]
})
export class MaindataModule { }
