import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingcarRoutingModule } from './bookingcar-routing.module';
import { CartypeComponent } from './cartype/cartype.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CarComponent } from './car/car.component';
import { DropdownModule } from 'primeng/dropdown';
import { DestinationComponent } from './destination/destination.component';
import { CarreasonComponent } from './carreason/carreason.component';
import { BookingcarDetailComponent } from './bookingcar/bookingcar-detail/bookingcar-detail.component';
import { BookingcarListComponent } from './bookingcar/bookingcar-list/bookingcar-list.component';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { ColorPickerModule } from 'primeng/colorpicker';

@NgModule({
  declarations: [
    CartypeComponent,
    CarComponent,
    DestinationComponent,
    CarreasonComponent,
    BookingcarDetailComponent,
    BookingcarListComponent
  ],
  imports: [
    CommonModule,
    BookingcarRoutingModule,
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
export class BookingcarModule { }
