import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingroomRoutingModule } from './meetingroom-routing.module';
import { HardwareComponent } from './hardware/hardware.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RoomComponent } from './room/room.component';
import { BookingRoomConfigComponent } from './booking-room-config/booking-room-config.component';
import { ConfigMeetingComponent } from './config-meeting/config-meeting.component';
import { BookingRoomListComponent } from './booking-room/booking-room-list/booking-room-list.component';
import { BookingRoomDetailComponent } from './booking-room/booking-room-detail/booking-room-detail.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { ColorPickerModule } from 'primeng/colorpicker';

@NgModule({
  declarations: [
    HardwareComponent,
    RoomComponent,
    BookingRoomConfigComponent,
    ConfigMeetingComponent,
    BookingRoomListComponent,
    BookingRoomDetailComponent
  ],
  imports: [
    CommonModule,
    MeetingroomRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ListboxModule,
    FullCalendarModule,
    ColorPickerModule
  ]
})
export class MeetingroomModule { }
