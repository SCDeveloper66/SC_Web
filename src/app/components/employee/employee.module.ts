import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { EmployeeLeaveDetailComponent } from './employee-leave-detail/employee-leave-detail.component';
import { StepsModule } from 'primeng/steps';
import { InputSwitchModule } from 'primeng/inputswitch';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeDetailComponent,
    EmployeeLeaveDetailComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    StepsModule,
    InputSwitchModule
  ],
})
export class EmployeeModule {}
