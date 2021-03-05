import { FormControl, Validators } from '@angular/forms';

export class BookingRoomQRCodeForm {
  bookingRoomQRCodeFormBuilder = {
    method: new FormControl(null),
    id: new FormControl(null),
    room_name: new FormControl(null),
    topic: new FormControl(null),
    req_date: new FormControl(null),
    start_date: new FormControl(null),
    stop_date: new FormControl(null),
    user_id: new FormControl(null)
  };
}
