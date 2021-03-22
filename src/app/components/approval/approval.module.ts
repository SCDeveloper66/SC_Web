import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ApprovalRoutingModule } from './approval-routing.module';
import { EmployeeLeaveListComponent } from './leave/employee-leave-list/employee-leave-list.component';
import { EmployeeLeaveDetailComponent } from './leave/employee-leave-detail/employee-leave-detail.component';
import { EmployeeOtDetailComponent } from './ot/employee-ot-detail/employee-ot-detail.component';
import { EmployeeOtListComponent } from './ot/employee-ot-list/employee-ot-list.component';
import { EmployeeMachineDetailComponent } from './machine/employee-machine-detail/employee-machine-detail.component';
import { EmployeeMachineListComponent } from './machine/employee-machine-list/employee-machine-list.component';

@NgModule({
  declarations: [
    EmployeeLeaveListComponent,
    EmployeeLeaveDetailComponent,
    EmployeeOtDetailComponent,
    EmployeeOtListComponent,
    EmployeeMachineDetailComponent,
    EmployeeMachineListComponent,
  ],
  imports: [
    CommonModule, 
    ApprovalRoutingModule,
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
export class ApprovalModule {}
