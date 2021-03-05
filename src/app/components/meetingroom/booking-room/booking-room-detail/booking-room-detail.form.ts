import { FormControl, Validators } from '@angular/forms';

export class BookingRoomDetailForm {
  bookingRoomDetailFormBuilder = {
    method: new FormControl(null),
    id: new FormControl('0'),
    topic: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
    start_time: new FormControl(null, [Validators.required]),
    stop_time: new FormControl(null, [Validators.required]),
    person_total: new FormControl(null, [Validators.required]),
    room_id: new FormControl(null, [Validators.required]),
    remark: new FormControl(null),
    device_list: new FormControl(null),
    emp_list: new FormControl(null),
    emp_code: new FormControl(null),
    user_id: new FormControl(null),
    br_request: new FormControl(null),
  };
}

