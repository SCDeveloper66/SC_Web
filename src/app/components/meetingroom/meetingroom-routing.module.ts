import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HardwareComponent } from './hardware/hardware.component';
import { RoomComponent } from './room/room.component';
import { BookingRoomConfigComponent } from './booking-room-config/booking-room-config.component';
import { ConfigMeetingComponent } from './config-meeting/config-meeting.component';
import { BookingRoomListComponent } from './booking-room/booking-room-list/booking-room-list.component';
import { BookingRoomDetailComponent } from './booking-room/booking-room-detail/booking-room-detail.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingRoomListComponent
  },
  {
    path: 'bookingroom',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingRoomListComponent
  },
  {
    path: 'bookingroom-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingRoomDetailComponent
  },
  {
    path: 'bookingroom-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingRoomDetailComponent
  },
  {
    path: 'hardware',
    canActivate: [AuthGuard, RouteGuard],
    component: HardwareComponent
  },
  {
    path: 'room',
    canActivate: [AuthGuard, RouteGuard],
    component: RoomComponent
  },
  {
    path: 'bookingroom-config',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingRoomConfigComponent
  },
  {
    path: 'config-meeting',
    canActivate: [AuthGuard, RouteGuard],
    component: ConfigMeetingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingroomRoutingModule { }
