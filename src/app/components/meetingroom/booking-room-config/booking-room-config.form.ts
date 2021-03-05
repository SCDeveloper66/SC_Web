import { FormControl, Validators } from '@angular/forms';

export class BookingRoomConfigForm {
  bookingRoomConfigFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    timeconfig: new FormControl(null, [Validators.required]),
    user_id: new FormControl(null)
  };
}
