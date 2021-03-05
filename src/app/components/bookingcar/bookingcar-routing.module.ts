import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartypeComponent } from './cartype/cartype.component';
import { CarComponent } from './car/car.component';
import { DestinationComponent } from './destination/destination.component';
import { CarreasonComponent } from './carreason/carreason.component';
import { BookingcarDetailComponent } from './bookingcar/bookingcar-detail/bookingcar-detail.component';
import { BookingcarListComponent } from './bookingcar/bookingcar-list/bookingcar-list.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RouteGuard } from 'src/app/helpers/route.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingcarListComponent
  },
  {
    path: 'bookingcar-list',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingcarListComponent
  },
  {
    path: 'bookingcar-detail',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingcarDetailComponent
  },
  {
    path: 'bookingcar-detail/:id',
    canActivate: [AuthGuard, RouteGuard],
    component: BookingcarDetailComponent
  },
  {
    path: 'car-type',
    canActivate: [AuthGuard, RouteGuard],
    component: CartypeComponent
  },
  {
    path: 'car',
    canActivate: [AuthGuard, RouteGuard],
    component: CarComponent
  },
  {
    path: 'destination',
    canActivate: [AuthGuard, RouteGuard],
    component: DestinationComponent
  },
  {
    path: 'car-reason',
    canActivate: [AuthGuard, RouteGuard],
    component: CarreasonComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingcarRoutingModule { }
