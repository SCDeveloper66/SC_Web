import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { TimeAttRealtimeComponent } from './time-att-realtime/time-att-realtime.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { ReportEmpScoreComponent } from './report-emp-score/report-emp-score.component';
import { RadioButtonModule } from 'primeng';

@NgModule({
  declarations: [TimeAttRealtimeComponent, ReportEmpScoreComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ListboxModule,
    RadioButtonModule
  ]
})
export class ReportModule { }
