import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingRoutingModule } from './setting-routing.module';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { UserRoleComponent } from './user-role/user-role.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PickListModule } from 'primeng/picklist';

@NgModule({
  declarations: [
    UserRoleComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ListboxModule,
    InputSwitchModule,
    PickListModule
  ]
})
export class SettingModule { }
