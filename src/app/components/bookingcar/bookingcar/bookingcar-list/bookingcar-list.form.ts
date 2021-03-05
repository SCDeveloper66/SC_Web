import { FormControl, Validators } from '@angular/forms';

export class BookingCarlistForm {
  bookingCarlistFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    car_type_from: new FormControl(null),
    car_type_to: new FormControl(null),
    car_license_from: new FormControl(null),
    car_license_to: new FormControl(null),
    date_from: new FormControl(null),
    date_to: new FormControl(null),
    car_reason_from: new FormControl(null),
    car_reason_to: new FormControl(null),
    status_from: new FormControl(null),
    status_to: new FormControl(null),
    carTypes: new FormControl(null),
    user_id: new FormControl(null)
  };
}

