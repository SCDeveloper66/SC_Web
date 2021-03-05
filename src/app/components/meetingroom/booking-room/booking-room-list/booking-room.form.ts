import { FormControl, Validators } from '@angular/forms';

export class BookingRoomForm {
  bookingRoomFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    room_from: new FormControl(null),
    room_to: new FormControl(null),
    date_from: new FormControl(null),
    date_to: new FormControl(null),
    status_from: new FormControl(null),
    status_to: new FormControl(null),
    user_id: new FormControl(null)
  };
}

